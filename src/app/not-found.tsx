import Link from "next/link";
export default function NotFound() { return <section className="card error-page"><h1>Por aquí todavía no es.</h1><p>No encontramos esta página.</p><Link className="button" href="/">Volver al inicio</Link></section>; }
