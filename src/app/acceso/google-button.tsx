"use client";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";
export function GoogleButton({destination}:{destination?:"admin"}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login() {
    setBusy(true);
    setError("");
    try {
      document.cookie="fudi-admin-return="+(destination==="admin"?"1":"0")+"; Path=/; Max-Age=600; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");
      const { data, error } = await browserClient().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
          scopes: "openid email profile",
          queryParams: { prompt: "select_account" },
          skipBrowserRedirect: true
        }
      });
      if (error || !data.url) throw new Error("login");
      window.location.assign(data.url);
    } catch {
      setError("No pudimos abrir Google. Revisa tu conexión y vuelve a intentar.");
      setBusy(false);
    }
  }
  return <><button className="button google-button" type="button" onClick={login} disabled={busy}><span className="google-g" aria-hidden="true">G</span>{busy ? "Abriendo Google…" : "Continuar con Google"}</button>{error && <p role="alert" className="alert">{error}</p>}</>;
}
