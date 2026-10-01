# Plan aprobado de FudiBOX

## Mercado y lanzamiento
Jojutla, Morelos y alrededores. Marketplace de restaurantes y comercios de alimentos. Un negocio por pedido. Objetivo inicial de 51–200 pedidos diarios; lanzamiento por etapas en 4–6 semanas, sujeto a validación operativa.

## Primera etapa
Web para clientes, negocios, coordinadores y administración. Sin pagos en línea ni Shipday. Sin app propia de repartidor ni mapa en vivo en esta etapa. Pedidos inmediatos y recoger; programados y sustituciones dentro de la app quedan para después. Productos con presentaciones y precios definidos, control opcional de cantidades o disponible/agotado. Registros de negocios y repartidores requieren aprobación.

## Dinero
Productos $100: negocio recibe $110, incluyendo $10 de FudiBOX. Si envío cuesta $30, repartidor adelanta $110 y cobra $140 al cliente, conservando $30. Para recoger, cliente paga $110 directamente al negocio. Cada pedido completado genera $10 de adeudo del negocio; corte semanal y registro manual de pagos. No comisión porcentual. La eventual cuota del repartidor queda sin definir.

## Domicilio
1. Cliente solicita; FudiBOX registra pedido y reserva existencias.
2. Negocio confirma disponibilidad e indica preparación estimada. Aún no prepara.
3. Negocio pulsa Solicitar repartidor: abre WhatsApp con mensaje preparado al coordinador principal y lo envía manualmente.
4. Coordinador registra precio de envío en su panel. Cotización visible en FudiBOX; avisa por WhatsApp con enlace al pedido.
5. Cliente tiene 10 minutos para aceptar productos + $10 + envío. Si vence, se cancela y liberan reservas.
6. Tras aceptación, negocio prepara; coordinador asigna en su grupo y registra repartidor en FudiBOX. Un pedido activo por repartidor.
7. Cliente comunica código al repartidor, este al coordinador; coordinador lo valida y completa entrega.

## Respaldo
Un coordinador principal para todos los negocios y otro de respaldo. El negocio pulsa Solicitar apoyo y transfiere la responsabilidad. Cotización, vencimiento y aceptación se mantienen. Toda acción posterior del responsable anterior debe rechazarse en servidor. El nuevo mensaje de WhatsApp es manual.

## Recoger
Negocio acepta, prepara, cobra productos + $10 y valida código. Sin coordinador.

## Incidencias
Negocio atiende primero; administrador interviene cuando hace falta. Si repartidor ya adelantó y cliente no recibe, negocio reembolsa adelanto. El pago por intento de entrega se resuelve manualmente, con registro. No automatizar cargos de FudiBOX sobre cancelaciones hasta definirlos.

## Secuencia de construcción
1. Prototipo de recorrido y registro de decisiones (esta entrega).
2. Base de datos, autenticación, separación de negocios y responsables.
3. Catálogo real, reservas y pedidos durables; cotizaciones y vencimientos del servidor.
4. Enlaces privados de pedido, WhatsApp manual y paneles conectados.
5. Entregas, incidencias, adeudos y cortes semanales.
6. Piloto con un negocio y dos repartidores, Android e iPhone; ajustes y lanzamiento gradual.

## Avance de configuración · 29 septiembre 2026, noche
Google elegido para clientes. Proyecto Cloud fudibox y cliente OAuth fudiBOX creados. MCP Supabase autenticado y consulta de tablas confirmada en chat nuevo. La autenticación de la app, su conexión, RPC y despliegue siguen pendientes. Detalle vigente: CONTINUIDAD/HANDOFF_ACTUAL.md. No repetir onboarding ni migración inicial.

