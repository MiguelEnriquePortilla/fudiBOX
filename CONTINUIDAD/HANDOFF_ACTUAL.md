# Operación centralizada — 2 octubre 2026

Este estado prevalece sobre los antecedentes siguientes.
- Cliente separado de /admin; /cuenta sin enlace de negocio y /negocio redirige al administrador.
- Miguel autorizado explícitamente y dado de alta en fudi_private.admins. No otorgar acceso por business_members.
- /admin incluye restaurantes, menús, contactos de repas y atención inicial de pedidos. Sin apps para restaurantes/repas. WhatsApp manual, sin mensajes enviados ni asignación automática.
- Restaurantes aprobados se listan en portada y tienen /restaurantes/[slug]. Editor básico no gestiona fotos/opciones/mapas. Guardar negocio cierra recepción en esta etapa.
- Migración 202610010001_operator_console.sql aplicada remotamente; escrituras restringidas a administrador, lecturas sensibles RLS ajustadas. Prueba SQL con rollback: CRUD administrador, rechazo de duplicados, rechazo de usuario ajeno y RLS; cuatro resultados PASS. Sin fixtures persistentes.
- Compilación y 10 pruebas HTTP superadas; panel autenticado comprobado localmente. Publicación pendiente de verificar al cerrar esta sesión.
- Guía vigente docs/HOW-TO-GUIDE.md. Carrito superior con contador/animación y teléfono nacional de 10 dígitos incluidos.
- Recepción sigue cerrada. Siguiente objetivo: completar listo/entrega/cierre para recogida; domicilio necesita además cotización, aceptación, vencimiento y asignación. No abrir sólo cambiando accepting_orders.
- Dominio propio aplazado. Google continúa sujeto a configuración de usuarios de prueba. No crear cuentas de restaurantes/repas.

---

# Ajuste de carrito y telefono - 1 octubre 2026

- Boton de carrito fijo arriba a la derecha, contador por unidades, animacion al agregar respetando movimiento reducido, panel lateral modal accesible.
- Telefono nacional de 10 digitos; validacion en cliente y servidor; +52 agregado en submitOrder.
- Compilacion y cinco pruebas HTTP correctas; agregado, contador, panel y total comprobados en navegador local.
- Recepcion permanece cerrada: el usuario pide habilitar y conocer requisitos. Faltan listo, entrega validada y cierre; domicilio requiere cotizacion, vencimiento y asignacion.

---

# Estado vigente: publicado y guia operativa - 1 octubre 2026

Prevalece sobre los antecedentes locales siguientes.
- Git inicializado en la carpeta principal Desktop/FUDIGPT/fudiBOX; origin https://github.com/MiguelEnriquePortilla/fudiBOX.git. Primer commit main: 82dc1e0. .env.local excluido.
- Vercel: proyecto fudibox del equipo development-d767d622, main, primer despliegue Ready Production. URL https://fudibox.vercel.app.
- Variables publicas de Supabase configuradas en Production por Miguel. Preview no configurado en esta sesion.
- Supabase Site URL cambiado a https://fudibox.vercel.app; allowlist agrega /auth/callback de produccion y conserva localhost.
- Miguel verifico con capturas: Google retorna a /cuenta con sesion verificada, acceso al panel, 45 productos, menu y carrito con arroz blanco/adobo 3 chiles, $209 + $10 = $219.
- Dominio propio aplazado por el usuario; no continuar compra. La URL Vercel sirve para demostraciones.
- Creada docs/HOW-TO-GUIDE.md: manual para cliente, restaurante, repa, coordinacion y desarrollador; estados reales, altas, requisitos y guion del piloto.
- No hay pantalla de alta de repas/restaurantes. drivers es contacto sin user_id. Catalogo y panel hardcodean chicken-chicanito; otra fila de negocio no basta.
- Recepcion sigue cerrada. No se implementaron cotizacion, vencimiento, asignacion, listo, codigos, cierre ni liquidacion por crear esta guia.
- Siguiente trabajo: completar recorrido operativo y criterios de la seccion 9 del manual. Definir participantes, coordinador, cobertura y telefonos por canal privado; no guardar datos personales de altas en docs.

