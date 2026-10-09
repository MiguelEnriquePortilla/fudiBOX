import Link from "next/link";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { GoogleButton } from "./google-button";
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const client = await serverClient();
  const { data: { user } } = await client.auth.getUser();
  if (user) redirect("/cuenta");
  const { error } = await searchParams;
  return <section className="auth-grid">
    <div className="auth-story"><span className="eyebrow">BIENVENIDO A FUDIBOX</span><h1>Todo listo<br />para empezar.</h1><p>Inicia sesión para consultar y dar seguimiento a tus pedidos.</p><img src="/assets/fudi-repa-v2-uniforme.png" alt="Fudi, la mascota de fudiBOX" /></div>
    <div className="auth-card"><span className="badge">Acceso de prueba</span><h2>Bienvenido a fudiBOX</h2><p>Entra con tu cuenta de Google.</p>
      {error && <p role="alert" className="alert">No pudimos completar el acceso. Vuelve a intentarlo desde este botón.</p>}
      <GoogleButton />
      <p className="fine">Google compartirá tu nombre, correo y foto de perfil para identificar tu cuenta. Tu contraseña permanece en Google.</p>
      <div className="divider" /><p className="fine">Estamos preparando el servicio. Aún no puedes realizar pedidos.</p><Link className="text-link" href="/">Volver al inicio</Link>
    </div>
  </section>;
}
