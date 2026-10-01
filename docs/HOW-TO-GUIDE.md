# fudiBOX · Guía de uso, administración y pruebas
Actualizada: 1 de octubre de 2026. Responsable: Miguel. Estado: sitio publicado; recepción de pedidos cerrada.

Esta guía es el punto de consulta del proyecto para clientes, restaurante, repartidores, coordinación y desarrollo. “Disponible” significa que existe en la aplicación actual; “pendiente” describe trabajo por construir, no instrucciones para buscar un botón inexistente.

## 1. Empieza aquí
- Sitio publicado: https://fudibox.vercel.app
- Menú: https://fudibox.vercel.app/chicanito
- Cuenta: https://fudibox.vercel.app/cuenta
- Restaurante: https://fudibox.vercel.app/negocio
- Código: https://github.com/MiguelEnriquePortilla/fudiBOX
- El dominio propio está aplazado. No impide mostrar el sitio ni preparar las pruebas.
- Los pedidos se harán dentro de fudiBOX. WhatsApp será apoyo de coordinación, no el registro oficial del pedido.
- Publicado en Vercel no significa que el recorrido operativo esté terminado.

## 2. Qué está listo y qué falta
| Función | Estado actual |
| --- | --- |
| Sitio público, menú y carrito | Publicados; probados por Miguel |
| Google y regreso a /cuenta | Probado en producción con Miguel |
| Acceso de Miguel al restaurante | Probado en producción |
| 45 productos/presentaciones, precios y opciones | Cargados |
| Agregar opciones y calcular productos + $10 | Probado: pollo con arroz $209 + $10 = $219 |
| Marcar disponible/agotado | Implementado para miembros del negocio |
| Crear solicitud, reservar, confirmar y cancelar inicialmente | Implementado en servidor y pantallas; recepción cerrada; probado mediante SQL con rollback |
| Enviar un pedido completo en producción | No probado ni habilitado |
| Registrar/editar repartidores desde una pantalla | Pendiente |
| Dar de alta restaurantes y editar precios/menús desde una pantalla | Pendiente |
| Panel de coordinación y cotización del envío | Pendiente |
| Aceptar envío y vencer cotización a los 10 minutos | Pendiente |
| Pedido listo, asignación, códigos y cierre | Pendiente, también para retiro |
| Avisos automáticos, seguimiento en vivo y notificaciones con web cerrada | No implementados |
| Panel de administración y liquidaciones | Pendiente |
| Dominio propio | Opcional para el piloto; compra aplazada |

La estructura de algunas funciones existe en Supabase, pero eso no equivale a un flujo utilizable. No abrir la recepción cambiando únicamente accepting_orders.

## 3. Preguntas rápidas
**¿Dónde agrego teléfonos de los repas?** Hoy no hay un formulario. La estructura está en public.drivers, con nombre, teléfono, negocio opcional, indicador de compartido y aprobación. El alta actual requiere intervención técnica controlada. Esta guía no registra ni aprueba a nadie.

**¿Poner su teléfono le permite entrar?** No. drivers todavía no tiene vínculo con auth.users ni un panel para repartidor. Un contacto operativo no equivale a una cuenta con permisos. Antes de ofrecer acceso al repa, hay que implementar y probar esa relación y sus permisos.

**¿Dónde agrego otro restaurante?** No hay formulario todavía. Supabase tiene businesses, products y business_members, pero las páginas actuales buscan específicamente chicken-chicanito. Hay que generalizar las rutas y el panel además de cargar datos.

**¿Puedo cambiar precios en /negocio?** Todavía no. El panel cambia disponibilidad; no edita precios, nombres, fotos ni opciones.

**¿El teléfono del cliente lo registra como repa?** No; solo es contacto del pedido.

**¿Mi acceso de restaurante también es administrador global?** No. Miguel tiene membresía del restaurante; no se concedió por ello acceso global.