---

# Estado vigente · catálogo y panel Chicanito · 30 septiembre 2026

Este apartado sustituye los pendientes de catálogo y acceso al negocio de los antecedentes.

## Hecho y verificado
- Carpeta principal: C:/Users/hp/Desktop/FUDIGPT/fudiBOX. Documents/ChatGPT/fudiBOX es histórica; no crear otra implementación.
- Catálogo real de https://www.chicanito.app/index.html: 45 productos/presentaciones con precios, categorías y opciones obligatorias. Fuente en docs/chicanito-catalog-source.json. No se incluyó promoción temporal de septiembre. Revisar las presentaciones de piezas sueltas que la fuente describe como 250 gr antes de abrir.
- Ubicación facilitada por Miguel: https://maps.app.goo.gl/vz6g8F3RYmvM7dDg7. Mercado Benito Juárez, Centro, 62900 Jojutla, Morelos. Coordenadas 18.6145149,-99.1782915.
- Miguel autorizó expresamente miguel.e.portilla@gmail.com para administrar Chicken Chicanito. Membresía owner activa en fudi_private.business_members; no se concedió admin global.
- /chicanito: menú real, opciones, carrito con variantes y persistencia de sesión; cálculo de servicio $10 una vez, retiro o entrega. Aún no permite enviar porque accepting_orders=false.
- /negocio: acceso real por membresía; pedidos, confirmación/cancelación pendientes y disponibilidad. Verificado en navegador con la cuenta de Miguel y 45 productos.
- /cuenta: pedidos propios, detalle de opciones, cancelación inicial y enlace al panel cuando corresponde.
- Migraciones 202609300001_chicanito_catalog.sql y 202609300002_order_transactions.sql APLICADAS a aybgfwjbnsqbfnzmztmx. No repetir la inicial.
- RPC create_customer_order valida identidad, negocio abierto, precios/opciones del servidor, disponibilidad, inventario, idempotencia y reserva atómica. confirm_business_order y cancel_pending_order comprueban membresía/propiedad y liberan reserva una sola vez. my_businesses y set_product_availability limitados por membresía.
- 12 pruebas SQL transaccionales superadas con rollback: identidad, cierre, precios, opciones, repetición, inventario, acceso ajeno, cancelación, confirmación, RLS y bloqueo de escrituras directas. Guion en tests/order-transactions.sql; no ejecutar como operación real.
- Build Next.js/TypeScript correcto. Cinco pruebas HTTP de autenticación superadas tras los cambios.
- Navegador: opciones obligatorias bloquean agregar hasta completarlas; dos variantes del pollo con arroz conservadas tras recarga, subtotal $418 + servicio $10 = $428. Carrito de prueba vaciado. No se crearon pedidos operativos.
- Recepción CERRADA y sin despliegue. Servidor local en http://localhost:3000; usar run-fudibox.ps1 start si termina.

## Siguiente punto pendiente
Completar el flujo transaccional y sus pantallas antes de activar pedidos:
1. Cotización por coordinador, aceptación del cliente con vencimiento de 10 minutos y liberación de reservas al expirar.
2. Preparación, asignación manual de repartidor (un pedido activo), códigos de recogida/entrega, finalización y cargo único de servicio; recorrido de retiro en negocio.
3. Definir con Miguel cuenta/teléfono del coordinador y cobertura, sin inventarlos ni convertir el pedido en WhatsApp.
4. Pruebas concurrentes y recorrido completo cliente/negocio/coordinador/repartidor. No basta con las 12 pruebas seriales existentes.
5. Verificar cierre de sesión y renovación tras expiración; Google sigue Testing. Confirmar presentaciones y horario (fuentes discrepan) antes de apertura.
Mantener accepting_orders=false mientras falte el recorrido completo. No afirmar que ya pueden recibir pedidos reales.

## Decisiones vigentes
Pedidos dentro de fudiBOX. WhatsApp solo coordinación auxiliar. Efectivo al recibir/recoger, un negocio por pedido, servicio $10 una sola vez. En entrega, el negocio confirma disponibilidad sin preparar hasta que el cliente acepte envío; retiro no requiere coordinador.

