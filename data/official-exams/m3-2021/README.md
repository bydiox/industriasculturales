# Banco oficial M3 2021

Este directorio conserva material recibido de una convocatoria oficial anterior de Gestión de Industrias Culturales y Creativas:

- `cuestionario-1er-ejercicio.pdf`: cuestionario oficial de 70 preguntas del primer ejercicio.
- `plantilla-respuestas.pdf`: plantilla oficial de respuestas.
- `supuesto-practico-3er-ejercicio.pdf`: supuesto práctico oficial de la misma convocatoria.
- `metadata.json`: procedencia y advertencia editorial.
- `answer-key.json`: clave estructurada para auditar el banco.

Las 70 preguntas se han incorporado a `data/questions.json` con identificadores estables `m3-2021-oficial-001` a `m3-2021-oficial-070` y con `origin.type = official_exam`. La aplicación las muestra como material histórico de comparación porque el temario y el formato de aquella convocatoria pueden no coincidir con los vigentes.

El cuestionario original tiene tres opciones por pregunta; esto se conserva tal cual, aunque la configuración de la convocatoria vigente pueda establecer otro número de alternativas.
