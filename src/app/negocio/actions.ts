"use server";
import { requireOperator } from "@/lib/operator";
import { revalidatePath } from "next/cache";
export async function changeAvailability(form:FormData){const client=await requireOperator();const {error}=await client.rpc("set_product_availability",{p_product_id:String(form.get("product_id")),p_available:form.get("available")==="true"});if(error)throw new Error("No se pudo actualizar.");revalidatePath("/admin");revalidatePath("/chicanito");}
