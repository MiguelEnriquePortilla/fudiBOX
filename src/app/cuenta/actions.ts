"use server";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
export async function signOut() {
  const client = await serverClient();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) redirect("/cuenta?error=salida");
  redirect("/acceso");
}
