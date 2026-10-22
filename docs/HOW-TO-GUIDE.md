# Guía de uso y pruebas · 21 octubre 2026

**BETA sin restaurantes reales operando; pedidos generales cerrados.** Sitio https://fudibox.app, sin www mientras se corrige su certificado. Estado completo: ../CONTINUIDAD/HANDOFF_ACTUAL.md.

## Cliente

Puede explorar catálogo, elegir opciones, armar carrito e iniciar sesión con Google. Armar un carrito no envía ni confirma un pedido. En beta cerrada el carrito muestra resumen y regreso al menú sin pedir datos de contacto inutilizables. El contenido Chicanito es referencia de desarrollo.

En /cuenta el seguimiento precede a los ajustes. Muestra preparación, listo y entrega, dirección, estimación y desglose de productos/servicio/total. Actualiza cada 20 segundos mientras está visible; conserva última lectura correcta y avisa si falla. Cancelación sólo en estados iniciales permitidos. Mi panel se muestra sólo a operadores autorizados.

## Operador

/admin requiere cuenta Google autorizada en servidor; una cuenta cliente no obtiene acceso por conocer el enlace. Alta de administradores mediante intervención controlada, no compartiendo sesiones.

Restaurantes permite datos básicos y visibilidad; guardar conserva o cierra recepción. Visibilidad no equivale a aceptar pedidos. Menús permite productos simples, categoría, precio y disponible/agotado; opciones, fotos e inventario detallado requieren mantenimiento técnico. Repas guarda contactos mexicanos de diez dígitos con +52; no son cuentas ni asignaciones automáticas. No publicar teléfonos personales en Git.

Pedidos muestra última lectura correcta, errores y estado activo/pausado/oculto. Puede pausar o actualizar y habilitar sonido. Recuerda solicitudes vistas; alerta sólo por nuevas mientras funciona la consulta. No promete avisos con teléfono bloqueado o aplicación cerrada.

## Recogida implementada, todavía por validar integralmente

1. Solicitud autorizada con validaciones y reserva en servidor.
2. Operador confirma con restaurante disponibilidad y estimación antes de pasar a preparación.
3. Tras confirmación manual del restaurante, marca listo.
4. Tras confirmar entrega al cliente, marca casilla y cierra pedido. Sin código de recogida.

Reintentos no deben duplicar cargo o consumo de reservas. Se registra servicio $10 una vez al completar. No certifica pago del cliente ni liquidación al restaurante. No recogidas, cancelaciones tras preparación y correcciones requieren políticas/implementación antes de operar.

WhatsApp abre un borrador; operador elige destinatario y pulsa enviar. No cambia estados automáticamente. No hay enlace privado de aceptación para restaurante. Domicilio, cotizaciones, vencimientos, asignación, códigos y conciliación quedan pendientes.

## Antes de abrir cualquier prueba operativa

Leer docs/pickup-readiness-release.md desde la raíz. Aplicar de forma controlada la migración de modalidades pendiente y verificar permisos sin abrir recepción. Definir soporte y responsables, inventario y políticas. Utilizar cuentas autorizadas e identificar pruebas; comprobar todo el recorrido cliente-operador y teléfonos físicos. No cambiar sólo un interruptor para abrir.

## Mantenimiento

Principal C:/Users/hp/Desktop/FUDIGPT/fudiBOX; rama main, Vercel publica al subir. Supabase migra por separado. Google ya se comprobó históricamente: no repetir configuración ni cerrar sesiones sin motivo demostrado. Nunca secretos privilegiados en navegador/Git.

run-fudibox.ps1 ofrece dev/build/start/typecheck/test. TEST_BASE_URL selecciona servidor para HTTP. El runner descubre tests/*.test.mjs. tests/run-sql.mjs es SQL aislado sin conexión Supabase; ver guía de publicación. Fixtures visuales son simulaciones; no equivalen a un recorrido autenticado alojado.
