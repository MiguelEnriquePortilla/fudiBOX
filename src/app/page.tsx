import Link from "next/link";
import "./home.css";
import { serverClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export default async function Home() {
 const client=await serverClient(); const {data:businesses,error}=await client.from("businesses").select("id,name,slug,address,logo_path").eq("status","approved").order("name");
 if(error)throw new Error("No se pudieron cargar los restaurantes.");
  return <>
    <section className="food-hero">
      <div className="hero-copy">
        <span className="eyebrow">EL SABOR DE JOJUTLA</span>
        <h1>La mesa <em>está puesta.</em></h1>
        <p>El sabor de los restaurantes de tu zona, en un solo lugar. Explora sus menús y elige tu próximo pedido.</p>
        <Link className="button" href="#restaurantes">Ver restaurantes <span aria-hidden="true">↗</span></Link>
        <p className="food-opening">Estamos preparando la apertura. Por ahora, consulta los menús.</p>
      </div>
      <div className="food-mascot"><img src="/assets/fudi-repa-v2-uniforme.png" fetchPriority="high" alt="Fudi, la mascota de fudiBOX, con casco naranja y mochila de reparto" /></div>
    </section>
    <section className="discovery" id="restaurantes">
      <div><span className="eyebrow">EXPLORA EL MENÚ</span><h2>Explora los restaurantes</h2></div>
      {(businesses||[]).map(b=><article className="merchant" key={b.id}>{b.logo_path&&<img src={b.logo_path} alt={b.name}/>}<div><span className="badge">Restaurante local</span><h3>{b.name}</h3><p>{b.address}</p><Link className="text-link" href={"/restaurantes/"+b.slug}>Ver menú y precios ↗</Link></div></article>)}
    </section>
  </>;
}
