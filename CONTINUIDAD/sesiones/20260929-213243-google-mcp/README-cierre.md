# FudiBOX
Marketplace local para Jojutla, Morelos y alrededores. Primer negocio: Chicken Chicanito.

## Estado al cierre · 29 septiembre 2026
- Prototipo visual y flujo de pedidos disponibles en index.html; datos locales de demostración.
- Arquitectura aprobada: Vercel + Supabase.
- Proyecto Supabase creado y migración inicial instalada. Miguel confirmó nueve tablas públicas con RLS activado.
- Aplicación todavía sin conexión a la base, sin inicio de sesión y sin publicación en Vercel.
- Acceso elegido: Google. Proyecto Cloud y cliente OAuth fudiBOX creados; proveedor Google en Supabase pendiente de confirmar/completar. MCP Supabase autenticado y consultado desde un chat nuevo.

**Para retomar:** leer CONTINUIDAD/HANDOFF_ACTUAL.md.
Carpeta principal: C:/Users/hp/Desktop/FUDIGPT/fudiBOX. La copia de Documents es histórica.

## Prototipo
Abrir index.html en un navegador. No necesita instalación; conserva los datos en localStorage de ese navegador.
Incluye catálogo de ejemplo, pedido de un negocio, entrega o recoger, confirmación, cotización con diez minutos para aceptar, transferencia al coordinador de respaldo, asignación manual, código de entrega y adeudo de $10 por pedido completado.
Los mensajes de WhatsApp se preparan y requieren envío manual. Catálogo y precios pendientes de sustituir por datos reales.

## Identidad
Logo oficial provisional: assets/fudibox-logo-flat-v3-ojos.png.
Mascota del hero: assets/fudi-repa-v2-uniforme.png.
Ilustración complementaria en moto: assets/fudi-moto-v1.png.
Voz: barrio para todos, clara en precios y acciones. Guías en docs/IDENTIDAD.md y docs/VOZ-DE-MARCA.md.

## Organización
- assets/: logos, personajes y recursos del negocio.
- docs/: identidad, voz, arquitectura y prompts.
- supabase/: migración y estado de base de datos.
- tests/: pruebas del prototipo.
- previews/: capturas, algunas históricas.
- CONTINUIDAD/: handoff vigente, evidencia y cierres fechados.

## Desarrollo pendiente
Migrar a Next.js/TypeScript, integrar autenticación y permisos, implementar funciones transaccionales de pedidos e inventario, probar aislamiento y concurrencia, y desplegar en Vercel.
.env.local contiene configuración pública para la futura app y está excluido de Git; el prototipo no lo utiliza.
Consultar PLAN.md para alcance y CONTINUIDAD/HANDOFF_ACTUAL.md para el estado vigente.

## Retomar después de conectar MCP
Leer [HANDOFF_ACTUAL.md](CONTINUIDAD/HANDOFF_ACTUAL.md): incluye la configuración Google/MCP, evidencia, límites, operación e identidad aprobadas y secuencia exacta de continuación.
Siguiente acción: usar el MCP en el chat nuevo para revisar capacidades de Auth y terminar la configuración del proveedor Google existente. La aplicación todavía no tiene login funcional.
El chat "Lista las tablas de Supabase" confirmó conectividad. Hay 9 tablas públicas y 5 privadas de fudiBOX; no repetir la migración inicial. Nunca confundir la autorización MCP de Codex con el acceso Google de clientes.
