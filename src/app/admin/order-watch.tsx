"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderMonitor } from "@/lib/order-monitor";

export function OrderWatch({ ids }: { ids: string[] }) {
 const router = useRouter();
 const [monitor] = useState(() => new OrderMonitor(ids));
 const [, render] = useState(0);
 const [sound, setSound] = useState(false);
 const soundEnabled = useRef(false);
 const [pending, startTransition] = useTransition();
 const [notice, setNotice] = useState("");
 const audio = useRef<AudioContext | null>(null);
 const update = useCallback(() => render(value => value + 1), []);
 function beep() {
  const ctx = audio.current;
  if (!ctx || ctx.state !== "running") return;
  const tone = ctx.createOscillator(); const gain = ctx.createGain();
  tone.connect(gain); gain.connect(ctx.destination); tone.frequency.value = 740;
  gain.gain.setValueAtTime(.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .6);
  tone.start(); tone.stop(ctx.currentTime + .6);
 }
 async function toggle() {
  if (soundEnabled.current) { soundEnabled.current = false; setSound(false); return; }
  try {
   audio.current ??= new AudioContext(); await audio.current.resume();
   soundEnabled.current = true; setSound(true);
   setNotice("Sonido activado para pedidos nuevos por confirmar.");
  } catch { setNotice("No se pudo activar el sonido. Revisa los pedidos en pantalla."); }
 }
 const check = useCallback(async () => {
  const previous = monitor.checkedAt;
  const operation = monitor.check(async () => {
   const response = await fetch("/admin/order-status", { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000) });
   if (!response.ok) throw new Error("No se pudieron revisar los pedidos.");
   return response.json();
  }, Boolean(document.activeElement?.closest("form")));
  update();
  const fresh = await operation;
  if (fresh.length) {
   setNotice("Hay pedidos nuevos por confirmar.");
   if (soundEnabled.current) beep();
  }
  if (monitor.checkedAt !== previous && !monitor.paused && monitor.visible) startTransition(() => router.refresh());
  update();
 }, [monitor, router, update]);
 useEffect(() => {
  const mark = (event: Event) => {
   if (event.target instanceof Element && event.target.closest("form")) { monitor.edit(); update(); }
  };
  const visibility = () => { monitor.visible = document.visibilityState === "visible"; update(); };
  visibility();
  document.addEventListener("input", mark);
  document.addEventListener("change", mark);
  document.addEventListener("visibilitychange", visibility);
  const timer = window.setInterval(() => { void check(); }, 20000);
  void check();
  return () => {
   clearInterval(timer); document.removeEventListener("input", mark);
   document.removeEventListener("change", mark); document.removeEventListener("visibilitychange", visibility);
  };
 }, [check, monitor, update]);
 useEffect(() => () => { void audio.current?.close(); }, []);
 const state = monitor.paused ? "paused" : !monitor.visible ? "hidden" : monitor.failed && !monitor.pending ? "error" : "active";
 const label = state === "paused" ? "Monitoreo pausado" : state === "hidden" ? "Panel oculto · revisión en pausa" : state === "error" ? "No se pudo revisar" : monitor.pending ? "Revisando pedidos…" : "Monitoreo activo";
 return <section className="order-watch" data-state={state} aria-label="Monitoreo de pedidos">
  <div className="order-watch-status">
   <p className="order-watch-label" role="status" aria-live="polite"><span className="order-watch-dot" aria-hidden="true"/>{label}</p>
   <p className="order-watch-time">{monitor.checkedAt ? <>Última revisión correcta: <time dateTime={monitor.checkedAt}>{new Date(monitor.checkedAt).toLocaleString("es-MX", { timeZone: "America/Mexico_City", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time> · CDMX</> : "Esperando la primera revisión"}</p>
   {state === "paused" && <p className="order-watch-hint">Termina de editar y reanuda para actualizar.</p>}
   {state === "error" && <p className="order-watch-hint">Los datos pueden estar desactualizados. Intenta actualizar.</p>}
  </div>
  <div className="order-watch-actions">
   <button className="button secondary" type="button" aria-pressed={sound} onClick={toggle}>{sound ? "Sonido activado" : "Activar sonido"}</button>
   <button className="button secondary" type="button" disabled={monitor.pending || pending} onClick={() => { monitor.resume(); update(); void check(); }}>{monitor.pending || pending ? "Actualizando…" : monitor.paused ? "Reanudar monitoreo" : "Actualizar pedidos"}</button>
  </div>
  {notice && <p className="order-watch-notice" role="status">{notice}</p>}
  <details className="order-watch-details">
   <summary>Cómo funciona el monitoreo</summary>
   <p>Revisa cada 20 segundos con el panel visible y se pausa al editar un formulario. El sonido avisa de pedidos nuevos por confirmar mientras esta pantalla está abierta; no avisa con el teléfono bloqueado o la app cerrada.</p>
  </details>
 </section>;
}