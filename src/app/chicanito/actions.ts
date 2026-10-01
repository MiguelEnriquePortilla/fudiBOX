"use server";
import { serverClient } from "@/lib/supabase/server";
export async function submitOrder(requestKey:string,payload:unknown):Promise<{id?:string;error?:string}> {
 if(!/^[0-9a-f-]{36}$/i.test(requestKey)) return {error:"Vuelve a abrir el carrito."};
 if(!payload||typeof payload!=="object"||!("phone" in payload)||typeof payload.phone!=="string"||!/^\d{10}$/.test(payload.phone)) return {error:"Escribe tu teléfono de México con 10 dígitos."};
 const normalizedPayload={...payload,phone:"+52"+payload.phone};
 const client=await serverClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user) return {error:"Inicia sesión antes de solicitar tu pedido."};
 const {data,error}=await client.rpc("create_customer_order",{p_request_key:requestKey,p_payload:normalizedPayload});
 if(error){
  const safe = error.code==="P0001"||error.code==="28000";
  return {error:safe?error.message:"No pudimos guardar el pedido. Revisa tus datos e inténtalo de nuevo."};
 }
 return {id:data as string};
}
