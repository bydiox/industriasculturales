# Preguntas oficiales M1 — Ministerio de Cultura y Deporte, OEP 2020

## Qué es esto

571 preguntas de examen real, extraídas de nueve cuestionarios oficiales del Ministerio de Cultura y Deporte, con su respuesta correcta verificada contra la plantilla definitiva del tribunal. No son preguntas generadas: son las que el propio organismo examinador (INAEM/Ministerio de Cultura) hizo a sus propios opositores técnicos.

**Convocatoria de origen:** Resolución de 26 de mayo de 2023, de la Secretaría de Estado de Función Pública (BOE núm. 129, de 31 de mayo). Proceso selectivo para personal laboral fijo, grupo profesional **M1**, sujeto al IV Convenio Único, en el extinto Ministerio de Cultura y Deporte. Examen celebrado el **25 de noviembre de 2023**.

M1 no es la misma oposición que la de destino (M3, Gestión de Industrias Culturales y Creativas), pero comparte administración convocante, IV Convenio Único, y —lo importante— nueve especialidades M1 son perfiles técnicos de escena del propio INAEM: maquinaria escénica, iluminación, sonido, sastrería, peluquería, dirección técnica y producción de espectáculos. Su parte específica es, en la práctica, el desarrollo detallado del bloque técnico que el temario de M3 solo enuncia en un párrafo por tema.

## Por qué se ha usado

El temario de M3 tiene 12 temas técnicos (escenografía, maquinaria, iluminación, sonido, sastrería, caracterización, dirección de escenario) sin ninguna norma legal de la que derivar preguntas — no hay BOE que regule "qué es un bofetón" o "qué es una eslinga". Antes de esta fase, esos temas estaban a cero o casi.

Los cuestionarios M1 los cubren con el nivel de detalle exacto que un tribunal de este ámbito espera: vocabulario de oficio, dato concreto, sin ambigüedad. Compárese con el único precedente que había: el examen M3 de 2022 preguntaba "¿qué es una basquiña?" o "¿dónde está la chácena?" — exactamente el mismo registro que estas 571 preguntas.

## De dónde vienen los documentos

Nueve pares cuestionario + plantilla, del índice público de convocatorias del Ministerio de Cultura:

| Especialidad M1 | Preguntas retenidas | Aporta principalmente a |
|---|---:|---|
| Maquinaria Escénica para el Espectáculo en Vivo | 80 | Escenografía, maquinaria, historia del teatro |
| Gestión de Sastrería del Espectáculo en Vivo | 80 | Sastrería y caracterización |
| Asistencia a la Dirección Técnica de Espectáculos en Vivo | 80 | Transversal: dirección de escenario, PRL, organización |
| Estilismo y Dirección de Peluquería | 79 | Caracterización, historia del teatro |
| Producción de Audiovisuales y Espectáculos | 74 | Propiedad intelectual, planificación, régimen laboral artístico, organización INAEM |
| Realización de Proyectos Audiovisuales y Espectáculos | 69 | Dirección de escenario, iluminación, PRL |
| Sonido para Audiovisuales y Espectáculos | 51 | Sonido, ofimática de producción (Qlab) |
| Iluminación, Captación y Tratamiento de Imagen | 32 | Iluminación, electricidad básica |
| Parte común (pool único, compartido por las 9 especialidades) | 26 | Constitución, empleo público, IV Convenio |

El `.rar` original contenía además cinco especialidades no escénicas (Mantenimiento General, Proyectos de Obra Civil, Transporte y Logística, Guía Turística, Diseño y Edición de Publicaciones) que no se han procesado por no aportar contenido relevante al temario de M3.

## Cómo se ha construido cada pregunta

