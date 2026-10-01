# Handoff FudiBOX · cierre 25 septiembre 2026

## Actualización · 29 septiembre 2026 — voz de marca
Miguel aprobó tono A: con barrio, pero para todos. Órale, va que va, sí, pues, al tiro, machín; «de poca…» ocasional y abreviado. Aplicado al cliente; guía en docs/VOZ-DE-MARCA.md. No cambia identidad visual, logo con ojos ni flujo operativo. Sesión retomada para lenguaje de marca, antes de configurar backend. La pregunta sobre cuenta Supabase quedó sin respuesta; no inferir que existe.

## Cierre final de sesión · 25 septiembre 2026
Sesión cerrada por solicitud de Miguel. Retomar mañana desde esta carpeta principal; la copia de Documents es antecedente y no debe usarse para continuar sin sincronizar.

Guardado verificado: proyecto, logo oficial con ojos, personaje con gafete y logos, variante en moto, prompts, pruebas y continuidad. La moto está en assets/fudi-moto-v1.png; el hero conserva el personaje de uniforme v2.

Punto de reanudación: leer CONTINUIDAD/HANDOFF_ACTUAL.md y PLAN.md, abrir index.html y continuar hacia persistencia y usuarios reales según el alcance aprobado. Antes de publicar, faltan catálogo/precios reales, dirección del negocio, coordinadores y configuración del backend. No hay despliegue ni pagos contratados. No repetir el cuestionario ni cambiar el logo aprobado.

## Estado real
Prototipo HTML/CSS/JavaScript local, abre index.html directamente. localStorage en un solo navegador, selector de roles de demostración. NO backend, autenticación, inventario real, despliegue ni pedidos reales. NO Next.js/Supabase instalado aún. No hay suscripciones contratadas. La cuenta Shipday existe, pero se decidió posponer integración por costo y cambiar a coordinación manual por WhatsApp.

## Identidad aprobada
Última ampliación: `assets/fudi-moto-v1.png`, Fudi sobre moto de reparto con uniforme y marca. Asset complementario generado; no sustituye automáticamente al personaje de bienvenida. La versión de uniforme fue aprobada explícitamente por el usuario.
Logo oficial provisional: assets/fudibox-logo-flat-v3-ojos.png, lunchbox plano azul petróleo con ojos y sonrisa naranja. La última elección con ojos prevalece sobre la reversión anterior sin ojos. No usar las exploraciones como oficiales.
Mascota vigente: assets/fudi-repa-v2-uniforme.png, robot con casco/mochila naranja, gafete FUDI con logo debajo, logo en casco y mochila. Aplicada al hero. La v1 se conserva como antecedente. PNG generado con transparencia mediante imagegen; no vector final.
Chicken Chicanito es el primer negocio confirmado; sus imágenes provienen de chicanito.app. Menú y precios de la demo son ficticios, pendientes de catálogo real. No inventar negocios adicionales.

## Operación aprobada
Marketplace de comida en Jojutla y alrededores, un negocio por pedido. Solo pagos al recibir o recoger. FudiBOX cobra $10 fijos por pedido completado y el negocio liquida semanalmente, registro de pagos manual.
Ejemplo: productos $100 + FudiBOX $10 + envío $30 = cliente paga $140; repartidor adelanta $110 al negocio y conserva $30 al cobrar. Para recoger cliente paga $110 al negocio.
Negocio confirma disponibilidad, NO prepara todavía. Abre WhatsApp y envía solicitud al coordinador principal. Coordinador cotiza en panel y avisa por WhatsApp con enlace (enlace público PENDIENTE). Cliente acepta en 10 minutos o vence y se liberan reservas (reservas reales PENDIENTES). Solo después se prepara y asigna un repartidor. Un pedido activo por repartidor.
Coordinador registra repartidor y valida código comunicado por cliente → repartidor → coordinador. Para recoger, negocio valida código directamente. Principal y respaldo: negocio transfiere mediante Solicitar apoyo; conservar precio, vencimiento y aceptación.
Negocio atiende incidencias; FudiBOX interviene si hace falta. Si repartidor adelantó y cliente no recibe, negocio reembolsa adelanto. Pago de intento de entrega se decide manualmente. Cuota futura del repartidor por usar plataforma queda sin definir.

## Implementado en demo
Catálogo de ejemplo; crear pedido; confirmar; cotizar; aceptar; pasar a listo; registrar repartidor; validar código; sumar adeudo de $10 al completar; transferir respaldo; números configurables; enlaces wa.me preparados. Abrir WhatsApp NO prueba que se haya enviado o recibido el mensaje.

## Validaciones
tests/workflow.cjs pasó: cotización, transferencia sin reinicio, aceptación, código incorrecto, cierre único, recoger, vencimiento exacto y repartidor ocupado. Navegador Chrome probado durante la sesión: flujo hasta aceptación, anchos 390/720/1280 sin desbordamiento, sin errores JavaScript. Las capturas anteriores al uniforme se conservan como históricas.
Node no está en PATH. Runtime disponible: C:/Users/hp/AppData/Local/Programs/Python312/Lib/site-packages/playwright/driver/node.exe. Python: C:/Users/hp/AppData/Local/Programs/Python312/python.exe. Ejecutar tests desde raíz del proyecto. No hay build ni servidor requerido para esta demo.

## Próximo trabajo
1. Trabajar desde carpeta principal solicitada; evitar divergencia con la copia original de Documents.
2. Confirmar catálogo, dirección/pin, teléfonos de coordinadores y cobertura reales.
3. Implementar arquitectura acordada Next.js/TypeScript y PostgreSQL/Supabase: usuarios, permisos por rol/negocio, precios servidor, reservas, transacciones, idempotencia, vencimientos servidor y auditoría.
4. Conectar paneles entre dispositivos; enlace privado del cliente; código con hash e intentos limitados; corte semanal y cancelaciones.
5. Piloto real con un negocio y dos repartidores (Android e iPhone) después de tener persistencia/autenticación.
6. Segunda etapa: programados, sustituciones, eventual automatización de reparto y pagos en línea.

## Preferencias del usuario
Preguntas de opción múltiple, UNA a la vez. Lanzar en 4–6 semanas. Construye solo con IA. Avanzar sin repetir permisos o decisiones ya resueltas. Actualmente pidió cerrar y organizar sesión, después añadió el uniforme de la mascota.

## Supabase configurado · 29 septiembre 2026
Proyecto fudiBOX, ref aybgfwjbnsqbfnzmztmx, URL https://aybgfwjbnsqbfnzmztmx.supabase.co. Clave publishable recibida del usuario y guardada en .env.local; archivo excluido por .gitignore. No se recibió ni se necesita por ahora service_role/secret. Arquitectura confirmada Vercel + Supabase. Esta configuración está preparada para la futura app Next.js; el prototipo HTML no lee .env.local y sigue local. Pendiente implementar aplicación conectada, esquema, RLS y autenticación. No hay migraciones aplicadas por esta sesión.
## Base de datos · 29 septiembre 2026
Usuario confirmó proyecto Supabase nuevo, vacío y exclusivo para FudiBOX. Se preparó supabase/migrations/202609290001_initial_schema.sql: nueve tablas públicas y cinco privadas; catálogo con lectura pública, lectura segmentada por identidad, escrituras API revocadas. Instalación remota PENDIENTE: el usuario debe ejecutar una vez en SQL Editor. No afirmar tablas creadas hasta verificar resultado. Próxima migración: funciones transaccionales y tests reales de aislamiento/concurrencia; todavía no hay conexión de pedidos desde frontend.