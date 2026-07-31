# Cuestionarios M1 del Ministerio de Cultura — estado y bloqueo técnico

## Lo que se confirma que existe

El Ministerio de Cultura publica cuestionario + plantilla de respuestas para **todas** las especialidades técnicas del grupo M1, en tres convocatorias:

| Convocatoria | Especialidades técnicas relevantes |
|---|---|
| **2021, turno libre** (OEP 2018) | Maquinaria Escénica, Estilismo y Peluquería, Realización de Proyectos Audiovisuales — con **examen de desempate**, publicado 15/02/2024 |
| **2023, turno libre y promoción interna** (OEP 2020) | Asistencia a Dirección Técnica, Gestión de Sastrería, Iluminación/Captación/Imagen, y el resto del listado de 9 especialidades ya mapeado |
| **2024/2025, turno libre y promoción interna** (OEP 2021-2022) | Iluminación, Mantenimiento General, **Maquinaria Escénica**, **Sonido para Audiovisuales**, publicado 20/02/2025 |

Índices (bloqueados para fetch automático, accesibles por navegador):
- `https://www.cultura.gob.es/servicios-a-la-ciudadania/catalogo/general/19/1986453/2023-turno-libre-promocion-interna-oep-2020/1986453-2023-m1.html`
- `https://www.cultura.gob.es/servicios-a-la-ciudadania/catalogo/general/19/1986453/2024-turno-libre-promocion-interna-oep-2021-2022/1986453-2024-m1.html`
- `https://www.cultura.gob.es/servicios-a-la-ciudadania/catalogo/general/19/1986453/2021-turno-libre/1986453-2021-m1.html`

Patrón de URL de los PDF individuales: `https://www.cultura.gob.es/dam/jcr:{uuid}/{nombre-descriptivo}.pdf`

## Bloqueo técnico encontrado

`cultura.gob.es` deniega el acceso automatizado (`robots.txt`) tanto a las páginas de índice como a los propios PDF bajo `/dam/jcr:`. No he podido descargar ningún documento completo de este dominio en esta sesión. Solo he podido trabajar con los fragmentos que Google indexa y devuelve como snippet de búsqueda.

## Lo que sí se ha extraído (parcial, vía snippet)

**Examen de desempate — Maquinaria Escénica para el Espectáculo en Vivo, M1, 2021.**
`https://www.cultura.gob.es/ca/dam/jcr:4af52115-ac9d-496c-8e11-9792dbcda36e/maquinaria-esc-nica--examen-dsempate.pdf`

4 preguntas capturadas, del nivel exacto del examen de 2022 (definición cerrada, vocabulario de oficio: boca/foro, aperturas de telón "americana/veneciana/alemana", nomenclatura de tiros de bambalina). Una de ellas (la 4) con las opciones B y C truncadas por el propio snippet.

**Sin la plantilla de respuestas**, no he podido confirmar ninguna `correctOptionId`. Estas 4 preguntas están en `preguntas-borrador-m1-cultura-desempate.json` con `active: false` y `correctOptionId: null`. **No deben activarse sin verificación manual.**

## Cómo completarlo (requiere navegador humano)

1. Abrir el índice de 2021 turno libre M1 y descargar el examen de desempate completo de Maquinaria Escénica + su plantilla.
2. Repetir con Estilismo/Peluquería y Realización de Proyectos Audiovisuales (mismo examen de desempate, 2024).
3. Abrir el índice de 2023 (OEP 2020) y descargar cuestionario + plantilla de las 9 especialidades ya mapeadas en `inaem-m1-2022-mapping.json`.
4. Abrir el índice de 2024/2025 (OEP 2021-2022): Maquinaria Escénica y Sonido son distintos ejercicios del mismo temario, buena fuente adicional.
5. Pegar el texto de cada PDF (cuestionario + plantilla) en el chat; desde ahí completo el mapeo a `topicId`, verifico vigencia y genero el JSON activo, igual que con el de Igualdad M3.

## Por qué merece la pena a pesar del bloqueo

Estas son las especialidades M1 del propio Ministerio de Cultura/INAEM examinando exactamente el contenido de los 12 temas técnicos de María (`especifico-29` a `40`). No es contenido adyacente: es la fuente de mayor calidad posible para ese bloque, superior incluso a los temarios ya mapeados de `BOE-A-2022-23830`, porque aquí sí hay preguntas de tribunal con respuesta correcta, no solo epígrafes de contenido.

Con cuatro cuestionarios completos de esta familia, el bloque técnico —hoy sostenido solo por 10 preguntas de 2022 y 54 anclas de contenido sin preguntas— pasaría a tener banco real de examen oficial en prácticamente todos sus temas.
