# Supabase · esquema inicial instalado

Proyecto confirmado nuevo y exclusivo: fudiBOX (aybgfwjbnsqbfnzmztmx).

## Procedimiento histórico (ya completado; no repetir)
1. Abrir SQL Editor en Supabase y crear una consulta nueva.
2. Copiar todo migrations/202609290001_initial_schema.sql y ejecutar como postgres una sola vez.
3. Confirmar que el resultado lista nueve tablas, todas con rls_enabled=true.
4. Si aparece un error, conservar el mensaje y corregir antes de continuar. La transacción evita una instalación parcial. No ejecutar sobre otro proyecto.

El archivo solo crea estructura y políticas de lectura; no contiene claves, no borra tablas ni inserta datos comerciales. Los códigos de entrega se almacenarán como hash en un esquema privado. No habilitar fudi_private en los esquemas expuestos de Data API.

## Límites de esta etapa
No es todavía una integración funcional. No existen RPC para crear pedidos, reservar stock, confirmar, cotizar, aceptar, transferir o entregar. Tampoco hay cron de vencimientos ni usuarios operativos. La estructura deja esos cambios bloqueados para la API pública hasta implementarlos. No pegar una service_role en frontend ni abrir políticas de escritura para saltarse este paso.

Importes en centavos. Pedidos solo de un negocio por integridad referencial de sus productos. Restricción de un pedido activo por repartidor. Adeudo único por pedido/tipo. El control transaccional de totales, existencias, elegibilidad de repartidor y adeudos al completar corresponde a la siguiente migración.

Validación local: 50 sentencias analizadas sintácticamente. El 29 de septiembre Miguel ejecutó la migración y compartió las nueve tablas públicas con RLS=true. Pruebas de aislamiento y concurrencia pendientes. No volver a ejecutar esta migración inicial.

Referencias: https://supabase.com/docs/guides/database/postgres/row-level-security y https://supabase.com/docs/guides/database/functions

