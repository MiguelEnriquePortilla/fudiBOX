import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import "./pwa.css";
import "./ui.css";
import { InstallApp } from "./install-app";
export const viewport: Viewport = { themeColor: "#063849", viewportFit: "cover" };
export const metadata: Metadata = {
  applicationName: "fudiBOX",
  appleWebApp: { capable: true, title: "fudiBOX", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  title: "fudiBOX · Restaurantes Locales",
  description: "Explora restaurantes locales, consulta sus menús y encuentra tus platillos favoritos.",
  robots: { index: false, follow: false }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>
    <header className="header">
      <Link href="/" aria-label="fudiBOX inicio"><img className="logo" src="/assets/fudibox-logo-flat-v3-ojos.png" alt="fudiBOX" /></Link>
      <span className="location">Restaurantes Locales</span>
      <Link className="nav-link" href="/cuenta">Mi cuenta <span aria-hidden="true">↗</span></Link>
    </header>
    <InstallApp />
    <main>{children}</main>
    <footer><strong>Tus restaurantes, más cerca.</strong><span>Versión de prueba · Pedidos aún no disponibles</span></footer>
  </body></html>;
}
