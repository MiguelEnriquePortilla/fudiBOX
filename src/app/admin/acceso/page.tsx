import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { GoogleButton } from "@/app/acceso/google-button";
import { signOut } from "@/app/cuenta/actions";
export const dynamic="force-dynamic";
export default async function OperatorLogin(){
 const client=await serverClient(); const {data:{user}}=await client.auth.getUser();
 if(user){const {data}=await client.rpc("operator_access");if(data===true)redirect("/admin");}
 return <div className="card"><h2>Acceso del equipo</h2><p>Este espacio es exclusivo para cuentas autorizadas por fudiBOX.</p>{user?<><p className="alert">Esta cuenta no tiene acceso de operación o el servicio no está disponible. Intenta con tu cuenta autorizada.</p><form action={signOut}><button className="button">Cerrar sesión</button></form></>:<GoogleButton destination="admin"/>}</div>;
}