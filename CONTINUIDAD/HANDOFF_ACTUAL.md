# Estado para retomar fudiBOX

Actualizado: **21 octubre 2026**. Frase de entrada: **Open fudiBOX Project**. Leer README.md y AGENTS.md. Este estado prevalece sobre sesiones anteriores.

## Cierre definitivo · 21 octubre 2026

Último cambio funcional publicado: **d5cd689**, sobre main. Vercel confirmó success y una lectura HTTPS de https://fudibox.app/acceso confirmó Fudi completo, mailto:thefudibox@gmail.com y «Instalar fudiBOX», sin el antiguo banner. README, DESIGN y guía registran las decisiones. Servidores locales de esta revisión (3012/3013) detenidos al cerrar; los enlaces de preview anteriores requieren volver a iniciar servidor.

Recogida sigue en beta cerrada, sin restaurantes reales operando. Migración 202610210001_order_methods.sql y certificado de www pendientes. Contacto público YA definido: thefudibox@gmail.com; no volver a preguntar ni mostrar soporte no disponible. Aún faltan políticas operativas y pruebas reales; publicar la interfaz no abre recepción ni instala SQL.

Retomar con **Open fudiBOX Project**. Leer este handoff y README, comprobar Git y usar el principal C:/Users/hp/Desktop/FUDIGPT/fudiBOX. No quedan ajustes visuales aprobados sin publicar. La siguiente sesión no necesita volver a revisar Fudi, Google o posición de instalación.

## Decisiones y ubicación

BETA sin restaurantes reales operando, según Miguel. Recepción general cerrada. Chicanito es referencia de desarrollo; antiguos pedidos/pruebas no establecen negocio activo.

Sitio principal: https://fudibox.app. GitHub: https://github.com/MiguelEnriquePortilla/fudiBOX.git. Rama única main; Vercel publica sus pushes. Evitar crear ramas o PR por rutina.

Principal local: C:/Users/hp/Desktop/FUDIGPT/fudiBOX. Worktree de apoyo: C:/Users/hp/Documents/ChatGPT/fudiBOX/pickup-readiness, sin rama propia tras integrar. Su padre es un prototipo histórico. Revisar Git antes de modificar; conservar archivos ignorados de entorno y herramientas.

Cambio funcional previo: ed3999ff87eef8203c8dc3da109aa28df195a394, «Polish beta UI and use Restaurantes Locales branding», incluye b50ba97 de controles/seguimiento. Rama temporal eliminada tras integración. Los commits posteriores de documentación no cambian ese identificador funcional.

Texto aprobado «Restaurantes Locales», retirando «Restaurantes en Jojutla» de presentación general. Esto no modifica direcciones de negocio. Identidad aprobada: Fudi completo en motocicleta, patrón crema, petróleo/naranja, «La mesa está puesta.», español mexicano claro. Ver DESIGN.md.

## Incidencia www detectada al cerrar

Captura de Miguel: NET::ERR_CERT_COMMON_NAME_INVALID para https://www.fudibox.app. Comprobación externa Python con validación TLS el 21 octubre: https://fudibox.app responde 200; https://www.fudibox.app falla por hostname mismatch. No se corrigieron DNS ni certificados. Revisar asociación de www al proyecto, DNS esperado y emisión TLS; después redirigir a dominio principal. No desactivar validación ni pedir al usuario saltarse el aviso. La comprobación no determina por sí sola cuál registro DNS concreto está mal.

## Implementación actual

Google, catálogo/opciones/carrito, cuenta /cuenta y administración /admin con autorización en servidor y RPC/RLS. Un negocio por pedido. Precios, reservas e idempotencia se comprueban en servidor.

Recogida: requested → preparing (operador confirma disponibilidad/estimación) → ready → delivered por confirmación manual. Sin código de entrega. Se registra servicio $10 una vez al completar y reservas consumidas sin segundo descuento. No certifica cobro ni liquidación. Cliente cancela sólo en requested/awaiting_quote/quoted; excepciones posteriores no implementadas.