**¿Al pulsar “Disponible” abro el negocio?** No. Disponibilidad de producto y recepción del negocio son controles distintos.

**¿Hay cobros con tarjeta?** No. El modelo previsto es efectivo al recibir o recoger. El carrito muestra importes; no realiza un cargo bancario.

**¿Ya se cobran/liquidan automáticamente los $10?** No. Se muestran y se guardan como tarifa del pedido; falta el cierre que registre el adeudo único por pedido completado y su operación de liquidación.

**¿Puedo invitar a cualquiera a entrar con Google?** El último estado confirmado de Google es Testing, con Miguel como usuario de prueba. Revisar la configuración de audiencia y agregar las cuentas del piloto antes de invitarlas; no prometer acceso general.

**¿Veré pedidos nuevos sin recargar?** No hay actualización en vivo implementada. Durante las pruebas de pantallas, recargar para consultar el estado vigente.

## 4. Cliente
### Hoy: conocer el menú y probar el carrito
1. Abrir /chicanito.
2. Elegir un producto; completar arroz, adobo u otras opciones obligatorias.
3. Elegir cantidad y agregar.
4. Revisar producto, opciones, subtotal y servicio. El cargo de $10 aparece una vez por pedido.
5. Elegir recoger o domicilio para revisar el formulario. Para domicilio, el envío aún requiere cotización.
6. Iniciar sesión desde /acceso para consultar /cuenta.
7. No esperar confirmación del restaurante: mientras siga cerrado, el carrito no envía pedidos.

El carrito se conserva en la sesión de esa pestaña; no es un pedido guardado en el servidor ni se sincroniza entre dispositivos. Nombre, teléfono y notas no se conservan junto al carrito.

### Flujo objetivo para pedidos a domicilio — pendiente de completar
Solicitud → restaurante confirma disponibilidad → coordinador cotiza envío → cliente acepta antes de 10 minutos → preparación → recogida por repa → entrega validada → cierre.
Antes de aceptar envío, el cliente debe conocer el total: productos + $10 + envío.
Confirmar disponibilidad no autoriza a preparar un pedido a domicilio.

### Retiro en el restaurante — pendiente de completar
Solicitud → confirmación y preparación → listo → validación de recogida → cierre.
No requiere repa ni coordinador; envío $0. También faltan pasos de listo, validación y cierre: hoy no es una alternativa operativa terminada.

### Cancelación
La función actual permite al cliente propietario o al miembro del restaurante cancelar estados requested, awaiting_quote y quoted, liberando reservas una vez. No cancela desde preparing. Si el pedido ya está en preparación, la aplicación indica contactar al negocio; falta definir e implementar resolución de incidencias posteriores.

## 5. Restaurante
### Acceso y disponibilidad
1. Entrar con la cuenta Google autorizada.
2. Desde /cuenta, abrir el panel del restaurante.
3. Revisar el catálogo y marcar agotado solo cuando corresponda.
4. Para reactivar, usar “Agotado · habilitar”.
5. Recargar el menú como cliente y comprobar disponibilidad.

Un miembro del restaurante puede seguir viendo sus agotados; un visitante puede no verlos. No confundir esa diferencia con un fallo. Agotar un producto no cancela pedidos reservados.

### Atención de solicitudes — implementada, aún cerrada al público
- Revisar productos, opciones, contacto, método y notas.
- Confirmar disponibilidad e indicar minutos de preparación.
- Retiro pasa a preparación; domicilio espera cotización.
- No comenzar un domicilio antes de la aceptación del envío.
- Si no puede atenderse, cancelar mientras el estado lo permita.
- Los siguientes pasos de listo y cierre todavía no están disponibles.
- El panel consulta los últimos 50 pedidos; no es aún un historial completo con búsqueda.

### Inventario
Disponible/agotado no es un contador de piezas. El catálogo importado no activa control de stock. La reserva por cantidad existe para productos con track_stock; falta definir unidades y operación antes de usarla, especialmente si varios paquetes consumen el mismo pollo. No asumir que se descuenta inventario compartido entre paquetes.

