"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect,useRef,useState,useTransition } from "react";
import { Business,Product,money } from "@/lib/catalog";
import { submitOrder } from "./actions";
import { orderMethods } from "@/lib/order-methods";
import "./menu.css";
type CartLine={key:string;product_id:string;quantity:number;choices:Record<string,string>};

export function Catalog({business,products,signedIn,pickupPilot=false}:{business:Business;products:Product[];signedIn:boolean;pickupPilot?:boolean}){
 const methods=orderMethods(business,pickupPilot);
 const canOrder=methods.length>0;
 const storageKey=business.slug==="chicken-chicanito"?"fudibox-chicanito-cart-v1":"fudibox-cart-"+business.id;
 const router=useRouter();
 const [category,setCategory]=useState("Todos");
 const [selected,setSelected]=useState<Product|null>(null);
 const [choices,setChoices]=useState<Record<string,string>>({});
 const [quantity,setQuantity]=useState(1);
 const [cart,setCart]=useState<CartLine[]>([]);
 const [requestKey,setRequestKey]=useState("");
 const [loaded,setLoaded]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const [pending,startTransition]=useTransition();
 const [chosenMethod,setMethod]=useState("pickup");
 const method=methods.includes(chosenMethod as "pickup"|"delivery")?chosenMethod:(methods[0]??"pickup");
 const dialog=useRef<HTMLDialogElement>(null);
 const cartDialog=useRef<HTMLDialogElement>(null);
 const itemCount=cart.reduce((sum,line)=>sum+line.quantity,0);
 const productMap=new Map(products.map(p=>[p.id,p]));
 const categories=["Todos",...new Set(products.map(p=>p.category))];
 useEffect(()=>{
  try {
   const saved=JSON.parse(sessionStorage.getItem(storageKey)||"null");
   if(saved&&Array.isArray(saved.lines)) {
    const valid=saved.lines.filter((line:CartLine)=>typeof line.key==="string"&&Number.isInteger(line.quantity)&&line.quantity>0&&line.quantity<=20&&typeof line.choices==="object"&&line.choices!==null&&products.some(p=>p.id===line.product_id));
    setCart(valid);
    setRequestKey(typeof saved.requestKey==="string"?saved.requestKey:crypto.randomUUID());
   } else setRequestKey(crypto.randomUUID());
  } catch {setRequestKey(crypto.randomUUID());}
  setLoaded(true);
 },[products,storageKey]);
 useEffect(()=>{if(loaded) try {sessionStorage.setItem(storageKey,JSON.stringify({lines:cart,requestKey}));}catch{/* Cart remains usable without storage. */}},[cart,requestKey,loaded,storageKey]);
 const subtotal=cart.reduce((sum,l)=>sum+(productMap.get(l.product_id)?.price_cents??0)*l.quantity,0);
 const missingOptions=selected?.option_groups.some(g=>!g.choices.includes(choices[g.name]));
 function showModal(element:HTMLDialogElement|null,detail:number){if(!element)return;element.dataset.motion=detail>0?"pointer":"instant";element.showModal();}
 function closeModal(element:HTMLDialogElement|null,detail:number){if(!element)return;element.dataset.motion=detail>0?"pointer":"instant";element.close();}
 function openProduct(p:Product,detail:number){setSelected(p);setChoices({});setQuantity(1);showModal(dialog.current,detail);}
 function changeCart(lines:CartLine[]){setCart(lines);setRequestKey(crypto.randomUUID());setError("");}
 function add(detail:number){
  if(!selected||missingOptions||!Number.isInteger(quantity)||quantity<1||quantity>20)return;
  if(cart.filter(l=>l.product_id===selected.id).reduce((s,l)=>s+l.quantity,0)+quantity>20){setNotice("Máximo 20 unidades por producto.");return;}
  const key=selected.id+JSON.stringify(choices);
  const found=cart.find(l=>l.key===key);
  changeCart(found?cart.map(l=>l.key===key?{...l,quantity:l.quantity+quantity}:l):[...cart,{key,product_id:selected.id,quantity,choices}]);
  setNotice("Agregado. Tu carrito tiene "+(itemCount+quantity)+" productos.");closeModal(dialog.current,detail);
 }
 function send(form:FormData){
  if(!canOrder||pending)return;
  setError("");
  const payload={business_id:business.id,items:cart.map(({product_id,quantity,choices})=>({product_id,quantity,choices})),expected_subtotal:subtotal,name:String(form.get("name")||"").trim(),phone:String(form.get("phone")||"").trim(),delivery_method:method,address:String(form.get("address")||"").trim(),notes:String(form.get("notes")||"").trim()};
  startTransition(async()=>{
   try{
    const result=await submitOrder(requestKey,payload);
    if(result.error){setError(result.error);return;}
    if(!result.id){setError("No recibimos confirmación. Intenta de nuevo para comprobar tu solicitud.");return;}
    changeCart([]);router.push("/cuenta");router.refresh();
   }catch{setError("No recibimos confirmación. Reintenta con este mismo carrito; evitaremos duplicar tu solicitud.");}
  });
 }
 return <section className="menu-page">
  <button type="button" className="cart-launcher" aria-haspopup="dialog" aria-label={"Abrir carrito, "+itemCount+" productos"} onClick={e=>showModal(cartDialog.current,e.detail)}><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 3h3l3 13h11l3-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></svg><strong>Ver carrito</strong><b className="cart-count">{itemCount}</b></span>{itemCount>0&&<span className="cart-launcher-total">{money(subtotal+1000)}</span>}</button>
  <div className="merchant-heading">{business.logo_path&&<img src={business.logo_path} width="96" height="96" alt={business.name}/>}<div><h1>{business.name}</h1><p>{business.address}</p>{business.map_url&&<a className="text-link" href={business.map_url} target="_blank" rel="noreferrer">Ver punto de recogida</a>}</div></div>
  {!canOrder&&<div className="menu-notice">Versión beta. Explora el menú y arma tu carrito; los pedidos aún no están habilitados.</div>}
  {pickupPilot&&<div className="menu-notice">Tienes acceso a una compra real para recoger. Pagarás productos + $10 de servicio en el negocio. Disponible para un solo pedido.</div>}
  <nav className="menu-tabs" aria-label="Categorías">{categories.map(c=><button key={c} className={category===c?"selected":""} onClick={()=>setCategory(c)} aria-pressed={category===c}>{c}</button>)}</nav>
  <p className="cart-notice" role="status">{notice}</p>
  <div className="menu-layout"><div className="product-grid">
   {products.filter(p=>category==="Todos"||p.category===category).map(p=><article className="menu-product" key={p.id}>
    {p.image_path?<img loading="lazy" width="360" height="250" src={p.image_path} alt={p.name}/>:<div className="product-placeholder" aria-hidden="true"><svg width="42" height="42" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="10"/><path d="M3 8v11m4-11v11M5 19v21M43 8v32m0-32c-5 5-5 15 0 15"/></svg></div>}
    <div className="product-body"><p className="product-category">{p.category}</p><h2>{p.name}</h2><p className="product-description">{p.description}</p><div className="product-bottom"><strong>{money(p.price_cents)}</strong><button disabled={!p.available||!loaded||pending} onClick={e=>openProduct(p,e.detail)} aria-label={"Elegir "+p.name}>{p.available?"Elegir +":"Agotado"}</button></div></div>
   </article>)}
  </div></div><dialog ref={cartDialog} className="cart-drawer" aria-labelledby="cart-title" onCancel={()=>{if(cartDialog.current)cartDialog.current.dataset.motion="instant";}}><button type="button" className="dialog-close" aria-label="Cerrar carrito" onClick={e=>closeModal(cartDialog.current,e.detail)}>×</button><div className="cart-panel"><h2 id="cart-title">Tu carrito</h2>
   {!cart.length?<div className="cart-empty"><svg width="64" height="64" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h6l5 25h24l4-18H13"/><circle cx="19" cy="40" r="2"/><circle cx="36" cy="40" r="2"/></svg><h3>¿Qué se te antoja?</h3><p>Elige tus productos del menú y los reunimos aquí.</p><button type="button" className="button" onClick={e=>closeModal(cartDialog.current,e.detail)}>Explorar el menú</button></div>:<>
    <ul className="cart-lines">{cart.map(l=>{const p=productMap.get(l.product_id)!;return <li key={l.key}><strong>{l.quantity} × {p.name}</strong><p>{Object.entries(l.choices).map(([k,v])=>k+": "+String(v)).join(" · ")}</p><div><span>{money(p.price_cents*l.quantity)}</span><button type="button" disabled={pending} onClick={()=>changeCart(cart.filter(x=>x.key!==l.key))} aria-label={"Quitar "+p.name}>Quitar</button></div></li>})}</ul>
    <div className="total-row"><span>Productos</span><strong>{money(subtotal)}</strong></div>
    <div className="total-row"><span>Servicio fudiBOX</span><strong>{money(1000)}</strong></div>
    <div className="total-row grand-total"><span>{method==="pickup"?"Total para recoger":"Subtotal sin envío"}</span><strong>{money(subtotal+1000)}</strong></div>
    <p className="fine">El servicio de $10 se cobra una sola vez por pedido. Pagas al recibir o recoger.</p>
    {!canOrder?<div className="cart-beta"><p>Este carrito es de prueba. Los pedidos todavía no están habilitados.</p><button type="button" className="button" onClick={e=>closeModal(cartDialog.current,e.detail)}>Seguir explorando</button></div>:!signedIn?<Link className="button" href="/acceso">Entrar para continuar</Link>:<form action={send} className="checkout-form">
     <label>Entrega<select value={method} onChange={e=>setMethod(e.target.value)} disabled={pending||!canOrder}>{!canOrder&&<option value="pickup">Pedidos aún no habilitados</option>}{methods.includes("pickup")&&<option value="pickup">Recoger en el negocio</option>}{methods.includes("delivery")&&<option value="delivery">A domicilio · envío por cotizar</option>}</select></label>
     {method==="delivery"&&<p className="fine">Aceptarás productos + $10 + envío después de recibir la cotización. El negocio aún no preparará tu pedido.</p>}
     <label>Tu nombre<input name="name" required maxLength={80} autoComplete="name" disabled={pending}/></label>
     <label>Tu teléfono<input name="phone" required type="tel" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} autoComplete="tel-national" placeholder="7341234567" aria-describedby="phone-help" title="Escribe los 10 dígitos de tu número, incluida la clave de la ciudad." disabled={pending}/></label><p id="phone-help" className="fine">10 dígitos, incluida la clave de tu ciudad. Nosotros agregamos +52.</p>
     {method==="delivery"&&<label>Dirección y referencias<textarea name="address" required minLength={5} maxLength={500} disabled={pending}/></label>}
     <label>Notas para el negocio<textarea name="notes" maxLength={500} disabled={pending}/></label>
     {error&&<p role="alert" className="alert">{error}</p>}
     <button className="button" disabled={pending||!canOrder||!cart.length}>{pending?"Guardando…":canOrder?"Solicitar pedido":"Pedidos aún no habilitados"}</button>
    </form>}
   </>}
  </div></dialog>
  <dialog ref={dialog} className="product-dialog" aria-labelledby="product-title" onCancel={()=>{if(dialog.current)dialog.current.dataset.motion="instant";}}>
   {selected&&<><button className="dialog-close" aria-label="Cerrar opciones" onClick={e=>closeModal(dialog.current,e.detail)}>×</button><p className="product-category">{selected.category}</p><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p><strong className="product-dialog-price">{money(selected.price_cents)}</strong>
    {selected.option_groups.map(g=><fieldset key={g.name}><legend>{g.name} · elige una opción</legend><div className="choice-grid">{g.choices.map(value=><label key={value}><input type="radio" name={g.name} value={value} checked={choices[g.name]===value} onChange={()=>setChoices({...choices,[g.name]:value})}/>{value}</label>)}</div></fieldset>)}
    <label className="quantity-label">Cantidad<input type="number" min={1} max={20} value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label>
    <button className="button" disabled={missingOptions||!Number.isInteger(quantity)||quantity<1||quantity>20} onClick={e=>add(e.detail)}>Agregar · {money(selected.price_cents*(Number.isFinite(quantity)?quantity:0))}</button>
   </>}
  </dialog>
 </section>;
}
