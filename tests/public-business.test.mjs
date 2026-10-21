import test from 'node:test';
import assert from 'node:assert/strict';
import {readPublicBusiness} from '../src/lib/public-business.ts';
function clientFor(results){
 const selections=[];const scopes=[];
 const query={select(value){selections.push(value);return this;},eq(k,v){scopes.push([k,v]);return this;},async maybeSingle(){return results.shift();}};
 return {client:{from:()=>query},selections,scopes};
}
test('missing method columns preserve the beta catalog with ordering closed',async()=>{
 const {client,selections,scopes}=clientFor([{data:null,error:{code:'42703',message:'column businesses.pickup_enabled does not exist'}},{data:{id:'b',accepting_orders:true},error:null}]);
 const result=await readPublicBusiness(client,'demo');
 assert.equal(result.error,null);assert.equal(result.data.id,'b');
 assert.equal(result.data.accepting_orders,false);assert.equal(result.data.pickup_enabled,false);assert.equal(result.data.delivery_enabled,false);
 assert.equal(selections.length,2);assert.ok(!selections[1].includes('pickup_enabled'));
 assert.deepEqual(scopes,[['slug','demo'],['status','approved'],['slug','demo'],['status','approved']]);
});
test('migrated schema preserves server settings without a fallback read',async()=>{
 const data={id:'b',accepting_orders:true,pickup_enabled:true,delivery_enabled:false};
 const {client,selections}=clientFor([{data,error:null}]);const result=await readPublicBusiness(client,'demo');
 assert.deepEqual(result.data,data);assert.equal(selections.length,1);
});
test('unrelated database failures are not hidden by compatibility fallback',async()=>{
 const error={code:'42703',message:'column businesses.address does not exist'};
 const {client,selections}=clientFor([{data:null,error}]);assert.equal((await readPublicBusiness(client,'demo')).error,error);assert.equal(selections.length,1);
});
test('a failed legacy read still surfaces an error',async()=>{
 const failure={code:'503',message:'unavailable'};
 const {client}=clientFor([{data:null,error:{code:'42703',message:'column delivery_enabled does not exist'}},{data:null,error:failure}]);
 const result=await readPublicBusiness(client,'demo');assert.equal(result.data,null);assert.equal(result.error,failure);
});
