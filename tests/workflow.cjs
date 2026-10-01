const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const nodes=new Map();
const handlers={};
let now=1000000;
class Clock extends Date { static now(){return now;} }
const context=vm.createContext({console,crypto:webcrypto,Date:Clock,Intl,Math,Uint32Array,JSON,String,Number,Error,FormData:class{constructor(form){this.data=form.data;}get(key){return this.data[key];}},localStorage:{getItem(){return null;},setItem(){}},setInterval(){},window:{open(){},addEventListener(){}},document:{querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{value:'',textContent:'',innerHTML:''});return nodes.get(selector);},querySelectorAll(){return [];},addEventListener(event,handler){handlers[event]=handler;}}});
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
const get=expression=>vm.runInContext(expression,context);
function click(action,id){handlers.click({target:{closest:()=>({dataset:{action,id}})}});}
function input(selector,value){context.document.querySelector(selector).value=value;}
function create(delivery='delivery'){
input('#qty-1','1');input('#qty-2','0');input('#qty-3','0');
handlers.submit({preventDefault(){},target:{id:'order-form',data:{name:'Cliente prueba',phone:'+527340000000',address:'Ubicación ficticia',delivery}}});return get('state.orders.at(-1).id');
}
const id=create();
assert.equal(get('state.orders[0].subtotal'),15000);
assert.equal(get('state.orders[0].status'),'requested');
input('#minutes-'+id,'20');click('confirm',id);
assert.equal(get('state.orders[0].status'),'quote');
input('#shipping-'+id,'30');click('quote',id);
assert.equal(get('total(state.orders[0])'),19000);
const deadline=get('state.orders[0].expires');
click('backup',id);
assert.equal(get('state.orders[0].owner'),'respaldo');
assert.equal(get('state.orders[0].expires'),deadline);
assert.equal(get('state.orders[0].shipping'),3000);
click('accept',id);assert.equal(get('state.orders[0].status'),'preparing');
input('#driver-'+id,'Luis');click('assign',id);click('ready',id);
input('#code-'+id,'bad');click('finish',id);assert.equal(get('state.orders[0].status'),'ready');
input('#code-'+id,get('state.orders[0].code'));click('finish',id);click('finish',id);
assert.equal(get('state.orders.filter(o=>o.status==="delivered").length*1000'),1000);
const pickup=create('pickup');input('#minutes-'+pickup,'10');click('confirm',pickup);
assert.equal(get('state.orders[1].status'),'preparing');assert.equal(get('total(state.orders[1])'),16000);
click('ready',pickup);input('#code-'+pickup,get('state.orders[1].code'));click('finish',pickup);
assert.equal(get('state.orders[1].status'),'delivered');
const expired=create();input('#minutes-'+expired,'15');click('confirm',expired);input('#shipping-'+expired,'40');click('quote',expired);
now=get('state.orders[2].expires');click('accept',expired);assert.equal(get('state.orders[2].status'),'expired');
for(let n=0;n<2;n++){const next=create();input('#minutes-'+next,'10');click('confirm',next);input('#shipping-'+next,'25');click('quote',next);click('accept',next);input('#driver-'+next,'Ana');click('assign',next);}
assert.equal(get('state.orders.filter(o=>o.driver==="Ana").length'),1);
console.log('PASS: creación, cotización, transferencia sin reinicio, aceptación, código incorrecto, cierre único, recoger, vencimiento exacto y repartidor ocupado.');
