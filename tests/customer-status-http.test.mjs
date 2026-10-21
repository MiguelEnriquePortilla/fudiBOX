import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
test('customer status endpoint refuses anonymous reads and forbids caching',async()=>{
 const response=await fetch(base+'/cuenta/status',{redirect:'manual'});
 assert.equal(response.status,401);assert.match(response.headers.get('cache-control'),/no-store/);
 const body=await response.json();assert.equal(body.orders,undefined);assert.equal(body.checkedAt,undefined);
});
