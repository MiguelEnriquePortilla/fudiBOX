import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export default async function Home() {
 const client=await serverClient(); const {data:businesses,error}=await client.from("businesses").select("id,name,slug,address,logo_path").eq("status","approved").order("name");
 if(error)throw new Error("No se pudieron cargar los restaurantes.");
  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">RESTAURANTES EN JOJUTLA</span>
        <h1>Tu próxima comida,<br /><em>más cerca.</em></h1>
        <p>Explora restaurantes locales y encuentra tus platillos favoritos.<br />Consulta los menús y precios mientras preparamos la apertura.</p>
        <Link className="button" href="/chicanito">Ver menú de Chicanito <span aria-hidden="true">↗</span></Link>
        <div className="notes"><span>Restaurantes locales</span><span>Pago al recibir</span></div>
      </div>
      <div className="hero-art"><div className="halo" /><img src="/assets/fudi-repa-v2-uniforme.png" alt="Fudi te saluda con su casco naranja y mochila de reparto" /><span className="route-tag">TUS RESTAURANTES<br /><strong>MÁS CERCA</strong></span></div>
    </section>
    <section className="discovery">
      <div><span className="eyebrow">EXPLORA EL MENÚ</span><h2>Restaurantes disponibles</h2></div>
      {(businesses||[]).map(b=><article className="merchant" key={b.id}>{b.logo_path&&<img src={b.logo_path} alt={b.name}/>}<div><span className="badge">Restaurante local</span><h3>{b.name}</h3><p>{b.address}</p><Link className="text-link" href={"/restaurantes/"+b.slug}>Ver menú y precios ↗</Link></div></article>)}
    </section>
  </>;
}
