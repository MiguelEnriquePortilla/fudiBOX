import Link from "next/link";
export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">¡QUÉ ONDA! SOY FUDI, TU REPA.</span>
        <h1>Tú pon el antojo.<br />Yo me pongo <em>al tiro.</em></h1>
        <p>Puro sabor de por acá, hasta tu puerta.<br />Le estamos echando ganas para llegar a tu barrio.</p>
        <Link className="button" href="/chicanito">Ver menú de Chicanito <span aria-hidden="true">↗</span></Link>
        <div className="notes"><span>Negocios locales</span><span>Pago al recibir</span></div>
      </div>
      <div className="hero-art"><div className="halo" /><img src="/assets/fudi-repa-v2-uniforme.png" alt="Fudi te saluda con su casco naranja y mochila de reparto" /><span className="route-tag">DE TU BARRIO<br /><strong>A TU PUERTA</strong></span></div>
    </section>
    <section className="discovery">
      <div><span className="eyebrow">SABOR DE POR ACÁ</span><h2>Acá se come machín.</h2></div>
      <article className="merchant"><img src="/assets/chicanito-logo.jpg" alt="Chicken Chicanito" /><div><span className="badge">Primer negocio confirmado</span><h3>Chicken Chicanito</h3><p>Consulta los paquetes, complementos y salsas. Estamos preparando la apertura de pedidos en fudiBOX.</p><Link className="text-link" href="/chicanito">Ver menú y precios ↗</Link></div></article>
    </section>
  </>;
}
