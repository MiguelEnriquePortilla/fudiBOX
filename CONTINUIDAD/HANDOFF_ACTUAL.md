# Handoff vigente — cierre 9 octubre 2026

Miguel pidió cerrar esta sesión y continuar después. Este documento sustituye las instrucciones de próximos pasos de los antecedentes. No cerrar sesiones de Google/Supabase/Vercel ni cambiar recepción al retomar.

## Proyecto y acceso
- Repositorio real: C:/Users/hp/Desktop/FUDIGPT/fudiBOX. Documents/ChatGPT/fudiBOX es histórico; no construir una segunda app ahí.
- GitHub MiguelEnriquePortilla/fudiBOX, main, despliegue automático Vercel.
- Tienda https://fudibox.app; panel https://fudibox.app/admin; cuenta /cuenta.
- Dominio propio y Google funcionan. Supabase: aybgfwjbnsqbfnzmztmx; Site URL https://fudibox.app y callback /auth/callback autorizados. No reconfigurar OAuth sin un fallo demostrado.
- Falta botón Mi panel en Mi cuenta visible solo para operadores: se propuso, NO se implementó. Acceso actual por /admin.

## Diseño aprobado: conservar
Miguel aprobó por captura la portada final y dijo PERFECT. Fudi completo sobre moto al frente, fondo crema con íconos discretos de tacos, gorditas, quesadillas, pozole y pollo asado. Título: La mesa está puesta. Lenguaje natural de México, claro y directo; evitar qué onda, repa, machín, al tiro.
- src/app/page.tsx y home.css: portada vigente.
- public/assets/fudi-moto-v1.png: personaje aprobado, transparencia.
- public/assets/platillos-pattern-crema-v2.png: fondo aprobado, CSS opacidad .42 con velo crema.
- No volver a la foto de mesa ni al patrón naranja: fueron iteraciones descartadas, aunque los archivos se conservan.
- docs/home-food-art.md conserva antecedentes y prompts. Imágenes son ilustrativas, no productos ofrecidos.
- Último commit funcional: 287da2e; anterior 4f4e51e. Ambos recursos y su uso en producción comprobados por HTTP; captura final del usuario confirma apariencia.

## Operación y pruebas reales
- Recepción general continúa cerrada (accepting_orders=false). Domicilio, asignación de repartidor y validación por código pendientes. No habilitar apertura general automáticamente.
- Un pedido real de recogida completado el 7 octubre: total $95, un cargo de servicio $10, un evento pickup_completed, cero reservas pendientes. Esto no acredita liquidación/pago al restaurante.
- Piloto de Miguel consumido y vencido. No reutilizarlo automáticamente. Tabla privada pickup_pilots y RPC my_pickup_pilot, migración 202610060001 ya aplicada; no reaplicar migraciones anteriores.
- Flujo: solicitado → confirmación manual del operador con restaurante → preparación → listo → entregado. Cada estado debe corresponder a hechos reales.

## Panel implementado
- En curso / Historial, contadores, solicitados primero, recientes arriba dentro de cada estado.
- Actualización cada 20 segundos solo con panel visible, se pausa al editar formulario. Actualizar pedidos permite reanudar.
- Sonido activado mediante botón; Miguel confirmó escuchar el pitido de prueba. Falta comprobar aviso por llegada real de otro pedido. No son notificaciones push; no prometer avisos con app cerrada.
- Preparar WhatsApp genera borrador con productos, opciones, notas e importes. Operador elige chat y envía. No hay envío automático, teléfono configurado del restaurante ni respuesta que cambie estados automáticamente.
- Enlace privado para que restaurante acepte/marque listo solo se propuso; NO implementado.

## PWA
Manifest, iconos, instalación y aviso offline publicados. Solo se guarda página genérica offline, no datos privados ni pedidos; no se reenvían compras. Chrome mostró Abrir en aplicación, pero instalación/apertura en Android e iPhone aún no fue verificada directamente.

## Validación y límites
- Build/TypeScript aprobados tras cambios funcionales y de portada. Último ajuste fue solo referencia y opacidad de fondo.
- Suite de 14 pruebas aprobada: 11 HTTP contra producción y 3 locales (worker y mensajes). No confundir esas pruebas con pedido autenticado integral del panel nuevo.
- Herramienta de navegador falló al iniciar runtime; revisión visual final proporcionada por Miguel. No inventar prueba automatizada de móvil/sonido.
- PowerShell: usar OutputEncoding UTF8 al pasar Python por tubería para conservar acentos.
- Node disponible en C:/Users/hp/AppData/Local/Programs/Python312/Lib/site-packages/playwright/driver/node.exe. Para pruebas HTTP usar TEST_BASE_URL y localhost en local (OAuth normaliza hostname).
- Desktop repo puede requerir escalación por permisos; Documents es carpeta histórica de apoyo. No exponer secretos.

## Próximo paso recomendado
1. Retomar con una frase corta: diseño aprobado, pendiente prueba de pedido entrante en el nuevo panel.
2. Resolver con Miguel si usa su cuenta o cliente invitado; quedó SIN respuesta. Preparar un único permiso de recogida para esa cuenta con caducidad y revisar pedido/importe antes de enviarlo. No crear pedido ni permiso ahora.
3. Mantener panel visible con sonido, verificar llegada automática, borrador WhatsApp y estados hasta cierre conforme a operación real. Verificar un solo cargo y reserva liberada.
4. Añadir acceso Mi panel solo para operadores y probar PWA en teléfono cuando Miguel lo indique. Decidir después si hace falta enlace sencillo del restaurante. No desarrollar otra app por anticipado.

## Forma de trabajar
Mensajes cortos, pocos tokens, pasos pequeños. No repetir configuración ya comprobada. Usuario cerró la sesión; esperar que pida continuar.

Antecedentes: sesiones/2026-10-09-antecedentes.md (históricos, pueden describir pendientes ya resueltos).
