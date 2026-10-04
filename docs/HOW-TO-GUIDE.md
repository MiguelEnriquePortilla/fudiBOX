# fudiBOX: guía de operación y pruebas

Actualizado: 4 de octubre de 2026.

## 1. Dos espacios, una operación

- Cliente: https://fudibox.vercel.app. Explora restaurantes, arma carrito y consulta sus pedidos. Su cuenta no muestra herramientas de operación.
- Equipo fudiBOX: https://fudibox.vercel.app/admin. Miguel administra restaurantes, menús, contactos de repas y pedidos. Requiere Google y autorización de administrador en servidor.
- Restaurantes y repas: no necesitan cuenta ni aplicación. La coordinación será por WhatsApp, a cargo del equipo fudiBOX.

Por ahora ambos espacios viven en el mismo dominio, con navegación separada. El dominio propio está aplazado; no hace falta comprarlo para probar. /negocio redirige al panel central. No se ha publicado una aplicación en tiendas móviles.

## 2. Entrar como administrador

Abre /admin e inicia sesión con la cuenta de Miguel autorizada. Una cuenta cliente no obtiene acceso por conocer el enlace. Si aparece acceso denegado, comprueba la cuenta seleccionada. Un futuro colaborador deberá recibir autorización individual; no compartas la sesión de Miguel. El alta de administradores aún se hace mediante una intervención técnica controlada, no desde el panel.

## 3. Agregar un restaurante

1. En el panel, entra a Restaurantes y abre Agregar restaurante.
2. Escribe nombre, identificador para su dirección web (por ejemplo tacos-centro) y dirección de recogida.
3. Guarda inicialmente sin mostrarlo en la tienda si todavía falta preparar su menú.
4. Carga sus productos en Menús y revisa /restaurantes/tacos-centro.
5. Marca la opción de mostrarlo en la tienda cuando esté listo para mostrarse.

Un restaurante visible aún puede tener la recepción cerrada. En esta etapa, guardar un restaurante mantiene o vuelve a cerrar su recepción. No hay interruptor de apertura hasta terminar el flujo operativo. Las imágenes, coordenadas y enlace de mapa requieren mantenimiento técnico por ahora; este formulario no los edita.

## 4. Agregar o editar productos

En Menús selecciona el restaurante. Puedes crear productos simples y editar nombre, descripción, categoría, precio en pesos y disponibilidad. Marca agotado para impedir nuevas solicitudes de ese producto. Esto no modifica pedidos ya reservados.

Las opciones e imágenes existentes de Chicanito se conservan al editar. Agregar grupos de opciones, cargar fotos o administrar inventario detallado todavía requiere mantenimiento técnico. Después de guardar, comprueba el restaurante seleccionado antes de seguir editando.

## 5. Agregar teléfonos de repas

En Repas abre Agregar repa. Captura nombre y teléfono mexicano de 10 dígitos, incluida la clave de ciudad. El sistema agrega +52. Relaciona el contacto con un restaurante o márcalo como compartido, según corresponda, y activa su aprobación cuando sus datos estén verificados.

Estos registros son contactos operativos, no cuentas de acceso. El enlace de WhatsApp abre una conversación; no envía mensajes automáticamente ni asigna pedidos. La asignación dentro del pedido sigue pendiente. No pegues teléfonos personales en GitHub, documentación o capturas públicas.

## 6. Qué puede probar hoy el cliente

Puede iniciar sesión con Google, ver el catálogo, elegir opciones y abrir el carrito desde la esquina superior derecha. El contador se actualiza al agregar productos. El teléfono se captura con 10 dígitos; no hace falta escribir el código del país.

Ejemplo Chicanito: pollo con arroz $209 + servicio fudiBOX $10 = $219 para recoger. El servicio se cobra una vez por pedido. El envío a domicilio no debe considerarse incluido en ese total.

La recepción sigue cerrada. Armar un carrito no equivale a enviar ni confirmar un pedido. Google todavía puede limitar el acceso a usuarios de prueba: dar de alta a los participantes autorizados antes del piloto.

## 7. Pedidos: disponible y pendiente

El panel central muestra los pedidos y sus datos, permite confirmar disponibilidad con tiempo estimado y cancelar en los estados iniciales permitidos. Actualiza la página para consultar cambios; no hay aviso automático de pedidos nuevos.

La base valida precios y opciones, reserva existencias cuando aplican y evita duplicar una solicitud por reintento. Esto no significa que todo el recorrido esté terminado.