## 6. Repartidor
Hoy no hay panel, registro autónomo ni asignación funcional. No enviar a un repa a realizar una entrega basándose en esta versión.

Ficha de alta propuesta, a entregar por un canal privado al responsable:
- Nombre operativo.
- Teléfono con código de país.
- Restaurante al que pertenece, o indicación de compartido.
- Zona y horario disponibles (datos operativos por definir; no todos tienen campos hoy).
- Si tendrá cuenta propia, correo de acceso; el vínculo de cuenta aún debe desarrollarse.
- Persona que verifica los datos y autoriza la participación.

No guardar teléfonos reales de personas en este manual, issues ni commits.
La estructura actual puede almacenar varios registros de contacto, pero no valida por sí sola su identidad ni evita duplicados por teléfono. Antes de un alta técnica, revisar duplicados y asociación; approved no sustituye un recorrido completo.

Flujo previsto: recibir asignación manual → recoger → entregar al cliente → validar código → quedar libre. Hay una restricción de un pedido activo por repa en la base; falta la función de asignación y la pantalla que la utilice.

## 7. Coordinación
Hoy no existe panel de coordinación ni función para cotizar.
La estructura fudi_private.coordinators contempla dos posiciones: principal y respaldo, cada una con cuenta, teléfono y estado activo.
Para solicitar domicilio, el servidor ya exige un principal activo; activar uno no implementa la cotización que falta.

Antes del piloto, Miguel debe definir:
- Cuenta y teléfono del coordinador principal; respaldo si aplica.
- Cobertura y criterio de tarifa de envío.
- Quién asignará los repartidores y qué horarios cubrirá.
- Qué hacer si el negocio, cliente o repa deja de responder.
- Quién recibe el efectivo y cómo se reconcilian productos, envío y servicio.

Responsabilidades previstas: cotizar, coordinar repa, controlar incidencias y validar entrega sin obtener el código privado del cliente por consultas administrativas. La cotización debe vencer con reloj del servidor y liberar reservas incluso con la web cerrada.

## 8. Miguel: incorporar personas y restaurantes
### Agregar un repa ahora
1. Reunir la ficha privada de la sección 6 y verificar el teléfono.
2. Solicitar el alta técnica indicando si es propio o compartido.
3. Revisar si ya existe; registrar asociación y aprobación solo con autorización.
4. Verificar lectura por roles y que clientes ajenos no puedan consultar contactos.
5. Esperar al flujo de asignación/cierre antes de usarlo en una entrega.
Esto es un procedimiento de preparación; no hay botón “Agregar repa” en la web actual.

### Agregar otro restaurante
1. Confirmar nombre, sucursal, dirección, punto en mapa, contacto y responsable.
2. Reunir menú autorizado: precios, fotos, presentaciones, opciones, agotados y horarios.
3. Hacer que el responsable inicie sesión con una cuenta autorizada para el piloto.
4. Implementar rutas por restaurante, listado y selector de negocio para personas con varias membresías.
5. Registrar negocio inicialmente cerrado, productos y membresía owner/staff ligada a su cuenta real.
6. Probar que cada restaurante solo pueda operar sus propios productos y pedidos.
7. Verificar catálogo, costos, disponibilidad y flujo completo antes de aprobar apertura.
Agregar una fila en businesses no hace aparecer automáticamente un restaurante nuevo en la portada o el panel actual.

### Dar acceso a personal de Chicanito
Se requiere una cuenta real y membresía activa en fudi_private.business_members del negocio correcto. No compartir la cuenta de Miguel ni dar administración global para resolver acceso de restaurante. No hay pantalla de invitaciones todavía.

