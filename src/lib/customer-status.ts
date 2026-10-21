import type { SupabaseClient } from '@supabase/supabase-js';
import type { CustomerOrder } from './customer-refresh';
export async function customerStatus(client:SupabaseClient) {
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user)return {status:401,body:{error:'Sesión no disponible'}};
 const {data,error}=await client.from('orders').select('id,status,created_at,total_cents,subtotal_cents,platform_fee_cents,shipping_cents,delivery_method,pickup_address,preparation_minutes,businesses(name),order_items(product_name,quantity,selections)').eq('customer_id',user.id).order('created_at',{ascending:false}).limit(20);
 if(error)return {status:503,body:{error:'No se pudieron consultar los pedidos'}};
 return {status:200,body:{orders:(data??[]) as unknown as CustomerOrder[],checkedAt:new Date().toISOString()}};
}
