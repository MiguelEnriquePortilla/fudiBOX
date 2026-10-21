"use client";
import { useEffect,useRef,useState } from 'react';
import { createCustomerRefresh,type CustomerSnapshot } from '@/lib/customer-refresh';
import { money,orderLabels } from '@/lib/catalog';
import { cancelMyOrder } from './cancel';
export function CustomerOrders({initial}:{initial:CustomerSnapshot|null}){
 const [snapshot,setSnapshot]=useState(initial);
 const [feedback,setFeedback]=useState(initial?'':'No pudimos consultar tus pedidos. Intenta actualizar.');
 const [paused,setPaused]=useState(false);

 const pauseRef=useRef(false);
 const refreshRef=useRef<ReturnType<typeof createCustomerRefresh>|null>(null);
 useEffect(()=>{refreshRef.current?.invalidate();setSnapshot(initial);},[initial]);
 useEffect(()=>{
  const refresh=createCustomerRefresh({visible:()=>document.visibilityState==='visible',paused:()=>pauseRef.current,onSuccess:value=>{setSnapshot(value);setFeedback('');},read:async()=>{
   const response=await fetch('/cuenta/status',{cache:'no-store',signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error('read failed');
   const value=await response.json();if(!Array.isArray(value.orders)||typeof value.checkedAt!=='string')throw Error('invalid response');
   return value;
  }});
  const run=async()=>{const result=await refresh();if(result==='error')setFeedback('No se pudo actualizar. Se conserva la última información recibida.');};
  refreshRef.current=refresh;
  const timer=setInterval(run,20000);
  const visible=()=>{if(document.visibilityState==='visible')void run();};
  document.addEventListener('visibilitychange',visible);
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visible);refresh.invalidate();refreshRef.current=null;};
 },[]);
 async function manual(){const result=await refreshRef.current?.();if(result==='error')setFeedback('No se pudo actualizar. Se conserva la última información recibida.');}
 function pause(){refreshRef.current?.invalidate();pauseRef.current=true;setPaused(true);}
 return <><div aria-live="polite"><p>{paused?'Actualización pausada mientras revisas la cancelación.':'Se actualiza cada 20 segundos mientras esta página está visible.'}</p>{snapshot&&<p className="fine">Última consulta correcta: {new Date(snapshot.checkedAt).toLocaleString('es-MX',{timeZone:'America/Mexico_City'})}</p>}{feedback&&<p role="alert" className="alert">{feedback}</p>}</div>
 {paused?<button className="button secondary" onClick={()=>{pauseRef.current=false;setPaused(false);void manual();}}>Reanudar actualización</button>:<button className="button secondary" onClick={()=>void manual()}>Actualizar pedidos</button>}
 {snapshot&&!snapshot.orders.length&&<p>Aún no tienes pedidos.</p>}
 {snapshot?.orders.map(o=><section className="customer-order" key={o.id}>
 <h3>{o.businesses?.name||'Restaurante'}</h3><p className="fine">Pedido {o.id.slice(0,8)} · {new Date(o.created_at).toLocaleString('es-MX',{timeZone:'America/Mexico_City'})}</p>
 <span className="badge">{orderLabels[o.status]??'Estado por confirmar'}</span>
 {o.status==='ready'&&o.delivery_method==='pickup'&&<p>Tu pedido está listo. Puedes pasar a recogerlo en el restaurante.</p>}
 {o.status==='delivered'&&<p>Tu pedido fue entregado. Gracias por pedir en fudiBOX.</p>}
 <p>{o.delivery_method==='pickup'?'Para recoger':'A domicilio'}</p>
 {o.delivery_method==='pickup'&&<p>Dirección de recogida: {o.pickup_address||'No registrada. Solicita ayuda antes de salir.'}</p>}
 {o.preparation_minutes!==null&&<p>Estimación de preparación del restaurante: {o.preparation_minutes} minutos. No es una hora de recogida garantizada.</p>}
 <ul>{o.order_items.map((item,i)=><li key={i}>{item.quantity} × {item.product_name}<p className="fine">{Array.isArray(item.selections)?item.selections.map((s:{quantity:number;choices:Record<string,string>})=>s.quantity+' × '+Object.values(s.choices).join(', ')).join(' / '):''}</p></li>)}</ul>
 <p>Productos: {money(o.subtotal_cents)}<br/>Servicio fudiBOX: {money(o.platform_fee_cents)}{o.delivery_method==='delivery'&&<><br/>Envío: {o.shipping_cents===null?'Por cotizar':money(o.shipping_cents)}</>}</p>
 <strong>{o.total_cents===null?'Total pendiente de cotización':`Total: ${money(Number(o.total_cents))}`}</strong>
 {['requested','awaiting_quote','quoted'].includes(o.status)&&<form action={cancelMyOrder} onFocus={pause} onPointerDown={pause} onSubmit={pause}><input type="hidden" name="order_id" value={o.id}/><button className="button secondary">Cancelar pedido</button></form>}
 </section>)}
 <p className="fine">Ayuda: el contacto de soporte de fudiBOX aún no está disponible en esta página.</p></>;
}