---

# Verificación vigente · Google funcionando · 29 septiembre 2026

Este estado sustituye el pendiente de login de los apartados históricos de abajo.

- Primer intento real falló en Supabase con invalid_client, confirmado mediante Auth logs. No fue una prueba exitosa.
- Miguel creó un nuevo secreto en el cliente Google existente y lo pegó/guardó en Supabase. No se recopiló ni almacenó su valor en el proyecto o chat.
- Segundo intento: Miguel autorizó nombre/foto/correo en Google; retorno confirmado a http://localhost:3000/cuenta.
- La página mostró el nombre y correo de Miguel, “Sesión verificada” y “Aún no tienes pedidos”, sin error de consulta.
- Se recargó /cuenta y se mantuvo la identidad verificada. Esto valida login real y persistencia inmediata; no prueba todavía renovación tras expiración ni cierre de sesión.
- No se crearon pedidos ni se concedieron roles de negocio/coordinación/admin. No hay despliegue.
- Servidor local de esta sesión sigue en localhost:3000. Si se detiene, usar run-fudibox.ps1 start desde esta carpeta.
- No se revocó el secreto Google anterior; no asumir que el nuevo reemplazó/eliminó el anterior en Google.
- Diagnóstico MCP: advisories informativos de RLS sin políticas en las cinco tablas privadas (bloqueo deliberado) e índices pendientes/sin uso. No se alteró esquema por ello.
  Referencias: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy y https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

## Siguiente paso
Verificar cierre de sesión y renovación; después perfiles, permisos por rol y funciones transaccionales de pedidos con pruebas de aislamiento/concurrencia. Catálogo, ubicación/cobertura y teléfonos reales siguen pendientes.
La app continúa como acceso local de prueba y no admite pedidos operativos.

---

# Estado vigente · acceso Google local · 29 septiembre 2026

Este apartado prevalece sobre los cierres anteriores, conservados debajo como antecedentes.

## Avance de esta sesión
- Trabajo en C:/Users/hp/Desktop/FUDIGPT/fudiBOX, sin crear una segunda app en Documents.
- Se revisaron las consolas autenticadas por navegador. Supabase MCP no expone configuración de Auth.
- Miguel introdujo el secreto de Google en Supabase. Se corrigió Client IDs con el cliente real ya existente. Google habilitado, Skip nonce checks y Allow users without an email apagados, verificado tras guardar.
- Callback de Google guardado y reabierto para comprobar persistencia: https://aybgfwjbnsqbfnzmztmx.supabase.co/auth/v1/callback.
- Miguel autorizó su cuenta para la prueba; miguel.e.portilla@gmail.com aparece en Test users. Google sigue Testing/External. Publicación no solicitada.
- Retorno http://localhost:3000/auth/callback agregado a Supabase y verificado en la lista. Site URL ya era http://localhost:3000.
- Base Next.js 16.3.7, React 19.3.0, TypeScript y Supabase SSR creada en src/. Portada y acceso conservan marca aprobada.
- OAuth PKCE, callback servidor, sesión por cookies, renovación, cuenta con getUser, pedidos propios mediante RLS y cierre de sesión local.
- No se habilitaron escrituras de pedidos, no se alteró el esquema, no se repitió migración inicial.
- No hay roles reales de negocio/coordinación/admin en la interfaz nueva. No se asignó ningún privilegio. user_metadata se usa solo como nombre visible.
- Prototipo original intacto: index.html/app.js/estilos siguen siendo demo independiente.
- npm instalado temporalmente para dependencias; package-lock.json guardado. Instalación reportó cero vulnerabilidades.
- Compilación y TypeScript correctos; cinco pruebas HTTP de autenticación pasaron. Se corrigió codificación UTF-8 de los textos tras la primera revisión visual.
- Servidor de producción local escuchando solo en 127.0.0.1:3000. Abrir por http://localhost:3000/acceso para el flujo OAuth.
- Runtime Node: C:/Users/hp/AppData/Local/Programs/Python312/Lib/site-packages/playwright/driver/node.exe. Reinicio mediante run-fudibox.ps1 start, previa compilación si hay cambios.
- No se desplegó ni contrató nada; no se guardaron secretos en documentación.

