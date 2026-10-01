# Estado vigente · acceso Google local · 29 septiembre 2026

Este apartado prevalece sobre los cierres anteriores, conservados debajo como antecedentes.

## Avance de esta sesión
- Trabajo en C:/Users/hp/Desktop/FUDIGPT/fudiBOX, sin crear una segunda app en Documents.
- Se revisaron las consolas autenticadas por navegador. Supabase MCP no expone configuración de Auth.
- Miguel introdujo el secreto de Google en Supabase. Se corrigió Client IDs con el cliente real ya existente. Google habilitado, Skip nonce checks y Allow users without an email apagados, verificado tras guardar.
- Callback de Google guardado y reabierto para comprobar persistencia: https://aybgfwjbnsqbfnzmztmx.supabase.co/auth/v1/callback.
- Miguel autorizó su cuenta para la prueba; miguel.e.portilla@gmail.com aparece en Test users. Google sigue Testing/External. Publicación no solicitada.
- Retorno http://localhost:3000/auth/callback agregado a Supabase y verificado en la lista. Site URL ya era http://localhost:3000.
- Base Next.js 16.3.7, React 19.3.0, TypeScript y Supabase SSR creada en src/. Portada y acceso conservan marca aprobada.
- OAuth PKCE, callback servidor, sesión por cookies, renovación, cuenta con getUser, pedidos propios mediante RLS y cierre de sesión local.
- No se habilitaron escrituras de pedidos, no se alteró el esquema, no se repitió migración inicial.
- No hay roles reales de negocio/coordinación/admin en la interfaz nueva. No se asignó ningún privilegio. user_metadata se usa solo como nombre visible.
- Prototipo original intacto: index.html/app.js/estilos siguen siendo demo independiente.
- npm instalado temporalmente para dependencias; package-lock.json guardado. Instalación reportó cero vulnerabilidades.
- Compilación y TypeScript correctos; cinco pruebas HTTP de autenticación pasaron. Se corrigió codificación UTF-8 de los textos tras la primera revisión visual.
- Servidor de producción local escuchando solo en 127.0.0.1:3000. Abrir por http://localhost:3000/acceso para el flujo OAuth.
- Runtime Node: C:/Users/hp/AppData/Local/Programs/Python312/Lib/site-packages/playwright/driver/node.exe. Reinicio mediante run-fudibox.ps1 start, previa compilación si hay cambios.
- No se desplegó ni contrató nada; no se guardaron secretos en documentación.

## Punto exacto pendiente
Probar el inicio de sesión Google completo con Miguel desde la app local.
Todavía no afirmar que el secreto es válido, que el intercambio final funciona o que existe una sesión real de cliente.
Después: verificar /cuenta, persistencia tras recargar y cierre de sesión. Conservar esta evidencia y actualizar este apartado.
Seguir con catálogo real, perfiles y permisos por rol, RPC transaccionales, idempotencia y pruebas de aislamiento/concurrencia antes de piloto.
Ver docs/ACCESO-GOOGLE.md y README.md para instrucciones.

---