Cliente: /cuenta/status devuelve sólo pedidos propios, conserva última lectura correcta ante fallos y descarta lecturas anteriores a cancelación, nuevas props o desmontaje. Errores de acción antes de la lista. Seguimiento antes de ajustes, pasos semánticos, dirección, estimación y desglose de importes.

Operador: /admin/order-status exige autorización (401/403/503), no-store. Consulta cada 20 segundos si visible, recuerda solicitudes vistas, sonido opcional sólo para nuevas y pausa al editar. Estado de última lectura, error, pausa y pestaña oculta. Esto no es notificación con móvil bloqueado/app cerrada.

Catálogo móvil con filas y categorías horizontales, carrito inferior con espacio seguro; diálogos nativos de 240 ms por puntero, teclado inmediato, Escape/retorno de foco y reducción de movimiento. Carrito cerrado no solicita datos inútiles. No se animan listas/importes en cada consulta. Sin dependencias de animación nuevas.

WhatsApp abre borradores; el operador elige destinatario y envía. Repartidores son contactos. Sin enlace privado de aceptación para restaurante, cotización/aceptación/vencimiento de domicilio, asignación operativa, códigos, conciliación semanal ni registro de pagos.

## Migración alojada pendiente

Supabase: aybgfwjbnsqbfnzmztmx. **202610210001_order_methods.sql NO aplicada al alojamiento.** Añade pickup_enabled=true/delivery_enabled=false, preserva recepción y restringe create_customer_order/my_pickup_pilot. Lectura alojada anterior al push: 42703 por pickup_enabled ausente. No había sesión/herramienta Supabase conectada para aplicarla.

src/lib/public-business.ts solicita campos nuevos; sólo ante 42703 que mencione pickup_enabled/delivery_enabled reintenta proyección antigua y fuerza accepting_orders=false, pickup_enabled=false y delivery_enabled=false. Otros errores se conservan. Ambas rutas de catálogo lo usan y ocultan piloto si recogida está deshabilitada. Cuatro pruebas cubren compatibilidad. Navegar con esquema antiguo no establece las nuevas restricciones SQL.

Un push no migra Supabase, concede permisos piloto ni abre recepción. No repetir migraciones históricas. Aplicar sólo la nueva mediante docs/pickup-readiness-release.md, verificar permisos y conservar recepción cerrada.

## Evidencia fechada del cierre funcional

- Build de producción y TypeScript correctos con configuración pública alojada.
- 34 pruebas automatizadas pasaron localmente y de nuevo con TEST_BASE_URL=https://fudibox.app tras el despliegue.
- Cinco suites SQL aisladas: order-transactions, pickup-ready, complete-pickup, pickup-pilot, order-methods. PostgreSQL/WASM sin leer .env ni conectarse a Supabase; no demuestra concurrencia multisesión real.
- Revisión independiente sin problemas materiales restantes. Detector Impeccable limpio en marcado revisado. Se corrigió error de acción fuera de lugar y BOM en CSS.
- Navegador 390/820/1280 px sin desbordamiento en catálogo/cuenta; opciones, carrito, vacío, teclado/Escape/foco y estados sintéticos largo/listo/cancelado/error. No compra enviada.
- Estado público GitHub: Vercel success para ed3999f. HTML publicado mostró título y beta nuevos. Consulta de detalle Vercel devolvió 403 de alcance, no fallo de despliegue.
- Sin migración alojada, altas piloto ni operaciones financieras realizadas en la sesión. Servidores de prueba detenidos al cierre; comprobar puertos antes de reutilizar.

Estas comprobaciones son históricas fechadas; no implican repetición automática en una futura sesión. HTTP anónimo y fixtures no sustituyen recorrido autenticado ni teléfonos físicos.

## Continuar

