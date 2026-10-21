"use client";
import { useEffect,useRef,useState } from 'react';
import { createCustomerRefresh,type CustomerSnapshot } from '@/lib/customer-refresh';
import { money,orderLabels } from '@/lib/catalog';
import Link from 'next/link';
import './orders.css';
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
 const steps=[{status:'requested',label:'Recibido'},{status:'preparing',label:'En preparación'},{status:'ready',label:'Listo'},{status:'delivered',label:'Recogido'}];
 return <div className="customer-tracking">
 <div className="tracking-toolbar">
 <div className="tracking-connection" role="status" aria-live="polite">
 <strong>{paused?'Actualización pausada':feedback?'Sin actualización reciente':'Seguimiento activo'}</strong>
 <span>{paused?'Reanuda cuando termines de revisar la cancelación.':'Consulta automática cada 20 s con la página visible.'}</span>
 {snapshot&&<span className="tracking-last-check">Última consulta correcta: <time dateTime={snapshot.checkedAt}>{new Date(snapshot.checkedAt).toLocaleString('es-MX',{timeZone:'America/Mexico_City'})}</time></span>}
 </div>
 {paused?<button type="button" className="tracking-refresh" onClick={()=>{pauseRef.current=false;setPaused(false);void manual();}}>Reanudar actualización</button>:<button type="button" className="tracking-refresh" onClick={()=>void manual()}>Actualizar pedidos</button>}
 </div>
 {feedback&&<p role="alert" className="tracking-error">{feedback}</p>}
 {snapshot&&!snapshot.orders.length&&<div className="tracking-empty"><h3>Tu próximo pedido empieza en el menú.</h3><p>Aún no tienes pedidos. Aquí podrás consultar su avance cuando hagas uno.</p><Link className="button" href="/chicanito">Explorar el menú</Link></div>}
 <div className="tracking-orders">{snapshot?.orders.map(o=>{
 const currentStep=steps.findIndex(step=>step.status===o.status);
 return <section className="tracking-order" key={o.id} aria-labelledby={'order-'+o.id}>
 <header className="tracking-order-header">
 <div><h3 id={'order-'+o.id}>{o.businesses?.name||'Restaurante'}</h3><p className="tracking-order-reference">Pedido <strong>{o.id.slice(0,8)}</strong><span aria-hidden="true"> · </span><time dateTime={o.created_at}>{new Date(o.created_at).toLocaleString('es-MX',{timeZone:'America/Mexico_City'})}</time></p></div>
 <span className="tracking-status" data-status={o.status}>{orderLabels[o.status]??'Estado por confirmar'}</span>
 </header>
 {o.delivery_method==='pickup'&&currentStep>=0&&<ol className="tracking-progress" aria-label="Avance de tu pedido para recoger">{steps.map((step,index)=><li key={step.status} data-stage={index<currentStep?'complete':index===currentStep?'current':'upcoming'} aria-current={index===currentStep?'step':undefined}><span className="tracking-progress-dot" aria-hidden="true"/><span>{step.label}</span><span className="tracking-sr-only">{index<currentStep?' completado':index===currentStep?' estado actual':' pendiente'}</span></li>)}</ol>}
 {o.status==='ready'&&o.delivery_method==='pickup'&&<p className="tracking-ready">Tu pedido está listo. Ya puedes pasar a recogerlo.</p>}
 {o.status==='delivered'&&<p className="tracking-confirmation">Tu pedido fue entregado. Gracias por pedir en fudiBOX.</p>}
 <div className="tracking-fulfillment"><div><h4>{o.delivery_method==='pickup'?'Recoge en el restaurante':'Entrega a domicilio'}</h4>{o.delivery_method==='pickup'&&<p>{o.pickup_address||'Dirección no registrada. Solicita ayuda antes de salir.'}</p>}</div>
 {o.preparation_minutes!==null&&<div className="tracking-estimate"><h4>Estimación del restaurante</h4><p><strong>{o.preparation_minutes} minutos</strong> de preparación</p><small>Es una estimación, no una hora de recogida garantizada.</small></div>}</div>
 <ul className="tracking-items" aria-label="Productos del pedido">{o.order_items.map((item,i)=><li key={i}><span className="tracking-item-quantity">{item.quantity} ×</span><div><strong>{item.product_name}</strong>{Array.isArray(item.selections)&&item.selections.length>0&&<p>{item.selections.map((s:{quantity:number;choices:Record<string,string>})=>s.quantity+' × '+Object.values(s.choices).join(', ')).join(' / ')}</p>}</div></li>)}</ul>
 <dl className="tracking-totals"><div><dt>Productos</dt><dd>{money(o.subtotal_cents)}</dd></div><div><dt>Servicio fudiBOX</dt><dd>{money(o.platform_fee_cents)}</dd></div>{o.delivery_method==='delivery'&&<div><dt>Envío</dt><dd>{o.shipping_cents===null?'Por cotizar':money(o.shipping_cents)}</dd></div>}<div className="tracking-total"><dt>Total</dt><dd>{o.total_cents===null?<span className="tracking-pending-total">Pendiente de cotización</span>:money(Number(o.total_cents))}</dd></div></dl>
 {['requested','awaiting_quote','quoted'].includes(o.status)&&<form className="tracking-cancel" action={cancelMyOrder} onFocus={pause} onPointerDown={pause} onSubmit={pause}><input type="hidden" name="order_id" value={o.id}/><button type="submit">Cancelar pedido</button></form>}
 </section>;
 })}</div>
 <aside className="tracking-help"><h3>¿Necesitas ayuda?</h3><p>El contacto de soporte de fudiBOX aún no está disponible en esta página.</p></aside>
 </div>;
}
