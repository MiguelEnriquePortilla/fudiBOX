import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
test('install manifest and all PNG icons are publicly accessible', async () => {
 const res = await fetch(base+'/manifest.webmanifest');
 assert.equal(res.status,200);
 const manifest = await res.json();
 assert.equal(manifest.display,'standalone'); assert.equal(manifest.start_url,'/'); assert.equal(manifest.scope,'/');
 assert.ok(manifest.icons.some(i=>i.purpose==='maskable'));
 for(const icon of manifest.icons) {
  const image=await fetch(base+icon.src); assert.equal(image.status,200);
  const bytes=Buffer.from(await image.arrayBuffer());
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,icon.sizes);
 }
 const html=await (await fetch(base+'/')).text();
 assert.match(html,/manifest\.webmanifest/); assert.match(html,/apple-touch-icon/); assert.match(html,/Instalar app/);
 const worker=await fetch(base+'/sw.js'); assert.equal(worker.status,200); assert.match(worker.headers.get('cache-control'),/no-store/);
});

test('worker never intercepts mutations or background API requests and never caches private pages', async () => {
 const handlers={}; const writes=[]; const deletions=[]; let offline=false; let match=0;
 const fallback=new Response('offline notice');
 const context={ URL, Request, Response,
  self:{location:{origin:'https://fudibox.app'},addEventListener:(name,fn)=>handlers[name]=fn,clients:{claim:async()=>{}}},
  caches:{open:async()=>({add:async request=>writes.push(request.url)}),keys:async()=>['unrelated-cache','fudibox-offline-old'],delete:async key=>deletions.push(key),match:async()=>{match++;return fallback;}},
  fetch:async()=>{if(offline)throw Error('offline');return new Response('private order');}
 };
 // Request resolves relative URLs in the browser; supply that origin in this harness.
 context.Request=class extends Request {constructor(url,opts){super(new URL(url,'https://fudibox.app'),opts);}};
 vm.runInNewContext(await readFile(new URL('../public/sw.js',import.meta.url),'utf8'),context);
 let work;
 handlers.install({waitUntil:p=>work=p}); await work;
 assert.deepEqual(writes,['https://fudibox.app/offline.html']);
 handlers.activate({waitUntil:p=>work=p}); await work;
 assert.deepEqual(deletions,['fudibox-offline-old']);
 for(const request of [{method:'POST',mode:'navigate',url:'https://fudibox.app/chicanito'},{method:'GET',mode:'cors',url:'https://fudibox.app/cuenta'},{method:'GET',mode:'navigate',url:'https://accounts.google.com/'}]) {
  handlers.fetch({request,respondWith:()=>assert.fail('Must not intercept')});
 }
 const request={method:'GET',mode:'navigate',url:'https://fudibox.app/cuenta'};
 handlers.fetch({request,respondWith:p=>work=p}); assert.equal(await (await work).text(),'private order'); assert.equal(match,0);
 offline=true; handlers.fetch({request,respondWith:p=>work=p}); assert.equal(await (await work).text(),'offline notice');
 assert.equal(writes.length,1);
});
