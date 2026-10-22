# Arquitectura actual · 21 octubre 2026

Estado operativo: ../CONTINUIDAD/HANDOFF_ACTUAL.md. Beta publicada, recepción cerrada.

Next.js 16.3.7 / React 19.3 / TypeScript 5.9.3, Supabase Auth/PostgreSQL y @supabase/ssr. Monolito con rutas cliente/servidor. Credenciales privilegiadas nunca llegan al navegador. Sesión verificada en servidor; RLS/RPC limitan lectura y mutaciones. Importes enteros en centavos, precios calculados en servidor y fotografía del pedido conservada.

## Mapa de código

- src/app/page.tsx y layout.tsx: entrada, marca y metadatos.
- src/app/chicanito/: catálogo de referencia, opciones y carrito.
- src/app/restaurantes/[slug]/: catálogo por negocio.
- src/lib/public-business.ts: lectura compatible con esquema antiguo; cierra recepción y modalidades ante columnas ausentes específicas.
- src/app/cuenta/: pedidos del usuario, seguimiento y endpoint status.
- src/app/admin/: operación autorizada y endpoint order-status.
- supabase/migrations/: esquema, RLS y funciones transaccionales; un push no las instala.
- tests/: unidades, HTTP, SQL y transporte visual aislado.
- public/: recursos, manifiesto y soporte offline. No cachear datos privados ni reintentar compras offline.

## Capacidades y límites

Recogida permite solicitud, confirmación de disponibilidad/preparación, listo y entrega manual. Reservas e idempotencia en base de datos; tarifa única de $10 al completar. No implica pago o liquidación. Seguimiento mediante consultas visibles cada 20 segundos, no Supabase Realtime ni push con app cerrada. WhatsApp es transporte manual, no fuente de estados.

La migración 202610210001_order_methods.sql no está aplicada al alojamiento. Ver ../supabase/README.md. No atribuir a producción sus restricciones todavía.

Cotizaciones, vencimientos programados, asignación de reparto, códigos, transferencias, liquidación y ajustes son objetivos pendientes. El prototipo HTML/localStorage en Documents/ChatGPT/fudiBOX es histórico y no forma parte de la arquitectura publicada. Arquitectura objetivo anterior archivada en ../CONTINUIDAD/sesiones/2026-10-21-antes-de-consolidar/arquitectura.md.
