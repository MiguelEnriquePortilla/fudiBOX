import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
  title: "fudiBOX · Tu barrio, a tu puerta",
  description: "Comida de por acá. fudiBOX en Jojutla y alrededores.",
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>
    <header className="header">
      <Link href="/" aria-label="fudiBOX inicio"><img className="logo" src="/assets/fudibox-logo-flat-v3-ojos.png" alt="fudiBOX" /></Link>
      <span className="location">Jojutla y alrededores</span>
      <Link className="nav-link" href="/cuenta">Mi cuenta <span aria-hidden="true">↗</span></Link>
    </header>
    <main>{children}</main>
    <footer><strong>De tu barrio, a tu puerta.</strong><span>Versión de prueba · Pedidos aún no disponibles</span></footer>
  </body></html>;
}
