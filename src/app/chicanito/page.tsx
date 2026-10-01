import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { Catalog } from "./catalog";
import type { Product } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function Chicanito() {
 const client=await serverClient();
 const {data:business,error:businessError}=await client.from("businesses").select("id,name,address,map_url,accepting_orders").eq("slug","chicken-chicanito").single();
 if(businessError) throw new Error("No pudimos consultar el negocio.");
 if(!business) notFound();
 const {data:products,error}=await client.from("products").select("id,name,description,price_cents,image_path,category,sort_order,available,option_groups").eq("business_id",business.id).order("sort_order");
 if(error) throw new Error("No pudimos consultar el menú.");
 const {data:{user}}=await client.auth.getUser();
 return <Catalog business={business} products={(products??[]) as Product[]} signedIn={!!user}/>;
}
