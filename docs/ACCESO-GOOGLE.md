# Resultado actual
Login Google y persistencia inmediata tras recargar verificados con Miguel. Cierre de sesión y renovación tras expiración pendientes. Primer intento fallido invalid_client resuelto tras guardar un nuevo secreto Google.

# Acceso Google local
Implementado con Next.js App Router y @supabase/ssr. Solo clave publicable; el secreto OAuth permanece en Supabase.
El cliente inicia PKCE y guarda el verificador en cookie; /auth/callback intercambia el código y devuelve /cuenta.
La ruta de retorno no acepta destinos proporcionados por query. Ante error vuelve a /acceso?error=oauth sin exponer detalles del proveedor.
El proxy renueva sesiones existentes. /cuenta verifica identidad con getUser y consulta orders filtrando customer_id.
RLS sigue siendo la autorización de base de datos. Ni user_metadata ni localStorage otorgan permisos de negocio, coordinación o administración.
Cerrar sesión es una Server Action POST (protección de origen de Next.js), alcance local.

## URLs diferentes
Google Cloud > Authorized redirect URIs:
https://aybgfwjbnsqbfnzmztmx.supabase.co/auth/v1/callback
Supabase > Authentication > URL Configuration > Redirect URLs:
http://localhost:3000/auth/callback
Site URL actual: http://localhost:3000.
No configurar dominios de Vercel hasta que exista un despliegue.

## Prueba manual pendiente
1. Abrir http://localhost:3000/acceso con el servidor iniciado.
2. Continuar con Google y elegir la cuenta de prueba autorizada.
3. Miguel completa el consentimiento de Google si se solicita.
4. Debe volver a /cuenta y mostrar Sesión verificada y su correo.
5. Recargar la página para verificar persistencia; cerrar sesión y comprobar que /cuenta exige acceso nuevamente.
Esta prueba crea un usuario/sesión real en Supabase Auth; no crea pedidos ni perfiles comerciales.
La consulta de pedidos distingue un error de permisos/conexión de una lista vacía.
No generar o imprimir códigos OAuth, cookies o tokens en registros de diagnóstico.

## Verificación realizada
Compilación de producción y TypeScript correctos.
Cinco pruebas HTTP: visitante sin sesión, cookie falsa, callback sin código con next externo, código PKCE inválido y cabeceras de acceso.
npm audit durante instalación: cero vulnerabilidades reportadas.
Pendientes: acceso Google real, refresco/cierre de sesión real, permisos multiusuario, paneles, RPC y concurrencia.
No se repitió ni modificó la migración inicial.

Referencias oficiales:
- https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
- https://supabase.com/docs/guides/auth/social-login/auth-google
