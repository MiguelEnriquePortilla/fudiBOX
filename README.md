# fudiBOX · Restaurantes Locales

Actualizado: 21 octubre 2026. Para retomar: **Open fudiBOX Project**.
Leer [AGENTS.md](AGENTS.md) y [CONTINUIDAD/HANDOFF_ACTUAL.md](CONTINUIDAD/HANDOFF_ACTUAL.md) antes de trabajar.

## Estado vigente

**BETA, sin restaurantes reales operando. Recepción general de pedidos cerrada.** Chicanito y su catálogo son referencias de desarrollo. Los registros históricos no prueban operación comercial actual.

Publicado: https://fudibox.app (sin www). Último cambio funcional publicado: `d5cd689`, Fudi completo, Google oficial, instalación en el pie y correo público. Vercel y contenido publicado verificados. Conserva «Restaurantes Locales». Repositorio: https://github.com/MiguelEnriquePortilla/fudiBOX. Rama única de trabajo: `main`; sus pushes publican automáticamente mediante Vercel. Un push no ejecuta migraciones de Supabase.

El 21 de octubre se comprobó: dominio sin www devuelve 200; www.fudibox.app falla validación TLS por nombre de certificado incompatible. Pendiente corregir asociación/certificado/redirección del dominio www; no saltarse el aviso de Chrome.

## Ubicaciones

- Principal: `C:/Users/hp/Desktop/FUDIGPT/fudiBOX`.
- Worktree de apoyo: `C:/Users/hp/Documents/ChatGPT/fudiBOX/pickup-readiness`. Comparte Git con el principal; quedó sin rama propia después de integrar. Comprobar HEAD y cambios antes de reutilizarlo.
- El directorio padre `Documents/ChatGPT/fudiBOX` contiene un prototipo histórico. No es la aplicación publicada.

## Disponible y pendiente

Disponible: catálogo/opciones/carrito, Google, cuenta cliente, seguimiento de recogidas y administración autorizada. Recogida: solicitud → preparación → listo → entrega confirmada manualmente por operador. Precios, reservas, permisos e idempotencia se validan en servidor. Se registra una tarifa de servicio de $10 una sola vez al completar; esto no certifica cobro ni liquidación.

Panel y cuenta consultan cada 20 segundos mientras están visibles. Sonido opcional en panel y WhatsApp manual. No hay notificaciones con app cerrada. Interfaz móvil, carrito inferior y diálogos refinados según [DESIGN.md](DESIGN.md).

**Migración `202610210001_order_methods.sql` versionada, pero NO aplicada al Supabase alojado.** El lector de catálogo reconoce específicamente las columnas ausentes y cierra recepción/modalidades. Esa compatibilidad no instala las nuevas restricciones SQL.

Antes de abrir: migración controlada, políticas de incidencias, recorrido autenticado y teléfonos físicos. Domicilio, códigos, conciliación, pagos y correcciones posteriores pendientes. [PLAN.md](PLAN.md).

## Desarrollo

Next.js 16, React 19, TypeScript y Supabase. Instalar dependencias del lockfile con `npm ci` cuando sea necesario. `.env.local` contiene configuración pública de Supabase y permanece fuera de Git. Nunca versionar claves privilegiadas ni secretos Google.

```powershell
./run-fudibox.ps1 dev
./run-fudibox.ps1 build
./run-fudibox.ps1 typecheck
# Con servidor disponible:
$env:TEST_BASE_URL='https://fudibox.app'
./run-fudibox.ps1 test
```

El lanzador busca Node aunque no esté en PATH. Si PowerShell bloquea el archivo, usar `powershell -NoProfile -ExecutionPolicy Bypass -File ./run-fudibox.ps1 test`, sólo para ese proceso.

Evidencia del cierre funcional del 21 de octubre: build y TypeScript correctos, 34 pruebas automatizadas también contra el sitio publicado y cinco suites SQL aisladas. No equivalen a un recorrido autenticado real, concurrencia entre sesiones ni pruebas físicas.

## Documentación

- [Estado para retomar](CONTINUIDAD/HANDOFF_ACTUAL.md): decisiones, herramientas, evidencia y límites.
- [Guía de uso](docs/HOW-TO-GUIDE.md).
- [Arquitectura](docs/arquitectura.md) y [Supabase](supabase/README.md).
- [Publicación y migración pendiente](docs/pickup-readiness-release.md).
- [Diseño aprobado](DESIGN.md) y [verificación visual](docs/frontend-polish-verification.md).
- [Archivo de continuidad](CONTINUIDAD/README.md): antecedentes fechados, subordinados al estado vigente.

Contacto público confirmado: thefudibox@gmail.com. La instalación está disponible en el pie junto a Contáctanos. El acceso usa Fudi de cuerpo completo y el símbolo oficial multicolor de Google, aprobados el 21 de octubre.
