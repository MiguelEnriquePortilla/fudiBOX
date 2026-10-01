# Handoff actual · FudiBOX
Cierre solicitado por Miguel: 29 de septiembre de 2026.

## Leer primero
Carpeta principal: C:/Users/hp/Desktop/FUDIGPT/fudiBOX.
La copia de Documents/ChatGPT/fudiBOX es histórica/staging. Continuar implementación en Desktop.
Sesión detenida por petición del usuario; no hay trabajo programado en segundo plano.

## Avance confirmado
- Arquitectura elegida: Vercel + Supabase. Miguel ya tiene cuenta de Vercel; no se ha desplegado la app.
- Supabase: proyecto fudiBOX, ref aybgfwjbnsqbfnzmztmx, región us-east-1, plan gratuito.
- URL: https://aybgfwjbnsqbfnzmztmx.supabase.co.
- Configuración pública guardada en .env.local, excluida por .gitignore. .env.example conserva placeholders. No copiar claves secretas a documentación.
- Migración supabase/migrations/202609290001_initial_schema.sql ejecutada por Miguel. Compartió resultado con las nueve tablas públicas y rls_enabled=true en todas: businesses, drivers, inventory_reservations, ledger_entries, order_items, orders, products, profiles, settlements.
- Evidencia guardada en CONTINUIDAD/RESULTADO-SUPABASE-2026-09-29.json. Es el resultado aportado por el usuario, no una auditoría independiente.
- SQL validado sintácticamente de forma local (50 sentencias). La migración incluye cinco tablas privadas y funciones auxiliares; no se han probado todavía permisos entre usuarios ni concurrencia.
- No volver a ejecutar la migración inicial: no es idempotente.
- Voz de marca aprobada: barrio para todos; “órale”, “va que va”, “al tiro”, “machín”, “sí, pues”; “de poca…” ocasional. Ver docs/VOZ-DE-MARCA.md.

## Estado real de la aplicación
El frontend sigue siendo el prototipo HTML/CSS/JavaScript con localStorage y selector de roles de demo. No lee .env.local ni está conectado a Supabase.
La base inicial existe, pero aún no hay autenticación integrada, usuarios operativos, funciones transaccionales de pedidos, reservas reales, tarea de vencimientos, Storage configurado ni despliegue.
RLS activado no equivale a haber validado todo el aislamiento. Las escrituras desde clientes permanecen bloqueadas hasta implementar las funciones correspondientes.

## Punto exacto para retomar
La última pregunta sigue SIN RESPUESTA: ¿cómo entrarán los clientes?
A. Correo y contraseña (recomendación inicial).
B. Cuenta de Google.
C. Celular y código SMS.
Retomar con esa única pregunta, sin repetir decisiones previas ni asumir que ya eligió A.

Después de la respuesta:
1. Configurar autenticación e implementar la aplicación Next.js/TypeScript con la identidad ya aprobada.
2. Conectar Supabase y permisos por cliente, negocio, coordinador y administrador.
3. Implementar operaciones transaccionales, totales del servidor, reservas, idempotencia, vencimientos y código de entrega.
4. Probar aislamiento entre usuarios, concurrencia y flujo completo antes de publicar en Vercel.
5. Incorporar catálogo/precios, dirección/pin, cobertura y teléfonos reales del primer negocio/coordinadores.

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

## Preferencias y límites para continuidad
Preguntas de opción múltiple, UNA a la vez. Avanzar con las decisiones autorizadas, sin repetir permisos. No cambiar el logo con ojos aprobado.
No integrar Shipday ni pagos en línea en esta etapa. No confundir FudiBOX con FUDIGPT MCP.
La elección del método de acceso sigue pendiente. No se contrató ningún plan de pago en esta sesión.
