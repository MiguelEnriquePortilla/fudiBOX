import Link from "next/link";
export default function OperatorLayout({children}:{children:React.ReactNode}){
 return <section className="operator-shell"><header className="operator-heading"><h1>Operación</h1><Link href="/">Ver tienda</Link></header>{children}</section>;
}
