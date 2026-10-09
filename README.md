# fudiBOX
Marketplace local para Jojutla y alrededores. Primer negocio: Chicken Chicanito.

## Manual de uso y pruebas
[Guia por roles, altas y requisitos del piloto](docs/HOW-TO-GUIDE.md).

Sitio publicado: https://fudibox.app. Dominio y Google comprobados el 7 de octubre de 2026. Recepcion general de pedidos cerrada.

## Estado
Aplicación principal en C:/Users/hp/Desktop/FUDIGPT/fudiBOX. La carpeta Documents/ChatGPT/fudiBOX es histórica.

- Google funciona con la cuenta de Miguel; sesión verificada en servidor y aislamiento por RLS.
- Menú real de 45 productos/presentaciones en /chicanito, opciones y carrito.
- Panel central /admin para Miguel: restaurantes, menús, contactos de repartidores, cola de pedidos, historial, contadores, sonido opcional y borradores de WhatsApp. /negocio redirige a /admin.
- Solicitud, reserva, confirmación y cancelación transaccionales implementadas.
- Recogida: listo y cierre manual implementados, con cargo único de servicio. Ensayo real completado el 7 de octubre; recepción cerrada. Domicilio y validación por código pendientes.
- Compilación correcta; 14 pruebas aprobadas (11 HTTP contra producción y 3 locales). Pruebas SQL de listo/cierre con rollback superadas. Falta probar llegada de un pedido en el panel nuevo.
- Publicado en Vercel desde GitHub (main); un pedido real de recogida completado.

Leer CONTINUIDAD/HANDOFF_ACTUAL.md antes de continuar.

## Ejecutar
Con Node en PATH: npm install, npm run build y npm start.
En este equipo: ./run-fudibox.ps1 build y ./run-fudibox.ps1 start.
Abrir http://localhost:3000/chicanito o http://localhost:3000/admin.
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

## Instalar como app
Abrir https://fudibox.app y pulsar Instalar app. Android: Chrome, Instalar app. iPhone: Safari, Compartir > Agregar a pantalla de inicio. Requiere internet para pedidos; sin conexion muestra un aviso y no reenvia compras. Manifest, iconos y service worker incluidos. Prueba fisica en telefono pendiente.

## Cierre del 9 de octubre de 2026
- Diseño aprobado: Fudi completo en moto, fondo crema con íconos discretos de comida mexicana. Título: La mesa está puesta. Mantener lenguaje claro y natural.
- Panel: En curso / Historial, actualización cada 20 segundos con página visible, pausa al editar, sonido opcional. Miguel confirmó el pitido de activación; llegada de pedido pendiente de prueba.
- WhatsApp prepara un borrador; el operador elige destinatario y envía. No actualiza estados mediante respuestas.
- Siguiente paso: elegir cuenta de prueba y autorizar un único pedido real de recogida; recepción general cerrada y permiso previo consumido. No habilitar automáticamente.
- Pendientes: acceso Mi panel desde Mi cuenta para operadores, prueba de instalación móvil y posterior evaluación del enlace de restaurante.
- Leer [handoff vigente](CONTINUIDAD/HANDOFF_ACTUAL.md) para retomar. No cerrar las sesiones de servicios.