## 9. Qué necesitamos para iniciar pruebas
### A. Pruebas de demostración — disponibles ahora
- [x] Sitio público en Vercel.
- [x] Google de Miguel regresa a producción.
- [x] Panel de Chicanito y menú cargan.
- [x] Opciones del carrito y total $219 comprobados por Miguel.
- [ ] Recargar carrito en producción y comprobar persistencia.
- [ ] Cerrar sesión, comprobar protección del panel y volver a entrar.
- [ ] Revisar en teléfono móvil.
- [ ] Probar disponibilidad y restaurarla usando un producto acordado.
Estas pruebas no requieren comprar dominio ni abrir pedidos.

### B. Piloto con pedidos completos — bloqueado por implementación pendiente
- [ ] Completar listo, código de recogida y cierre para retiro.
- [ ] Completar cotización, aceptación y vencimiento automático para domicilio.
- [ ] Completar asignación, validación y cierre con repa.
- [ ] Registrar tarifa de servicio una vez al completar; probar reintentos.
- [ ] Definir cancelaciones e incidencias después de comenzar preparación.
- [ ] Implementar avisos o un procedimiento explícito de supervisión mientras no haya notificaciones.
- [ ] Verificar participantes, permisos, cobertura, teléfonos y horarios.
- [ ] Confirmar precios y presentaciones: la fuente rotula piezas sueltas como 250 gr; horarios de fuentes discrepan.
- [ ] Separar pruebas de operación: entorno/datos de prueba y forma de identificarlos. Hoy no existe campo de pedido de prueba.
- [ ] Probar concurrencia: última existencia, doble envío, doble confirmación/cierre y repa ocupado.
- [ ] Probar expiración con navegador cerrado y rechazos de acceso ajeno.
- [ ] Acordar responsable y momento de apertura; habilitar solo después de revisar resultados.

Orden recomendado de implementación: terminar retiro de punta a punta; después domicilio con coordinación y repa; después generalizar a otros restaurantes. Es una propuesta de desarrollo, no una reducción automática del alcance autorizado ni una apertura del retiro.

### C. Guion del primer pedido controlado — para cuando B esté terminado
1. Acordar participantes y avisar a cocina si habrá preparación real.
2. Registrar identificador, modalidad y resultado esperado sin publicar datos personales.
3. Cliente envía una sola solicitud; repetir el envío debe devolver el mismo pedido.
4. Restaurante verifica opciones y confirma.
5. En domicilio, coordinación cotiza y cliente acepta; probar por separado una cotización que vence.
6. Preparar y marcar listo; asignar repa si aplica.
7. Probar código incorrecto sin cerrar; validar código correcto y entregar.
8. Verificar estado final, reserva consumida, repa liberado y una sola tarifa.
9. Repetir cierre y comprobar que no se dupliquen efectos.
10. Documentar evidencia e incidencias. No borrar un pedido operativo para “limpiar” una prueba.

## 10. Desarrollo y publicación
### Fuentes de verdad
- Carpeta activa: C:/Users/hp/Desktop/FUDIGPT/fudiBOX.
- Documents/ChatGPT/fudiBOX es histórica: no mantener una segunda implementación.
- GitHub conserva código e historial. Vercel ejecuta la web. Supabase conserva identidad y datos.
- index.html/app.js originales son una demo histórica con localStorage: no son la app publicada.

### Cómo trabajar
1. Leer CONTINUIDAD/HANDOFF_ACTUAL.md y esta guía.
2. Crear una rama codex/nombre-del-cambio y mantener el alcance claro.
3. Implementar y probar localmente; revisar cambios y exclusión de secretos.
4. Compilar con npm run build; ejecutar npm test con servidor de pruebas encendido.
5. Revisar y llevar el cambio a main cuando esté listo para publicación.
6. En Vercel, comprobar estado Ready, commit y comportamiento publicado.
7. Actualizar guía/handoff cuando cambien pasos, permisos o disponibilidad.

El primer commit publicado fue 82dc1e0. El proyecto Vercel está conectado a main. Verificar cada despliegue; un push no es evidencia suficiente de publicación exitosa.
Solo se configuraron variables en Production durante esta sesión. Una Preview necesita configuración propia antes de probarse. No conectar cambios experimentales a datos operativos sin un plan de aislamiento.

