import test from 'node:test';
import assert from 'node:assert/strict';
import { OrderMonitor } from '../src/lib/order-monitor.ts';
test('only new requested IDs alert, even after disappearance or failed reads', async () => {
 const monitor=new OrderMonitor(['old']);
 assert.deepEqual(await monitor.check(async()=>({ids:['old','new'],checkedAt:'2026-10-21T12:00:00Z'})),['new']);
 await monitor.check(async()=>({ids:[],checkedAt:'2026-10-21T12:01:00Z'}));
 assert.deepEqual(await monitor.check(async()=>({ids:['new'],checkedAt:'2026-10-21T12:02:00Z'})),[]);
 const previous=monitor.checkedAt;
 await monitor.check(async()=>{throw Error('offline');});
 assert.equal(monitor.checkedAt,previous); assert.equal(monitor.failed,true);
});
test('visibility, form focus and edits pause polling until explicit resume', async()=>{
 const monitor=new OrderMonitor([]); let reads=0;
 const read=async()=>{reads++;return {ids:[],checkedAt:'2026-10-21T12:00:00Z'};};
 monitor.visible=false; await monitor.check(read); assert.equal(reads,0);
 monitor.visible=true; monitor.edit(); await monitor.check(read); assert.equal(reads,0);
 monitor.resume(); await monitor.check(read,true); assert.equal(reads,0);
 await monitor.check(read); assert.equal(reads,1); assert.equal(monitor.failed,false);
});
test('an edit during a read discards the result and retains stale timestamp',async()=>{
 const monitor=new OrderMonitor([]); let finish;
 const pending=monitor.check(()=>new Promise(resolve=>{finish=resolve;}));
 monitor.edit(); finish({ids:['new'],checkedAt:'2026-10-21T12:00:00Z'});
 assert.deepEqual(await pending,[]); assert.equal(monitor.checkedAt,null);
});
test('concurrent checks are suppressed and malformed successes become failures',async()=>{
 const monitor=new OrderMonitor([]); let finish;
 const pending=monitor.check(()=>new Promise(resolve=>{finish=resolve;}));
 await monitor.check(async()=>{throw Error('must not run');});
 finish({ids:[],checkedAt:'invalid'}); await pending;
 assert.equal(monitor.failed,true); assert.equal(monitor.checkedAt,null); assert.equal(monitor.pending,false);
});
