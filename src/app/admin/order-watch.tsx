"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
export function OrderWatch({ ids }: { ids: string[] }) {
 const router = useRouter();
 const [sound, setSound] = useState(false);
 const [pending, startTransition] = useTransition();
 const [notice, setNotice] = useState("");
 const audio = useRef<AudioContext | null>(null);
 const seen = useRef(new Set(ids));
 const dirty = useRef(false);
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
  if (sound) { setSound(false); return; }
  try { audio.current ??= new AudioContext(); await audio.current.resume(); setSound(true); beep(); }
  catch { setNotice("No se pudo activar el sonido. Revisa los pedidos en pantalla."); }
 }
 useEffect(() => {
  const fresh = ids.filter(id => !seen.current.has(id));
  ids.forEach(id => seen.current.add(id));
  if (fresh.length) { setNotice("Hay pedidos nuevos por confirmar."); if (sound) beep(); }
 }, [ids, sound]);
 useEffect(() => {
  const mark = (event: Event) => { if ((event.target as Element)?.closest("form")) dirty.current = true; };
  document.addEventListener("input", mark);
  const timer = window.setInterval(() => {
   if (document.visibilityState !== "visible" || dirty.current || document.activeElement?.closest("form")) return;
   startTransition(() => router.refresh());
  }, 20000);
  return () => { clearInterval(timer); document.removeEventListener("input", mark); };
 }, [router]);
 useEffect(() => () => { void audio.current?.close(); }, []);
 return <div className="order-watch"><button className="button secondary" type="button" aria-pressed={sound} onClick={toggle}>{sound ? "Sonido activado" : "Activar sonido"}</button><button className="button secondary" type="button" disabled={pending} onClick={() => { dirty.current = false; startTransition(() => router.refresh()); }}>{pending ? "Actualizando…" : "Actualizar pedidos"}</button><p>Se revisan cada 20 segundos con el panel visible. La revisión se pausa mientras editas un formulario. El sonido requiere mantener esta pantalla abierta.</p><p role="status">{notice}</p></div>;
}