Ver PLAN.md. Prioridades: incidencia www, migración controlada, soporte, políticas de no recogida/cancelación posterior/correcciones, prueba autenticada cliente-operador y Android/iPhone físicos. El sonido de una entrada real y segundo plano siguen sin comprobar. PWA tiene manifiesto/iconos/aviso offline; no almacena pedidos privados ni reenvía compras. Conciliación y domicilio requieren trabajo adicional.

Al retomar, resumir brevemente y atender el trabajo que Miguel solicite sin repetir descubrimiento general. No abrir por cambiar un interruptor ni asumir definidas las incidencias.

## Herramientas y entorno

run-fudibox.ps1: dev/build/start/typecheck/test, descubre todos tests/*.test.mjs. Node alternativo: C:/Users/hp/AppData/Local/Programs/Python312/Lib/site-packages/playwright/driver/node.exe. Python: C:/Users/hp/AppData/Local/Programs/Python312/python.exe. Definir TEST_BASE_URL para HTTP; localhost preferible para OAuth. No rehacer Google ni cerrar sesiones sin fallo demostrado. .env.local y secretos permanecen fuera de Git; no imprimirlos.

SQL: PGLITE_MODULE=.test-tools/pglite/package/dist/index.js (herramienta ignorada PGlite 0.5.11), ejecutar Node tests/run-sql.mjs. Runner sólo en memoria, no usa .env.

Visual: tests/fixtures/read-only-backend.mjs en loopback54329 rechaza escrituras de negocio. FUDI_VISUAL_FIXTURE=1 carga catálogo grabado. fixture/session permite roles customer/operator y escenarios empty/cancelled/ready/long/error/checkout; sesiones falsas sólo válidas contra transporte falso. Preview de app usó localhost3011. Variables NEXT_PUBLIC_SUPABASE_URL=http://localhost:54329 y clave sb_publishable_fixture_only sólo para ese build local. Recompilar con configuración alojada antes de publicar; variables públicas se incorporan al build.

Habilidades oficiales instaladas: Impeccable, Emil Kowalski (emil-design-eng, animate, mobile-native, review-animations), frontend-design y Superpowers. No hooks ni cambio de plataforma. Datos reales, mensajes y migraciones requieren el alcance/autorización correspondiente, no se derivan de abrir contexto.

Actualizar este archivo y evidencia al cerrar. Antecedentes reemplazados: sesiones/2026-10-21-antes-de-consolidar/. No borrar historia ni usarla como estado vigente.

## Ajuste de acceso publicado

21 octubre: Miguel aprobó corregir el símbolo de Google y completar a Fudi. Publicado en main mediante d5cd689: acceso usa fudi-repa-v3-cuerpo-completo.png (generado a partir del original, transparente, pantalón y botas) y google-g-official.png descargado de https://developers.google.com/static/identity/images/g-logo.png. Se conserva el original y el flujo OAuth. CSS específico evita ilustración cortada/superpuesta en móvil. TypeScript comprobado; imágenes cargadas y sin desbordamiento horizontal a 390 px. Vista previa http://127.0.0.1:3012/acceso; usar 127 para revisar sin cerrar la sesión localhost de Miguel. Miguel revisó y aprobó la imagen y autorizó commit/push. Estos cambios suceden a ed3999f.

## Pie de página y contacto publicados

Miguel aprobó el aspecto de Fudi y Google. Pidió retirar el banner de instalación y confirmó thefudibox@gmail.com como correo público. Publicado en d5cd689: instalación discreta en el pie de página junto a Contáctanos (mailto); la ayuda de pedidos usa ese mismo correo. Se conservan instrucciones por plataforma y evento nativo de instalación; sin instalar nada durante la comprobación. Este correo sustituye el pendiente anterior de configurar contacto visible. Continúan pendientes las políticas operativas y demás verificaciones antes de abrir. Miguel aprobó todo y autorizó commit/push. Build de producción y 34 pruebas pasaron con TEST_BASE_URL=http://localhost:3013. La primera ejecución por 127.0.0.1 no coincidió con el origen localhost que usa el callback de Next; usando el origen local recomendado pasó la suite.
