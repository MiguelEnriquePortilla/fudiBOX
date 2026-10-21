import type { SupabaseClient } from '@supabase/supabase-js';
import type { Business } from './catalog';
const fields='id,name,slug,logo_path,address,map_url,accepting_orders';
export async function readPublicBusiness(client:SupabaseClient,slug:string) {
 const result=await client.from('businesses').select(fields+',pickup_enabled,delivery_enabled').eq('slug',slug).eq('status','approved').maybeSingle();
 // An additive schema migration may follow this beta UI deployment. Show the
 // catalogue without enabling either ordering method until those fields exist.
 if(result.error?.code==='42703' && /pickup_enabled|delivery_enabled/.test(result.error.message)){
  const legacy=await client.from('businesses').select(fields).eq('slug',slug).eq('status','approved').maybeSingle();
  return {data:legacy.data?{...legacy.data,accepting_orders:false,pickup_enabled:false,delivery_enabled:false} as Business:null,error:legacy.error};
 }
 return {data:result.data as Business|null,error:result.error};
}
