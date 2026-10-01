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

