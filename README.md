# fudiBOX
Marketplace local para Jojutla y alrededores. Primer negocio: Chicken Chicanito.

## Manual de uso y pruebas
[Guia por roles, altas y requisitos del piloto](docs/HOW-TO-GUIDE.md).

Sitio publicado: https://fudibox.vercel.app. Google, cuenta, panel y carrito comprobados en produccion el 1 de octubre de 2026. Recepcion de pedidos cerrada.

## Estado
Aplicación principal en C:/Users/hp/Desktop/FUDIGPT/fudiBOX. La carpeta Documents/ChatGPT/fudiBOX es histórica.

- Google funciona con la cuenta de Miguel; sesión verificada en servidor y aislamiento por RLS.
- Menú real de 45 productos/presentaciones en /chicanito, opciones y carrito.
- Panel /negocio autorizado para Miguel, con disponibilidad y atención inicial de pedidos.
- Solicitud, reserva, confirmación y cancelación transaccionales implementadas.
- Recepción cerrada: faltan cotización/aceptación, vencimientos, entrega/códigos y cierre del pedido.
- Compilación correcta, cinco pruebas HTTP y doce pruebas SQL con rollback superadas.
- Publicado en Vercel desde GitHub (main); sin pedidos operativos creados.

Leer CONTINUIDAD/HANDOFF_ACTUAL.md antes de continuar.

## Ejecutar
Con Node en PATH: npm install, npm run build y npm start.
En este equipo: ./run-fudibox.ps1 build y ./run-fudibox.ps1 start.
Abrir http://localhost:3000/chicanito o http://localhost:3000/negocio.
Mantener localhost durante OAuth.
./run-fudibox.ps1 test ejecuta pruebas HTTP con servidor encendido.
Las pruebas SQL están en tests/order-transactions.sql y revierten sus fixtures.

.env.local contiene únicamente URL y clave publicable de Supabase; nunca guardar secretos Google ni service_role.
Dependencias fijadas en package-lock.json. Node 24.18.1, Next.js 16.3.7.

## Archivos
- src/app/: portada, acceso, callback, cuenta, catálogo y panel.
- src/lib/supabase/: clientes y configuración pública; src/proxy.ts: sesión y protección de caché.
- supabase/migrations/: migraciones ya aplicadas; no repetir la inicial.
- docs/chicanito-catalog-source.json: datos y observaciones de la fuente.
- CONTINUIDAD/: estado y antecedentes.
- index.html, app.js, styles.css y brand.css: prototipo histórico con localStorage, no operativo.