## Punto exacto pendiente
Probar el inicio de sesión Google completo con Miguel desde la app local.
Todavía no afirmar que el secreto es válido, que el intercambio final funciona o que existe una sesión real de cliente.
Después: verificar /cuenta, persistencia tras recargar y cierre de sesión. Conservar esta evidencia y actualizar este apartado.
Seguir con catálogo real, perfiles y permisos por rol, RPC transaccionales, idempotencia y pruebas de aislamiento/concurrencia antes de piloto.
Ver docs/ACCESO-GOOGLE.md y README.md para instrucciones.

---

﻿# Handoff actual · FudiBOX
Cierre actualizado por petición de Miguel: 29 de septiembre de 2026, después de verificar MCP en un chat nuevo.

## Cierre vigente: Google OAuth y Supabase MCP — 29 septiembre 2026, noche

Este apartado sustituye los pendientes anteriores sobre elegir método de acceso o crear el cliente Google. El resto del documento conserva los acuerdos de producto. Esta sesión es de fudiBOX, NO de FUDIGPT MCP. La invocación inicial de fudipt llevó al proyecto equivocado; Miguel lo corrigió expresamente. No usar esa skill para retomar fudiBOX.

### Carpeta y orden de lectura
1. Raíz vigente: C:/Users/hp/Desktop/FUDIGPT/fudiBOX.
2. Leer este HANDOFF_ACTUAL.md completo, luego ../PLAN.md, ../docs/IDENTIDAD.md, ../docs/VOZ-DE-MARCA.md y ../supabase/README.md. docs/arquitectura.md es referencia; si describe una fase previa, prevalece este estado comprobado.
3. C:/Users/hp/Documents/ChatGPT/fudiBOX es staging/histórico y carpeta del chat. Tiene una referencia al proyecto principal; NO reconstruir ni desarrollar otra copia allí.
4. Desktop/fudiBOX no contiene .git al verificar este cierre. Documents/fudiBOX sí contiene .git; no atribuir su historial a la carpeta Desktop ni inicializar/migrar Git como parte de este cierre.
5. Los cierres previos se conservan en CONTINUIDAD/sesiones. Este cierre no cambia app.js, HTML, CSS, assets ni migraciones.

### Decisiones confirmadas y modo de trabajo
- Miguel eligió B: iniciar sesión con Google. No repetir la pregunta correo/Google/SMS.
- Arquitectura vigente Vercel + Supabase; futura app Next.js/TypeScript. No hay despliegue ni aplicación conectada todavía.
- Miguel pidió conectar el MCP para trabajar directamente desde Codex, evitando copiar instrucciones y valores manualmente cuando las herramientas permitan hacerlo.
- Preferencia: español sencillo, una pregunta de opción múltiple a la vez cuando haga falta una decisión. En formularios, señalar exactamente pestaña, campo, dónde obtener el valor y dónde pegarlo. No dar listas largas de pasos desconocidos ni pedir confirmaciones repetidas para tareas autorizadas.
- Avanzar con herramientas sobre lo autorizado; si falta una capacidad real, explicar el límite y guiar un paso concreto. No prometer que MCP puede configurar OAuth sin inspeccionar sus herramientas.
- No pedir secretos en el chat o capturas. No guardar Client Secret, tokens OAuth, contraseñas ni service_role en README, Git o frontend.

