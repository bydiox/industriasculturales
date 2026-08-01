# Auditoría de fuentes no legislativas

Esta app separa dos cosas:

- **Legislación**: normas jurídicas con artículos y anclas.
- **Fuentes / bibliografía**: documentos institucionales, técnicos o profesionales que ayudan a estudiar temas que no salen de una ley.

La regla editorial es sencilla: una fuente no legislativa no debe convertirse en una “ley falsa”. Sirve para entender conceptos, justificar preguntas y abrir el apartado relacionado, pero María no tiene que memorizar documentos completos si la convocatoria solo pide conceptos básicos.

## Estado actual

- Preguntas activas totales: 1113.
- Preguntas activas con fuente no legislativa: 241.
- Preguntas con fuente interna HTML y ancla: 201.
- Preguntas con referencia bibliográfica textual, sin HTML interno: 40.

Las 40 referencias sin HTML interno no son necesariamente incorrectas: son preguntas de cultura, historia, públicos o metodología que se apoyan en referencias externas localizables. Lo mejor a medio plazo sería convertir las más importantes en pequeñas fichas internas, pero no hace falta bloquear el estudio por ello.

## Fuentes internas visibles en Estudio

| Fuente | Preguntas activas | Temas que cubre | Criterio de uso |
|---|---:|---|---|
| CNECP/CNCP técnico de escena y producción | 60 | E29, E31, E32, E33, E34, E36, E37, E38, E39, E40, E12 | Fuente técnica principal. Estudiar vocabulario y funciones, no el oficio completo. |
| CDAEM: danza y patrimonio escénico | 12 | E8 | Apoyo institucional para danza y patrimonio escénico. Nivel de identificación y concepto. |
| Anuario de Estadísticas Culturales | 34 | E10, E11, E14, E20, E21, E22, E27, E28 | Datos y magnitudes culturales. No memorizar tablas completas. |
| FEMP: indicadores y planificación cultural | 27 | E13, E18, E19, E21, E22, E23 | Indicadores, planificación y evaluación. Preguntar hechos verificables, no “mejores prácticas”. |
| Plan de Derechos Culturales | 30 | E15, E18, E19, E21, E23, E24, E25 | Derechos culturales, acceso, mediación, participación e inclusión. |
| Componente 24 | 16 | E13, E26, E27, E28, E40 | Economía cultural, digitalización, modernización e industrias culturales. |
| INSST y estadísticas culturales | 11 | E20, E42 | Carga mental, estrés, riesgos psicosociales y estadísticas culturales. |
| Temario INAEM M1 2022 | 11 | E9, E32, E35, E36, E37, E38 | Calibrador técnico. Usar solo para nivel y vocabulario básico; no convertir M3 en un examen M1. |

## Qué debe ver María

En **Estudio**, estas fuentes deben aparecer junto a las leyes, pero con color y etiqueta de fuente. La lectura recomendada es por apartados:

1. Leer primero el mundo correspondiente del modo Historia.
2. Abrir la fuente solo si ese mundo la marca como material de estudio o si una pregunta enlaza con ella.
3. No leer documentos largos de principio a fin salvo que sean guías breves.

## Próxima mejora posible

Convertir las 40 referencias externas sin HTML interno en fichas breves dentro de `data/sources/`, empezando por las que más se repiten o por las que pertenezcan a temas de mayor peso.
