# Borradores pendientes de verificación

Este directorio contiene material de trabajo que **no forma parte del banco activo**.

## `preguntas-borrador-m1-cultura-desempate.json`

Son cuatro preguntas capturadas parcialmente de un examen oficial de desempate de M1 del Ministerio de Cultura. Se conservan para no perder la pista documental, pero no son preguntas listas para usar:

- `correctOptionId` está pendiente y vale `null`.
- `active` es `false`.
- El contenido procede de fragmentos de buscador y una de las preguntas tiene opciones truncadas.
- No deben incorporarse a `data/questions.json`, ni aparecer en el modo Libre, Historia o Examen.
- No cuentan en cobertura, `pool-target` ni ninguna métrica del banco.

Solo tras obtener el cuestionario completo y su plantilla oficial se podrá completar la respuesta correcta, revisar las opciones, normalizar la procedencia y promoverlas mediante un proceso editorial explícito. Al promoverlas habrá que decidir además si se mantienen como históricas de tres opciones o se adaptan al formato vigente de cuatro opciones.
