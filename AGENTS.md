# Instrucciones para la IA que continúe SKELETON

## Objetivo

Construir una app personal de preparación de oposiciones a partir de fuentes oficiales, con práctica, examen, Historia, feedback y progreso. El proyecto no debe depender de EXTERA ni de P03.

## Reglas obligatorias

1. Mantén separado el contenido (`data/`) del motor (`src/`) y de la presentación (`styles/`).
2. No inventes legislación, artículos, fechas, vigencias, derogaciones ni preguntas atribuidas a una fuente.
3. Cada norma debe tener `lawId`, `slug`, título oficial, referencia, URL oficial y versión o fecha de consulta.
4. Cada bloque jurídico debe conservar un `anchorId` estable, legible y permanente. No uses índices como `bloque-17`.
5. Cada pregunta debe tener `id`, `topicId`, enunciado, opciones, respuesta correcta, explicación y procedencia cuando exista.
6. Los distractores deben ser plausibles y de longitud comparable; no reveles la respuesta por estilo o extensión.
7. El feedback debe explicar por qué la opción correcta es correcta y, cuando proceda, enlazar con la fuente.
8. No hagas fallar todo el build porque falte una pregunta de un apartado: informa como aviso y separa los errores bloqueantes de las advertencias.
9. No modifiques datos de usuario, contenido editorial o configuración de despliegue sin describir el cambio.
10. Antes de entregar una modificación, ejecuta `npm run check` y `npm run content:validate`.

## Orden recomendado

Analiza primero la convocatoria y las fuentes, define el esquema y las anclas, importa la legislación, valida el corpus y solo después genera preguntas. No generes preguntas desde memoria cuando se pueda usar una fuente oficial.
