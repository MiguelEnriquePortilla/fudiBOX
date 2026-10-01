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

