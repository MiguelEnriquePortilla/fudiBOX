import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
export async function requireOperator(){
 const client=await serverClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user)redirect("/admin/acceso");
 const {data,error}=await client.rpc("operator_access");
 if(error||data!==true)redirect("/admin/acceso?denied=1");
 return client;
}