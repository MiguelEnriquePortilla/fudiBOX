> Estado operativo actualizado: consultar [HOW-TO-GUIDE.md](HOW-TO-GUIDE.md). Este documento describe arquitectura objetivo; los pendientes historicos no reflejan la publicacion del 1 de octubre de 2026.

# Arquitectura objetivo

Monolito modular: Next.js/TypeScript, PostgreSQL en Supabase, Auth, Storage y Realtime. Una fuente de verdad en servidor. WhatsApp es transporte manual de mensajes, no almacenamiento de estado ni prueba de recepción.

## Entidades
users, businesses, memberships, products, inventory_reservations, orders, order_items, quotes, delivery_assignments, coordinators, drivers, order_events, ledger_entries, settlements.

## Invariantes
- Importes enteros en centavos; precios y tarifa FudiBOX calculados por servidor.
- Precio original de productos conservado en cada pedido.
- Aceptación de cotización atómica, con reloj de servidor y límite estricto de 10 minutos.
- Trabajo programado libera reservas vencidas incluso si nadie abre la web; cada mutación también verifica vencimiento.
- Reintentos no duplican pedidos, cobros, reservas ni cierres.
- Transferencia bloquea fila y cambia responsable sin modificar cotización.
- Código de entrega generado criptográficamente, hash en base de datos, intentos limitados. Coordinador recibe validación, no acceso al código original.
- Adeudo de 1000 centavos una sola vez por pedido completado. Reversos auditados.
- Un pedido activo por repartidor, con restricción/transacción en base de datos.
- Políticas RLS por cliente, negocio, coordinador responsable y administrador. Nunca confiar en selector visual de rol.
- Enlaces de cliente autenticados o con token privado no predecible; ningún dato personal en URL pública.
- Ubicación de recogida verificada por sucursal; cliente confirma pin de entrega y referencias. Ubicación GPS actual no equivale necesariamente a destino deseado.

## Prototipo local
HTML/CSS/JavaScript para validar el flujo sin herramientas de instalación. Persistencia localStorage y catálogo ficticio. Selector de roles únicamente de demostración. Temporizadores dependen del navegador; las reglas deben migrarse a servidor. No usar datos reales ni operar pedidos en él. Los enlaces WhatsApp se abren por acción expresa y requieren envío manual; el prototipo no incluye enlace público de seguimiento.

## Pendientes antes de operación
Números de coordinadores, primer catálogo y dirección de negocio, cobertura, teléfonos reales, correo/dominio, credenciales de alojamiento, mecanismo de verificación de clientes, cancelaciones y ajustes, reservas concurrentes y notificaciones con web cerrada. Validar flujo real con conectividad irregular. No hay suscripciones contratadas ni despliegue realizado.
