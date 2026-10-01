import Link from "next/link";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { money,orderLabels } from "@/lib/catalog";
import { changeAvailability,confirmOrder,cancelBusinessOrder } from "./actions";
export const dynamic="force-dynamic";
export default async function BusinessPanel({searchParams}:{searchParams:Promise<{error?:string}>}){
 const client=await serverClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user)redirect("/acceso");
 const {data:memberships,error:membershipError}=await client.rpc("my_businesses");
 if(membershipError)throw new Error("No se pudo verificar el acceso.");
 const business=memberships?.find((b:{slug:string})=>b.slug==="chicken-chicanito");
 if(!business)return <section className="card error-page"><h1>Acceso del negocio</h1><p>Tu cuenta no tiene asignado un negocio.</p><Link href="/cuenta">Volver a mi cuenta</Link></section>;
 const [{data:products,error:productError},{data:orders,error:orderError},{data:config}]=await Promise.all([
  client.from("products").select("id,name,price_cents,available,category").eq("business_id",business.id).order("sort_order"),
  client.from("orders").select("id,status,customer_name,customer_phone,delivery_method,delivery_address,notes,subtotal_cents,total_cents,created_at,order_items(product_name,quantity,selections)").eq("business_id",business.id).order("created_at",{ascending:false}).limit(50),
  client.from("businesses").select("accepting_orders,address").eq("id",business.id).single()
 ]);
 const {error}=await searchParams;
 return <section className="business-page"><span className="eyebrow">PANEL DEL NEGOCIO</span><div className="business-heading"><h1>Chicken Chicanito</h1><Link className="text-link" href="/chicanito">Ver menú del cliente ↗</Link></div><p>{config?.address}</p>
 {!config?.accepting_orders&&<div className="menu-notice">Recepción de pedidos cerrada durante la preparación y las pruebas.</div>}
 {error&&<p className="alert" role="alert">No se pudo completar la acción. Revisa el estado del pedido y vuelve a intentar.</p>}
 <section className="panel-orders"><h2>Pedidos recibidos</h2>{orderError?<p className="alert">No pudimos consultar los pedidos.</p>:!orders?.length?<div className="card"><p>Aún no hay pedidos recibidos en fudiBOX.</p><p className="fine">Las solicitudes de los clientes aparecerán aquí cuando habilitemos la recepción.</p></div>:orders.map(o=><article className="card" key={o.id}>
  <span className="badge">{orderLabels[o.status]??o.status}</span><h3>{o.customer_name}</h3><p>{o.delivery_method==="pickup"?"Recoger en el negocio":"A domicilio"} · {o.customer_phone}</p>{o.delivery_address&&<p>{o.delivery_address}</p>}
  <ul>{o.order_items.map((item:{product_name:string;quantity:number;selections:unknown},i:number)=><li key={i}><strong>{item.quantity} × {item.product_name}</strong><p className="fine">{Array.isArray(item.selections)?item.selections.map((s:{quantity:number;choices:Record<string,string>})=>s.quantity+" × "+Object.entries(s.choices).map(([k,v])=>k+": "+v).join(", ")).join(" / "):""}</p></li>)}</ul>
  {o.notes&&<p>Notas: {o.notes}</p>}<p>Productos + servicio: <strong>{money(o.subtotal_cents+1000)}</strong></p>
  {o.status==="requested"&&<form action={confirmOrder} className="inline-form"><input type="hidden" name="order_id" value={o.id}/><label>Minutos de preparación<input type="number" name="minutes" min={1} max={240} required defaultValue={20}/></label><button className="button">Confirmar disponibilidad</button></form>}
  {o.status==="awaiting_quote"&&<p className="menu-notice">Disponibilidad confirmada. No preparar hasta que el cliente acepte la cotización de envío.</p>}
  {["requested","awaiting_quote","quoted"].includes(o.status)&&<form action={cancelBusinessOrder}><input type="hidden" name="order_id" value={o.id}/><button className="button secondary">Cancelar pedido y liberar existencias</button></form>}
 </article>)}</section>
 <section><h2>Disponibilidad del menú</h2><p className="fine">Marca un producto agotado para impedir nuevas solicitudes. No altera pedidos ya reservados.</p>
 {productError?<p className="alert">No pudimos consultar el catálogo.</p>:<div className="availability-list">{products?.map(p=><form action={changeAvailability} key={p.id}><div><strong>{p.name}</strong><p>{p.category} · {money(p.price_cents)}</p></div><input type="hidden" name="product_id" value={p.id}/><input type="hidden" name="available" value={String(!p.available)}/><button className={p.available?"availability available":"availability"}>{p.available?"Disponible · marcar agotado":"Agotado · habilitar"}</button></form>)}</div>}
 </section></section>;
}