### Google Cloud: lo realizado y evidencia
- Proyecto creado por Miguel mediante navegador: nombre fudiBOX, ID fudibox, número 752337621958, No organization. Captura del dashboard confirmó creación y selección. No tocar Carrizo-Cobranza ni carrizo-ventas.
- Consola: https://console.cloud.google.com/auth/overview?project=fudibox
- Se completó el asistente Google Auth Platform y apareció OAuth configuration created.
- Se indicó nombre visible fudiBOX, correo de soporte elegido por Miguel, audiencia External. No se transcribió el correo; no inventarlo. Modo inicial de pruebas; no se verificó publicación ni lista de usuarios de prueba.
- Se creó un cliente OAuth tipo Web application. Primero figuró Web client 1; Miguel lo renombró fudiBOX y la captura mostró OAuth client saved.
- Clientes: https://console.cloud.google.com/auth/clients?project=fudibox
- Redirect URI indicado para ese cliente: https://aybgfwjbnsqbfnzmztmx.supabase.co/auth/v1/callback
- Se indicó dejar Authorized JavaScript origins vacío por ahora. La pantalla de lista acredita la existencia del cliente, NO verifica sus redirect URIs guardados; revisar ese detalle antes de probar acceso.
- El Client ID completo y Client Secret NO se recopilaron en esta conversación ni se guardan aquí. Obtenerlos desde el cliente ya creado; no crear otro por defecto. Si el secreto no puede recuperarse en la consola, revisar el archivo descargado por el usuario o la opción de generar uno nuevo, sin imprimir secretos.

### Supabase Auth: punto interrumpido
- Se abrió Authentication → Sign In / Providers → Google:
  https://supabase.com/dashboard/project/aybgfwjbnsqbfnzmztmx/auth/providers?provider=Google
- La última captura del formulario mostraba Enable Sign in with Google APAGADO, Client IDs con texto incorrecto "MiguelEnriquePortilla's Project" y Client Secret enmascarado. No se sabe qué contenía ese secreto; no asumir que era válido o que el formulario se guardó.
- Se explicó reemplazar Client IDs por el ID real terminado en .apps.googleusercontent.com, introducir el secreto correspondiente y dejar Skip nonce checks y Allow users without an email apagados.
- Miguel señaló que faltaba explicar de dónde obtener esos valores. Se le indicó abrir el cliente fudiBOX en Google Cloud y copiar Client ID. Antes de confirmar el pegado, pidió cambiar al MCP.
- NO hay confirmación de que Google esté habilitado correctamente en Supabase. NO hay login real probado ni sesión de cliente de fudiBOX. La autorización MCP siguiente es una conexión administrativa distinta, no el login de clientes.

### Supabase MCP: configurado, autenticado y probado
- Servidor local de Codex: supabase; transporte streamable_http; enabled=true.
- URL guardada:
  https://mcp.supabase.com/mcp?project_ref=aybgfwjbnsqbfnzmztmx&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching
- Se ejecutó codex mcp add supabase con esa URL entre comillas. Inició automáticamente OAuth. Miguel autorizó y el proceso finalizó exit 0 con Successfully logged in.
- codex mcp list mostró enabled / OAuth; codex mcp get supabase confirmó project_ref correcto. No usa bearer_token_env_var ni headers manuales.
- El flujo de autorización solicitó permisos administrativos amplios; project_ref limita el servidor al proyecto, no debe interpretarse como prueba de que la credencial OAuth solo puede acceder a ese proyecto. Mantener operaciones del trabajo dentro de fudiBOX.
- El chat original no recibió las herramientas tras la instalación; devolvió unknown MCP server 'supabase'. Reiniciar/reabrir este mismo chat no resolvió la disponibilidad. Un CHAT NUEVO sí las cargó. No reinstalar ni reautorizar por defecto.
- Chat de comprobación: "Lista las tablas de Supabase", ID 01a0f05a-0d87-7340-88b4-a788d75263ff. Se leyó su historial durante este cierre. Ejecutó get_project_url y list_tables(schemas=[], verbose=false), ambos completados. Informó acceso correcto y ninguna modificación de datos/estructura.
- Tablas public enumeradas: profiles, businesses, products, drivers, orders, order_items, inventory_reservations, ledger_entries, settlements (9).
- Tablas fudi_private: admins, business_members, coordinators, delivery_codes, order_events (5).
- El otro chat informó RLS activo en public y fudi_private. No es una prueba de aislamiento efectivo, RPC o concurrencia. El detalle crudo de respuesta no estuvo visible al leer ese chat; se preserva la atribución al informe.
- Inconsistencia del resumen del otro chat: encabezado 53 tablas, public=10 con corrección escrita a 9; demás cantidades auth=27, storage=8, realtime=3, vault=1. Estas cantidades con public=9 suman 53. No presentar public=10 ni afirmar auditoría exhaustiva de tablas internas a partir de esa tabla; recontar metadatos si es necesario.
- No consultar filas de auth, vault o secretos para verificar conectividad; bastan metadatos de tablas del proyecto. No volver a ejecutar la migración inicial no idempotente.
- No se instaló el paso opcional npx skills add supabase/agent-skills. No hace falta para demostrar que el MCP funciona.
- No guardar/copiar la URL temporal de autorización, códigos PKCE ni tokens. La sesión MCP quedó guardada por Codex, fuera del proyecto.

