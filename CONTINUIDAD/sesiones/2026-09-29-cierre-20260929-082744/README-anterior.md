# FudiBOX

## Actualización · 29 septiembre 2026 — voz de marca
Miguel aprobó tono A: con barrio, pero para todos. Órale, va que va, sí, pues, al tiro, machín; «de poca…» ocasional y abreviado. Aplicado al cliente; guía en docs/VOZ-DE-MARCA.md. No cambia identidad visual, logo con ojos ni flujo operativo. Sesión retomada para lenguaje de marca, antes de configurar backend. La pregunta sobre cuenta Supabase quedó sin respuesta; no inferir que existe.

## Cierre final de sesión · 25 septiembre 2026
Sesión cerrada por solicitud de Miguel. Retomar mañana desde esta carpeta principal; la copia de Documents es antecedente y no debe usarse para continuar sin sincronizar.

Guardado verificado: proyecto, logo oficial con ojos, personaje con gafete y logos, variante en moto, prompts, pruebas y continuidad. La moto está en assets/fudi-moto-v1.png; el hero conserva el personaje de uniforme v2.

Punto de reanudación: leer CONTINUIDAD/HANDOFF_ACTUAL.md y PLAN.md, abrir index.html y continuar hacia persistencia y usuarios reales según el alcance aprobado. Antes de publicar, faltan catálogo/precios reales, dirección del negocio, coordinadores y configuración del backend. No hay despliegue ni pagos contratados. No repetir el cuestionario ni cambiar el logo aprobado.


**Continuidad:** leer `CONTINUIDAD/HANDOFF_ACTUAL.md`. Carpeta principal solicitada: `C:/Users/hp/Desktop/FUDIGPT/fudiBOX`. Los cierres y README de continuidad se guardan en `CONTINUIDAD/`; capturas en `previews/`.

Mascota vigente: `assets/fudi-repa-v2-uniforme.png`, con gafete FUDI y logo en pecho, casco y mochila. Logo oficial: versión plana con ojos.

Logo oficial actual: `assets/fudibox-logo-flat-v3-ojos.png` (lunchbox con ojos). Fudi repartidor permanece como mascota, con la familia naranja/petróleo/cian de fudiGPT y Chicken Chicanito como primer negocio. Ver `docs/IDENTIDAD.md` para paleta, uso y procedencia del arte. El menú y precios siguen siendo de demostración.

Primera versión de trabajo, 25 septiembre 2026. Abrir `index.html` en un navegador para recorrer el prototipo local. No requiere instalación. Los datos quedan en este navegador; no es un sistema publicado ni multiusuario.

## Qué funciona en el prototipo
- Catálogo de demostración, un negocio por pedido, domicilio o recoger.
- Negocio confirma disponibilidad; coordinador cotiza; cliente acepta en diez minutos.
- Preparación solo después de aceptar la cotización (domicilio).
- Principal y respaldo, conservando cotización y vencimiento.
- Asignación manual, código de entrega y adeudo de $10 al completar.
- Mensajes de WhatsApp preparados; requieren configurar número y pulsar enviar en WhatsApp.

## Verificación manual
1. Crear pedido a domicilio. En Negocio confirmar disponibilidad.
2. En Coordinación cotizar. En Cliente aceptar. En Negocio marcar listo.
3. En Coordinación asignar nombre de repartidor. Copiar el código desde Cliente y cerrar la entrega en Coordinación.
4. Verificar en Administración adeudo de $10, no antes de entregar.
5. Repetir con recoger: negocio confirma y entrega con código; no interviene coordinación.
6. Transferir al respaldo después de cotizar: importe y vencimiento deben mantenerse.

## Siguiente implementación
Next.js y TypeScript para la aplicación, PostgreSQL/Supabase para persistencia, autenticación y permisos. Migrar las reglas del prototipo a transacciones en servidor, con pruebas de concurrencia e idempotencia. Este prototipo no sustituye esa capa.

Ver `PLAN.md` para alcance aprobado y `docs/arquitectura.md` para decisiones técnicas y pendientes.
