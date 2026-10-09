"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type InstallEvent = Event & {
 prompt: () => Promise<void>;
 userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
 const pathname = usePathname();
 const [installed, setInstalled] = useState(false);
 const [ios, setIos] = useState(false);
 const [ready, setReady] = useState(false);
 const [busy, setBusy] = useState(false);
 const [message, setMessage] = useState("");
 const pending = useRef<InstallEvent | null>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const display = window.matchMedia("(display-mode: standalone)");
  const sync = () => setInstalled(display.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
  sync();
  setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  const offer = (event: Event) => { event.preventDefault(); pending.current = event as InstallEvent; setReady(true); };
  const done = () => { setInstalled(true); pending.current = null; setReady(false); dialog.current?.close(); };
  window.addEventListener("beforeinstallprompt", offer);
  window.addEventListener("appinstalled", done);
  display.addEventListener("change", sync);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => { /* Online ordering remains available. */ });
  return () => { window.removeEventListener("beforeinstallprompt", offer); window.removeEventListener("appinstalled", done); display.removeEventListener("change", sync); };
 }, []);
 async function install() {
  const event = pending.current;
  if (!event || busy) return;
  setBusy(true); setMessage("");
  try {
   await event.prompt();
   const { outcome } = await event.userChoice;
   setMessage(outcome === "accepted" ? "Sigue la confirmación de tu dispositivo para terminar la instalación." : "Puedes instalarla después desde el menú de tu navegador.");
  } catch { setMessage("Abre el menú de tu navegador y busca Instalar app o Agregar a pantalla de inicio."); }
  finally { pending.current = null; setReady(false); setBusy(false); }
 }
 if (installed || pathname.startsWith("/admin") || pathname.startsWith("/auth/")) return null;
 return <aside className="pwa-install" aria-label="Instalar fudiBOX">
  <img src="/icons/icon-192.png" width="44" height="44" alt="" />
  <p><strong>fudiBOX, a un toque</strong><span>Agrega la app a tu pantalla de inicio.</span></p>
  <button type="button" className="button" onClick={() => dialog.current?.showModal()}>Instalar app</button>
  <dialog ref={dialog} className="pwa-dialog" aria-labelledby="pwa-title">
   <button type="button" className="dialog-close" aria-label="Cerrar instrucciones" onClick={() => dialog.current?.close()}>×</button>
   <img src="/icons/icon-192.png" width="72" height="72" alt="" />
   <h2 id="pwa-title">Lleva fudiBOX contigo</h2>
   <p>Abre tu menú desde el icono de tu pantalla de inicio. Necesitas internet para consultar y enviar pedidos.</p>
   {ready && <button type="button" className="button" disabled={busy} onClick={install}>{busy ? "Abriendo instalación…" : "Instalar en este dispositivo"}</button>}
   {ios ? <p>En Safari, toca <strong>Compartir → Agregar a pantalla de inicio → Agregar</strong>. Si aparece <strong>Abrir como app web</strong>, déjalo activado.</p> : <><p><strong>Android:</strong> abre el menú ⋮ de Chrome y elige <strong>Instalar app</strong> o <strong>Agregar a pantalla de inicio</strong>.</p><p><strong>Computadora:</strong> busca el icono de instalación en la barra de direcciones o la opción de instalar en el menú de Chrome o Edge.</p></>}
   <p className="fine">Si abriste el enlace desde WhatsApp u otra app, ábrelo en Chrome o Safari. En iPhone: Compartir → Agregar a pantalla de inicio.</p>
   <p role="status">{message}</p>
  </dialog>
 </aside>;
}
