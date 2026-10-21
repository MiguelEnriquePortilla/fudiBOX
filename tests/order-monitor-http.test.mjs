import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
test('anonymous monitoring read returns 401 JSON without redirect or order IDs', async()=>{
 const response=await fetch(base+'/admin/order-status',{redirect:'manual'});
 assert.equal(response.status,401); assert.equal(response.headers.get('location'),null);
 assert.match(response.headers.get('cache-control'),/no-store/);
 const body=await response.json(); assert.equal(body.ids,undefined); assert.equal(body.checkedAt,undefined);
});