Para habilitar pruebas completas faltan:

- Recoger: probar el recorrido integral. Marcar listo y cerrar con confirmación manual del administrador ya están implementados; la verificación por código no está implementada.
- Domicilio: cotizar envío, aceptar la cotización, vencer solicitudes sin respuesta, asignar repa, marcar listo, validar recogida/entrega y cerrar.
- Registrar y comprobar cobros y liquidaciones sin confundir producto, servicio y envío.

No abrir recepción cambiando solamente un valor en la base. Primero completar y comprobar el recorrido que se vaya a ofrecer. No hace falta tener 20 restaurantes o 50 pedidos diarios para comenzar un piloto controlado.

### Marcar listo para recoger

En Pedidos, cuando un pedido para recoger esté En preparación, confirma con el restaurante que está preparado y pulsa Marcar listo para recoger. El cliente verá Listo para recoger al consultar o recargar su cuenta. No se envía un aviso automático. Repetir la acción no duplica el registro. Marcar listo no registra entrega ni cobro. Cuando el restaurante confirme que el cliente recibió el pedido, marca la casilla de confirmación y pulsa Confirmar recogida y cerrar pedido. El cliente verá Entregado al recargar. Esta es una validación manual, sin código. Se registra fecha, administrador y un cargo de servicio de $10 por única vez. Las existencias reservadas quedan consumidas sin descontarlas otra vez. No se registra una liquidación del restaurante ni se certifica que el cliente pagó.

## 8. Primer piloto controlado

1. Terminar el recorrido elegido y sus pruebas de permisos, cancelación y cierre.
2. Acordar con Chicanito horario, existencias, responsable y forma de confirmar preparación.
3. Definir quién coordina, qué repa participa, cobertura y costo si hay domicilio.
4. Incorporar las cuentas de prueba necesarias y comprobar acceso desde teléfonos reales.
5. Abrir sólo el negocio y modalidad probados. Crear un pedido identificado como prueba y seguirlo hasta su cierre, incluyendo lo que ve el cliente.
6. Comprobar que el total, la entrega y el registro final coinciden. Si falla, cerrar recepción y corregir antes de invitar clientes.

Restaurante: confirma existencias, tiempo y entrega al coordinador. Repa: recibe indicaciones por WhatsApp y comunica recogida/entrega. Equipo fudiBOX: mantiene la información del pedido. Nunca usar un mensaje de WhatsApp como sustituto de un registro de estado pendiente de implementar.

## 9. Mantenimiento para Miguel y desarrolladores

Repositorio: https://github.com/MiguelEnriquePortilla/fudiBOX. Proyecto principal local: C:/Users/hp/Desktop/FUDIGPT/fudiBOX. Documents/ChatGPT/fudiBOX es histórico.

Los cambios de main se publican mediante Vercel. Antes de subir: revisar cambios, ejecutar build y las pruebas HTTP con servidor levantado. Confirmar el despliegue y revisar la página publicada. Las migraciones de Supabase requieren aplicación independiente; un push no las ejecuta.

Migración de operación: supabase/migrations/202610010001_operator_console.sql, aplicada. El acceso se verifica con operator_access y fudi_private.admins; las funciones de escritura exigen administrador. Nunca usar service_role ni secretos Google en el navegador o en Git.

Variables de producción: URL pública de Supabase y clave publicable. Conservar las configuraciones de retorno Google en Supabase. Al conectar un dominio nuevo, actualizar Site URL y permitir su /auth/callback, comprobar el acceso y luego compartirlo.

Pruebas: tests/auth-http.test.mjs y tests/operator-http.test.mjs (10 comprobaciones HTTP). Las pruebas SQL transaccionales deben ejecutarse con rollback y una cuenta de prueba autorizada; nunca dejar fixtures operativos. Leer CONTINUIDAD/HANDOFF_ACTUAL.md antes de continuar.

## 10. Dudas frecuentes

¿Dónde registro más restaurantes y repas? En /admin, secciones Restaurantes y Repas.

¿Un restaurante necesita Google? No para este modelo: sólo el equipo operador utiliza el panel.

¿El repa recibe pedidos automáticamente? Todavía no; WhatsApp es manual y la asignación está pendiente.

¿Puedo mostrar ya fudiBOX? Sí, como versión de prueba con catálogo y carrito; la recepción está cerrada.

¿Ocultar el enlace protege el panel? No por sí solo. La autorización también se exige en servidor y en las funciones de base de datos.