### Secuencia exacta para continuar en el chat nuevo
1. Leer este archivo desde Desktop/fudiBOX; confirmar que las herramientas Supabase están disponibles y que get_project_url corresponde a aybgfwjbnsqbfnzmztmx. Ya existe evidencia de conectividad: no hacer de nuevo todo el onboarding.
2. Inspeccionar capacidades del MCP para consultar/configurar proveedores Auth. Si no las expone, usar el formulario Supabase ya identificado; no confundir execute_sql o acceso a tablas con capacidad de configurar Google Auth. No inventar una herramienta de configuración.
3. Revisar cliente Google fudiBOX existente y callback. Completar Client ID/Client Secret en Supabase mediante canal seguro; si depende de Miguel, guiar una acción a la vez. No usar el nombre del proyecto como Client ID.
4. Verificar guardado y habilitación del proveedor Google. Confirmar audiencia/usuarios de prueba en Google. Definir las URLs de retorno de la app cuando exista su dirección local/desplegada; no inventar un dominio Vercel.
5. Implementar la base Next.js/TypeScript manteniendo identidad y recorrido aprobados; clientes Supabase y callback de sesión, permisos reales por cliente/negocio/coordinador/admin. El selector de rol del prototipo es demo, nunca fuente de autorización.
6. Probar un acceso Google completo antes de afirmar integración terminada. La autorización administrativa MCP no sustituye esta prueba.
7. Continuar funciones transaccionales de pedidos/reservas/totales, idempotencia, vencimientos y códigos; probar permisos entre usuarios y concurrencia antes del piloto o publicación.
8. Completar catálogo/precios, ubicación/cobertura y teléfonos reales. No publicar ni contratar planes por este cierre documental.

### Referencias de conversación y documentación
- Diseño/prototipo y primer cierre: chat 01a0d4ff-5df3-7dc1-9241-69a0b7c985b3, título mostrado "quiero crear una app de pedidos estilo didi o rappi o ubere…".
- Google/MCP y este cierre: chat 01a0eeb6-5bc6-72c3-9ddb-ddad6465bb74; su título antiguo "Retoma el proyecto FUDIGPT MCP" es engañoso y NO identifica el proyecto real.
- Comprobación MCP: chat 01a0f05a-0d87-7340-88b4-a788d75263ff, "Lista las tablas de Supabase".
- Guía consultada: https://supabase.com/docs/guides/auth/social-login/auth-google
- Guía de registro MCP consultada: https://developers.openai.com/learn/docs-mcp
- Este documento conserva hechos/decisiones de la conversación; los chats son fuente para recuperar el detalle literal. No se exportaron secretos ni transcripciones indiscriminadas.

### Validación y procesos al cierre
- Esta sesión verificó la configuración/autorización MCP por CLI; la consulta remota ocurrió en el chat nuevo mencionado arriba.
- No se ejecutaron nuevamente tests del prototipo, no hubo migraciones nuevas, ni cambios funcionales, publicación o commits en este cierre.
- El proceso interactivo OAuth terminó correctamente; no se inició servidor local de aplicación ni trabajo programado en esta sesión. No se auditó todo proceso del sistema.
- Las pruebas históricas de workflow y responsividad se conservan abajo, pero NO se repitieron en esta sesión.

## Base de producto preservada — leer también

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
Consultar la secuencia del cierre Google/MCP al inicio de este archivo. Google ya fue elegido y el cliente creado; falta verificar y completar el proveedor en Supabase y el login de la app.

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
Método de acceso elegido: cuenta de Google. Configuración e integración pendientes. No se contrató ningún plan de pago en esta sesión.



