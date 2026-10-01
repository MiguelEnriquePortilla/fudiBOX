"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
export async function cancelMyOrder(form:FormData){
 const client=await serverClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user)redirect("/acceso");
 const {data:order}=await client.from("orders").select("id").eq("id",String(form.get("order_id"))).eq("customer_id",user.id).maybeSingle();
 if(!order)redirect("/cuenta?error=pedido");
 const {error}=await client.rpc("cancel_pending_order",{p_order_id:order.id});
 if(error)redirect("/cuenta?error=pedido");
 revalidatePath("/cuenta");revalidatePath("/negocio");
}
