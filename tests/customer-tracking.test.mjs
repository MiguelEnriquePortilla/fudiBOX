import test from 'node:test';
import assert from 'node:assert/strict';
import { createCustomerRefresh } from '../src/lib/customer-refresh.ts';
import { customerStatus } from '../src/lib/customer-status.ts';
test('anonymous requests never query orders', async()=>{
 let queried=false;
 const result=await customerStatus({auth:{getUser:async()=>({data:{user:null},error:null})},from(){queried=true;}});
 assert.equal(result.status,401); assert.equal(queried,false);
});
test('refresh applies returned orders; failures preserve last successful check; pause and hidden block reads', async()=>{
 let fail=false, reads=0, visible=true, paused=false; const updates=[];
 const refresh=createCustomerRefresh({read:async()=>{reads++;if(fail)throw Error('offline');return {orders:[{status:'ready'}],checkedAt:'2026-10-21T20:00:00Z'};},visible:()=>visible,paused:()=>paused,onSuccess:value=>updates.push(value)});
 assert.equal(await refresh(), 'success');assert.equal(updates[0].orders[0].status,'ready');
 fail=true;assert.equal(await refresh(),'error');assert.equal(updates.length,1);
 paused=true;assert.equal(await refresh(),'paused');paused=false;visible=false;assert.equal(await refresh(),'hidden');assert.equal(reads,2);
});
test('authenticated query is scoped to current customer; database failures never carry a freshness timestamp',async()=>{
 let scope;
 const query={select(){return this;},eq(column,value){scope=[column,value];return this;},order(){return this;},async limit(){return {data:[],error:null};}};
 const client={auth:{getUser:async()=>({data:{user:{id:'current-customer'}},error:null})},from:()=>query};
 const result=await customerStatus(client);
 assert.equal(result.status,200);assert.deepEqual(scope,['customer_id','current-customer']);assert.ok(result.body.checkedAt);
 query.limit=async()=>({data:null,error:Error('database offline')});
 const failed=await customerStatus(client);assert.equal(failed.status,503);assert.equal(failed.body.checkedAt,undefined);
});
test('starting cancellation while a read is in flight prevents replacement',async()=>{
 let complete;let paused=false;let applied=false;
 const refresh=createCustomerRefresh({read:()=>new Promise(resolve=>{complete=resolve;}),visible:()=>true,paused:()=>paused,onSuccess:()=>{applied=true;}});
 const request=refresh();paused=true;complete({orders:[],checkedAt:'now'});
 assert.equal(await request,'paused');assert.equal(applied,false);
});
test('invalidated pre-cancel reads cannot replace newer props after resume',async()=>{
 let complete;let paused=false;const updates=[];
 const refresh=createCustomerRefresh({read:()=>new Promise(resolve=>{complete=resolve;}),visible:()=>true,paused:()=>paused,onSuccess:value=>updates.push(value)});
 const pending=refresh();paused=true;refresh.invalidate();
 updates.push({orders:[{status:'cancelled'}],checkedAt:'new server props'});refresh.invalidate();paused=false;
 complete({orders:[{status:'requested'}],checkedAt:'old read'});
 assert.equal(await pending,'superseded');assert.equal(updates.length,1);assert.equal(updates[0].orders[0].status,'cancelled');
});
test('read completion while hidden never replaces the visible snapshot',async()=>{
 let complete;let visible=true;let applied=false;
 const refresh=createCustomerRefresh({read:()=>new Promise(resolve=>{complete=resolve;}),visible:()=>visible,paused:()=>false,onSuccess:()=>{applied=true;}});
 const pending=refresh();visible=false;complete({orders:[],checkedAt:'hidden'});
 assert.equal(await pending,'hidden');assert.equal(applied,false);
});
test('invalidated reads cannot clear a resumed request lock or report stale failures',async()=>{
 const requests=[];let applied=0;
 const refresh=createCustomerRefresh({read:()=>new Promise((resolve,reject)=>requests.push({resolve,reject})),visible:()=>true,paused:()=>false,onSuccess:()=>{applied++;}});
 const first=refresh();refresh.invalidate();const second=refresh();
 requests[0].reject(Error('obsolete failure'));assert.equal(await first,'superseded');
 assert.equal(await refresh(),'pending');
 requests[1].resolve({orders:[],checkedAt:'new'});assert.equal(await second,'success');assert.equal(applied,1);
});