1. **Extracción de texto** de los PDF originales, filtrando la marca de agua de fondo del cuadernillo oficial.
2. **Parseo automático** de enunciado + tres opciones (A/B/C — este es el formato de tres opciones de la convocatoria M1 2023, distinto de las cuatro de la convocatoria de destino M3 2023-24).
3. **Cruce con la plantilla de respuestas oficial** para asignar `correctOptionId`.
4. **Descubrimiento de que la parte común es un pool único**: las 9 especialidades comparten las mismas 30 preguntas comunes, solo con las opciones reordenadas por modelo de examen (medida antifraude). Se usó un único set canónico para no duplicar contenido.
5. **Mapeo manual, pregunta a pregunta, al `topicId`** del temario de M3 (`comun-XX` / `especifico-XX`), descartando lo que no tiene encaje real.
6. **Aplicación de las correcciones oficiales del tribunal.** El lote incluía dos actas de modificación de plantilla publicadas semanas después del examen original (9 de abril y 23 de abril de 2024) que anulaban algunas preguntas y corregían la respuesta de otras. Se han aplicado íntegramente antes de esta entrega: **8 preguntas retiradas por anulación** y **8 con la respuesta corregida**.

## Filtros de calidad aplicados

- **Preguntas descartadas por caducidad factual**, no promovidas a activo: 6 preguntas de la especialidad Producción de Audiovisuales que preguntaban por el director artístico actual de una unidad del INAEM, la programación de una temporada concreta, o la composición actual de un comité internacional. Son datos que dejan de ser ciertos con el tiempo aunque la plantilla los marque como correctos para siempre — se conservan en `preguntas-m1-produccion-descartadas-caducas.json`, sin activar.
- **Preguntas descartadas por perfil no aplicable**: en Iluminación se descartaron ~47 de 80 (fotografía de archivo, digitalización patrimonial, códecs de radiodifusión — perfil de museos/hemerotecas, no de escena). En Sonido se descartaron ~29 de 80 por el mismo motivo (normas de televisión, formatos de vídeo broadcast).
- **Auditoría por muestreo**: se revisó una muestra aleatoria de 20 preguntas del lote de mapeo más denso (Sastrería/Peluquería/Realización/Asistencia) contra su clasificación temática. Las 20 fueron correctas.

## Formato de cada pregunta

Cada entrada sigue el esquema del banco de preguntas de la aplicación, con:

- `id`: identificador único, prefijo `m1-cultura-{especialidad}-2023-{número original en el cuestionario}`
- `topicId`: tema del temario de M3 al que se ha mapeado
- `prompt`, `options` (3, formato A/B/C), `correctOptionId`
- `source.kind: "official_exam"` y `source.reference` con especialidad, número de pregunta y fecha
- `origin`: bloque completo de procedencia (convocatoria, ministerio, grupo, especialidad, turno, fecha, número original en el cuestionario fuente)
- `active: true`, `optionCount: 3`

**Importante para la integración:** son preguntas de **3 opciones**, no 4. La convocatoria de destino (M3, 2023-24) usa 4 opciones con penalización de 1/3. Estas preguntas sirven directamente para práctica libre y modo histórico; para el simulacro de examen que emula el formato actual, necesitan un cuarto distractor añadido siguiendo la guía editorial ya integrada en el proyecto (`GUIA_PREGUNTAS_REFERENCIA.md`), igual que se hizo con el resto del banco propio migrado de 3 a 4 opciones.

## Lo que queda pendiente tras este lote

10 temas del temario específico de M3 siguen sin ninguna pregunta (7,91% del examen): historia de la danza, el circo y las artes visuales (`especifico-08, 09, 10`); parte del bloque de planificación y públicos (`especifico-19, 22, 23, 24, 25, 27`); y `especifico-40` (nuevas tecnologías aplicadas al sector cultural), que no aparece en ninguno de los nueve cuestionarios procesados. Estos diez no tienen ya una vía de examen oficial identificada — necesitan fuente bibliográfica (`source.kind: "referencia"`).

## Verificación de integridad de este paquete

- 571 preguntas, 571 IDs únicos (sin duplicados)
- 571 con `correctOptionId` no nulo
- 571 con `optionCount: 3`
- 30 temas distintos del temario de M3 representados
- Correcciones oficiales del tribunal aplicadas en su totalidad
