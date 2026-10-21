import { notFound } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { Catalog } from "@/app/chicanito/catalog";
import type { Product } from "@/lib/catalog";
import { readPublicBusiness } from "@/lib/public-business";
export const dynamic="force-dynamic";
export default async function Restaurant({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const client=await serverClient();
 const {data:business,error}=await readPublicBusiness(client,slug);
 if(error)throw new Error("No pudimos consultar el negocio.");if(!business)notFound();
 const {data:products,error:productError}=await client.from("products").select("id,name,description,price_cents,image_path,category,sort_order,available,option_groups").eq("business_id",business.id).order("sort_order");
 if(productError)throw new Error("No pudimos consultar el menú.");
 const {data:{user}}=await client.auth.getUser();
 const {data:pickupPilot}=user?await client.rpc("my_pickup_pilot",{p_business_id:business.id}):{data:false};
 return <Catalog business={business} products={(products||[]) as Product[]} signedIn={!!user} pickupPilot={pickupPilot===true&&business.pickup_enabled}/>;
}
