# Supabase · estado vigente al 21 octubre 2026

Proyecto: aybgfwjbnsqbfnzmztmx. Leer ../CONTINUIDAD/HANDOFF_ACTUAL.md y ../docs/pickup-readiness-release.md antes de cambios.

Existen esquema, RLS, OAuth y RPC transaccionales para solicitar, confirmar, cancelar y completar recogidas. Operación central con autorización de administrador; no confiar en controles visuales. Configuración pública: URL Supabase y clave publicable. Nunca service_role ni secretos Google en frontend/Git; fudi_private no debe exponerse en Data API.

## Migración nueva pendiente

migrations/202610210001_order_methods.sql está versionada, NO aplicada al alojamiento. Añade pickup_enabled=true/delivery_enabled=false, conserva accepting_orders y restringe create_customer_order/my_pickup_pilot. Lectura alojada previa al push devolvió 42703 por columna pickup_enabled ausente.

La aplicación publicada usa un lector compatible: sólo si faltan esas columnas reintenta campos anteriores y cierra recepción y ambas modalidades. No instala controles SQL ni autoriza abrir pedidos. Push de Git/Vercel no aplica migraciones.

Procedimiento: probar aislado, respaldar definiciones/estado del objetivo, aplicar sólo migración nueva mediante acceso autorizado y verificar flags, recepción sin cambios y permisos RPC. Mantener recepción general cerrada. No conceder piloto ni crear compras como efecto secundario.

## Evidencia y pendientes

Cinco suites SQL pasaron el 21 de octubre en PostgreSQL/WASM aislado con tests/run-sql.mjs: no lee .env ni conecta Supabase. No sustituye permisos alojados ni prueba de concurrencia multisesión. Domicilio, cron de vencimientos, códigos y conciliación no están implementados.

La migración inicial y la consola operativa son historia ya instalada: no repetir onboarding ni ejecutar de nuevo todas las migraciones. El archivo de antecedentes está en ../CONTINUIDAD/sesiones/2026-10-21-antes-de-consolidar/SUPABASE_README.md (consultar también el handoff archivado).
