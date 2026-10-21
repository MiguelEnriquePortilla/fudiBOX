import { serverClient } from '@/lib/supabase/server';
import { customerStatus } from '@/lib/customer-status';
export const dynamic='force-dynamic';
export async function GET(){
 try {
 const result=await customerStatus(await serverClient());
 return Response.json(result.body,{status:result.status,headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'No se pudieron consultar los pedidos'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
}
