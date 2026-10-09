import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
 return {
  id: "/", name: "fudiBOX", short_name: "fudiBOX",
  description: "Comida de por acá. Tu barrio, a un toque.",
  lang: "es-MX", start_url: "/", scope: "/", display: "standalone",
  background_color: "#fff8ed", theme_color: "#063849",
  icons: [
   { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
   { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
   { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
 };
}