### Configuración
Variables de la app: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Mantener valores de entorno fuera del repositorio; .env.example es plantilla.
No usar claves service_role ni secretos Google en el navegador.
Supabase Site URL: https://fudibox.vercel.app
Retornos autorizados confirmados:
- https://fudibox.vercel.app/auth/callback
- http://localhost:3000/auth/callback

El callback Google sigue siendo el endpoint de Supabase, no la página de cuenta de Vercel. Al cambiar dominio, revisar Site URL, allowlist y acceso real.
No se compró dominio propio en esta sesión.

### Base de datos y permisos
Las tres migraciones del repositorio ya fueron aplicadas. No ejecutarlas de nuevo:
- 202609290001_initial_schema.sql
- 202609300001_chicanito_catalog.sql
- 202609300002_order_transactions.sql

Publicar código no aplica migraciones automáticamente. Todo cambio de esquema debe estar versionado, probado y desplegado en orden compatible con la aplicación.
Operaciones actuales: my_businesses, set_product_availability, create_customer_order, confirm_business_order, cancel_pending_order.
No habilitar escrituras directas del navegador para saltarse una función faltante. RLS limita lecturas y las funciones validan identidad, estado y pertenencia.
Las altas técnicas actuales requieren acceso administrativo controlado; esta guía no incluye SQL listo para ejecutar contra producción con datos inventados.

### Pruebas y límites de evidencia
- Compilación y cinco pruebas HTTP: superadas localmente antes del primer despliegue.
- Doce pruebas SQL: superadas con rollback; no prueban concurrencia entre conexiones.
- Producción: Google, cuenta, panel, catálogo y carrito comprobados por Miguel mediante capturas del 1 de octubre.
- No se ha comprobado todavía pedido completo, expiración de sesión ni recuperación de incidencias en producción.
- tests/order-transactions.sql usa fixtures y rollback: ejecutar en un entorno de prueba revisado; no convertirlo en herramienta de operación.

## 11. Solución de dudas y fallos
| Síntoma | Qué revisar |
| --- | --- |
| Pedidos aún no habilitados | Es el cierre previsto; no es un fallo del carrito |
| Cuenta sin negocio | Cuenta correcta, primer login y membresía activa en el negocio |
| Google vuelve a localhost | Site URL, redirectTo de la app y allowlist del dominio |
| Google rechaza acceso | Audiencia/test users; revisar error antes de cambiar credenciales |
| Error al intercambiar código | Registros de Auth y configuración del proveedor; no compartir secretos por chat |
| Producto desaparece del menú | Disponibilidad, estado del negocio y rol que consulta |
| El menú cambió al solicitar | Recargar y aceptar precios actuales; no forzar el total anterior |
| No hay suficientes existencias | Stock del producto con seguimiento; no editar reservas manualmente |
| Un repa está registrado pero no entra | El contacto no tiene todavía identidad/panel de repartidor |
| Vercel no refleja un cambio | Rama/commit, estado del despliegue, variables del entorno y logs |
| Se ve una demo diferente | Usar la app Next.js publicada; no abrir index.html histórico |

Para reportar un problema: fecha/hora, ruta sin tokens, rol, pasos, resultado esperado/obtenido e identificador interno del pedido si existe. No adjuntar contraseñas, cookies, claves privadas o datos personales innecesarios.

## 12. Cómo mantener esta guía
Cada función nueva debe actualizar: estado, quién puede usarla, ruta, pasos, fallos esperados y prueba realizada. Mantener lo pendiente marcado hasta comprobarlo.
Referencias internas: [handoff](../CONTINUIDAD/HANDOFF_ACTUAL.md), [arquitectura](arquitectura.md), [fuente del catálogo](chicanito-catalog-source.json), [pruebas SQL](../tests/order-transactions.sql).
