"use server";
import { requireOperator } from "@/lib/operator";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const value=(f:FormData,k:string)=>String(f.get(k)||"").trim();
const optional=(f:FormData,k:string)=>value(f,k)||null;
async function run(fn:string,args:Record<string,unknown>,section:string){
 const client=await requireOperator();const {error}=await client.rpc(fn,args);
 if(error)redirect("/admin?section="+section+"&error=1");
 revalidatePath("/admin");revalidatePath("/");revalidatePath("/chicanito");revalidatePath("/restaurantes/[slug]","page");revalidatePath("/cuenta");
 redirect("/admin?section="+section+"&saved=1");
}
export async function saveBusiness(f:FormData){await run("operator_save_business",{p_id:optional(f,"id"),p_name:value(f,"name"),p_slug:value(f,"slug"),p_address:value(f,"address"),p_approved:f.get("approved")==="on"},"restaurantes");}
export async function saveDriver(f:FormData){
 const phone=value(f,"phone");if(!/^\d{10}$/.test(phone))redirect("/admin?section=repas&error=1");
 await run("operator_save_driver",{p_id:optional(f,"id"),p_name:value(f,"name"),p_phone:"+52"+phone,p_business_id:optional(f,"business_id"),p_shared:f.get("shared")==="on",p_approved:f.get("approved")==="on"},"repas");
}
export async function saveProduct(f:FormData){
 const price=value(f,"price");if(!/^\d{1,7}(\.\d{1,2})?$/.test(price))redirect("/admin?section=menu&error=1");
 await run("operator_save_product",{p_id:optional(f,"id"),p_business_id:value(f,"business_id"),p_name:value(f,"name"),p_description:value(f,"description"),p_price_cents:Math.round(Number(price)*100),p_category:value(f,"category"),p_available:f.get("available")==="on"},"menu");
}
export async function confirmOrder(f:FormData){await run("confirm_business_order",{p_order_id:value(f,"order_id"),p_minutes:Number(f.get("minutes"))},"pedidos");}
export async function cancelOrder(f:FormData){await run("cancel_pending_order",{p_order_id:value(f,"order_id")},"pedidos");}

export async function markPickupReady(f:FormData){await run("operator_mark_pickup_ready",{p_order_id:value(f,"order_id")},"pedidos");}

export async function completePickup(f:FormData){await run("operator_complete_pickup",{p_order_id:value(f,"order_id"),p_received:f.get("received")==="on"},"pedidos");}
