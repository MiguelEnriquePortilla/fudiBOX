import Link from "next/link";
export default function OperatorLayout({children}:{children:React.ReactNode}){
 return <section className="operator-shell"><header className="operator-heading"><div><span className="eyebrow">FUDIBOX · OPERACIÓN</span><h1>Centro de operación</h1><p>Restaurantes, repas y pedidos en un solo lugar.</p></div><Link href="/">Ver tienda ↗</Link></header>{children}</section>;
}