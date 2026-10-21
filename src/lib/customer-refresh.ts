export type CustomerOrder = {
 id:string;status:string;created_at:string;subtotal_cents:number;platform_fee_cents:number;shipping_cents:number|null;total_cents:number|null;
 delivery_method:string;pickup_address:string;preparation_minutes:number|null;businesses:{name:string}|null;
 order_items:{product_name:string;quantity:number;selections:unknown}[];
};
export type CustomerSnapshot={orders:CustomerOrder[];checkedAt:string};
export function createCustomerRefresh(options:{read:()=>Promise<CustomerSnapshot>;visible:()=>boolean;paused:()=>boolean;onSuccess:(value:CustomerSnapshot)=>void}) {
 let generation=0;
 let pending:number|null=null;
 const refresh=async()=>{
  if(options.paused())return 'paused';
  if(!options.visible())return 'hidden';
  if(pending!==null)return 'pending';
  const requestGeneration=++generation;
  pending=requestGeneration;
  try {
   const value=await options.read();
   if(requestGeneration!==generation)return 'superseded';
   if(options.paused())return 'paused';
   if(!options.visible())return 'hidden';
   options.onSuccess(value);return 'success';
  }catch{return requestGeneration===generation?'error':'superseded';}
  finally{if(pending===requestGeneration)pending=null;}
 };
 return Object.assign(refresh,{invalidate(){generation++;pending=null;}});
}
