"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="card error-page"><h1>No pudimos cargar esta página.</h1><p>Revisa tu conexión e inténtalo de nuevo.</p><button className="button" onClick={reset}>Reintentar</button></section>;
}
