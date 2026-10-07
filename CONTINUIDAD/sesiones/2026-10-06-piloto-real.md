# Compra real restringida — 6 octubre 2026

Miguel eligió «Todo real»: compra, recogida y pago reales en Chicanito. Todavía NO hay pedido enviado, comida preparada, pago ni entrega. Se pidió producto y cantidad; falta su respuesta. Revisar el total con Miguel antes de enviar; no inventar teléfono, opciones ni evidencia de preparación/entrega.

- Commit funcional dcf65fa publicado en main y comprobado en https://fudibox.vercel.app/chicanito: aviso de una compra real para recoger y botones activos en sesión de Miguel.
- Migración 202610060001_pickup_pilot.sql instalada en Supabase mediante SQL Editor autenticado. Se aplicó tabla/RPC y parche guardado de la función existente; no se reaplicaron migraciones anteriores. El cuerpo funcional equivale al archivo versionado; el SQL Editor preservó la definición existente y cambió sólo declaración, bloqueo de acceso y consumo del permiso.
- fudi_private.pickup_pilots: permiso por usuario y negocio, un único pedido, vencimiento, RLS y sin acceso directo de clientes. my_pickup_pilot informa sólo del permiso propio. create_customer_order bloquea la fila del permiso y la consume en la misma transacción; conserva reintento por request_key. Sólo permite pickup con tienda cerrada. No reactivar automáticamente un permiso consumido.
- Permiso de Miguel en Chicanito activado hasta 2026-10-08 00:12:44 UTC (7 octubre 18:12:44, Ciudad de México). used_order_id NULL, pedidos 0 al verificar. accepting_orders continúa false. No habilitar domicilio ni apertura general.
- Build/TypeScript correctos. Prueba SQL con rollback PASS: sin permiso, usuario ajeno, domicilio, vencimiento, importe inválido sin consumir permiso, un solo pedido, reintento, stock y privilegios. No se ejecutó una prueba concurrente con dos conexiones. Diez pruebas HTTP de producción pasaron antes y después de publicar.
- No se usan WhatsApp automático ni verificación por código. El administrador sólo debe marcar preparación/listo/entregado conforme a lo que realmente suceda en Chicanito. Cargo único $10 al completar; no certifica pago.
- Carpeta vigente sigue Desktop/FUDIGPT/fudiBOX. pickup-pilot-review en Documents contiene únicamente archivos de revisión/evidencia de esta sesión, no otra aplicación.

Siguiente paso: escoger producto/cantidad/opciones, revisar importe y datos reales en el carrito, enviar por pantalla y acompañar cada estado sin anticipar hechos físicos.

---

