"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
export async function changeAvailability(form:FormData){
 const client=await serverClient();
 const {error}=await client.rpc("set_product_availability",{p_product_id:String(form.get("product_id")),p_available:form.get("available")==="true"});
 if(error)redirect("/negocio?error=actualizar");
 revalidatePath("/negocio");revalidatePath("/chicanito");
}
export async function confirmOrder(form:FormData){
 const client=await serverClient();
 const {error}=await client.rpc("confirm_business_order",{p_order_id:String(form.get("order_id")),p_minutes:Number(form.get("minutes"))});
 if(error)redirect("/negocio?error=confirmar");
 revalidatePath("/negocio");revalidatePath("/cuenta");
}
export async function cancelBusinessOrder(form:FormData){
 const client=await serverClient();
 const {error}=await client.rpc("cancel_pending_order",{p_order_id:String(form.get("order_id"))});
 if(error)redirect("/negocio?error=cancelar");
 revalidatePath("/negocio");revalidatePath("/cuenta");
}
