import Link from "next/link";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { cancelMyOrder } from "./cancel";
import { money,orderLabels } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function Account({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
 const client=await serverClient();
 const {data:{user},error:authError}=await client.auth.getUser();
 if(authError||!user)redirect("/acceso");
 const {error:pageError}=await searchParams;
 const [{data:orders,error},{data:businesses}]=await Promise.all([
 client.from("orders").select("id,status,created_at,total_cents,subtotal_cents,delivery_method,order_items(product_name,quantity,selections)").eq("customer_id",user.id).order("created_at",{ascending:false}).limit(20),
 client.rpc("my_businesses")]);
 const name=typeof user.user_metadata.full_name==="string"?user.user_metadata.full_name:"vecino";
 return <section className="account"><div className="account-heading"><div><span className="eyebrow">MI CUENTA</span><h1>¡Va que va, {name}!</h1><p>Ya entraste a fudiBOX con Google.</p></div><span className="badge">Sesión verificada</span></div>
 <div className="account-grid"><article className="card"><h2>Tu acceso</h2><p className="email">{user.email}</p><Link className="button" href="/chicanito">Ver menú de Chicanito</Link>
 {!!businesses?.length&&<p><Link className="text-link" href="/negocio">Abrir panel de Chicken Chicanito ↗</Link></p>}
 {pageError&&<p className="alert" role="alert">No se pudo completar la acción. Recarga y vuelve a intentar.</p>}
 <form action={signOut}><button className="button secondary">Cerrar sesión</button></form></article>
 <article className="card"><span className="eyebrow">AL TIRO CON TU PEDIDO</span><h2>Tus pedidos</h2>
 {error?<p role="alert" className="alert">No pudimos consultar tus pedidos. Intenta recargar la página.</p>:!orders?.length?<><p>Aún no tienes pedidos.</p><p className="fine">Conoce el menú de Chicanito. La recepción se habilitará al terminar las pruebas.</p></>:orders.map(o=><section className="customer-order" key={o.id}><span className="badge">{orderLabels[o.status]??"Estado por confirmar"}</span><p>{o.delivery_method==="pickup"?"Para recoger":"A domicilio"}</p><ul>{o.order_items.map((item:{product_name:string;quantity:number;selections:unknown},i:number)=><li key={i}>{item.quantity} × {item.product_name}<p className="fine">{Array.isArray(item.selections)?item.selections.map((s:{quantity:number;choices:Record<string,string>})=>s.quantity+" × "+Object.values(s.choices).join(", ")).join(" / "):""}</p></li>)}</ul><strong>{o.total_cents===null?money(o.subtotal_cents+1000)+" + envío por cotizar":money(Number(o.total_cents))}</strong>{["requested","awaiting_quote","quoted"].includes(o.status)&&<form action={cancelMyOrder}><input type="hidden" name="order_id" value={o.id}/><button className="button secondary">Cancelar pedido</button></form>}</section>)}
 </article></div></section>;
}
