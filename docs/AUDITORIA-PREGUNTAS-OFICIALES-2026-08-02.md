# Auditoría de preguntas oficiales — 2 de agosto de 2026

Esta auditoría revisa las preguntas activas de procedencia oficial y las variantes propias basadas en exámenes oficiales. No modifica ni desactiva preguntas: deja separados los hallazgos confirmados de las comprobaciones que necesitan una plantilla o un acta oficial.

## Resultado ejecutivo

- Banco total: **1.872** preguntas; **1.117** activas.
- Preguntas activas que son originales oficiales (`origin.type: official_exam`): **446**.
- Variantes propias activas que conservan la procedencia oficial (`officialSource.kind: official_exam`): **74**.
- Todas las activas auditadas tienen **4 opciones**, una única respuesta correcta y explicación.
- No se ha encontrado una pregunta activa oficialmente anulada mediante los metadatos disponibles en el repositorio.
- Hay **3 reservas activas** del cuestionario común M3 de 2025. No se han tratado como anuladas: una reserva es una pregunta oficial válida, pero debe quedar identificada si el simulacro pretende reproducir solo las preguntas principales.
- Hay un duplicado literal de enunciado entre `m1c-2025-pool1-21` y `m1c-2025-pool3-21`. Es la misma pregunta común incluida en dos modelos; no se ha eliminado automáticamente.

## Cobertura por procedencia

| Procedencia | Activas | Clave oficial local o URL | Revisión editorial | Estado |
|---|---:|---:|---:|---|
| M1 Cultura 2025, parte común | 106 | 106 | 106 | **Verificadas contra plantillas incorporadas** |
| M1 Cultura 2025, parte específica | 12 | 0 | 0 | **Pendiente de plantilla definitiva por especialidad** |
| M1 Cultura 2023 y variantes de cuatro opciones | 48 (28 originales + 20 variantes) | — | 28 | La procedencia está conservada; las variantes llevan un cuarto distractor editorial |
| M3 Cultura 2025, parte común | 46 | 0 | 0 | **Pendiente de plantilla/acta incorporada**; incluye 3 reservas |
| INAP (Administrativo, GACE, ETGOA y EGOA) | 254 | 0 | 0 | Procedencia oficial declarada en los JSON importados; falta guardar la evidencia de clave en el repositorio |

Las variantes propias no se cuentan como nuevos exámenes oficiales: usan el mismo contenido de partida y se identifican con su propio `id` y `officialSource`.

## Hallazgos y decisiones

### 1. La migración a cuatro opciones es consistente

Las 446 oficiales originales activas y las 74 variantes activas tienen cuatro opciones. La auditoría no detecta opciones duplicadas ni más de una opción marcada como correcta. El motor puede barajarlas en pantalla; la posición almacenada no se usa como patrón de respuesta.

### 2. M1 2025: falta comprobar la modificación publicada posteriormente

El Ministerio de Cultura mantiene en la página oficial del proceso M1 una **“Modificación plantilla de respuestas”**, publicada el 24 de marzo de 2025, además de las plantillas iniciales. El repositorio conserva las plantillas iniciales utilizadas para reparar las 106 preguntas comunes, pero no conserva todavía esa modificación posterior. Por tanto, las 106 están verificadas contra la plantilla disponible, pero la verificación definitiva queda abierta hasta incorporar y contrastar la modificación.

Fuente oficial: [página del proceso selectivo M1 del Ministerio de Cultura](https://www.cultura.gob.es/servicios-a-la-ciudadania/catalogo/general/19/1986453/2024-turno-libre-promocion-interna-oep-2021-2022/1986453-2024-m1.html).

### 3. M1 2025 específico y M3 2025 común

Las preguntas tienen procedencia declarada, cuatro opciones y respuesta almacenada, pero no hay en el repositorio una plantilla definitiva enlazada por pregunta. No se desactivan porque la auditoría no ha demostrado que estén anuladas; se marcan como **pendientes de evidencia de clave**.

### 4. Preguntas INAP

Son exámenes oficiales útiles para el bloque común, pero no son el examen M3 de Industrias Culturales. Se conservan como material oficial de apoyo, no como prueba histórica de esta oposición. Antes de considerarlas “verificadas” conviene guardar el PDF o URL de cada plantilla y revisar que no haya correcciones posteriores.

### 5. Preguntas anuladas o invalidadas

No se ha inferido una anulación por palabras del enunciado. Solo se aceptarían como anuladas una resolución, acta o modificación oficial que identifique la pregunta. Los ocho descartes del paquete M1 Cultura 2023 ya constan en el README de importación como excluidos por actas del tribunal; falta conservar esas actas/PDF en el repositorio para que la trazabilidad sea reproducible.

## Qué queda pendiente

1. Incorporar la modificación definitiva de plantillas M1 publicada el 24/03/2025 y volver a comparar las 106 claves comunes.
2. Incorporar las plantillas definitivas de M1 específico y M3 2025 común; registrar `answerKeyFile`, `answerKeyUrl`, número y letra por pregunta.
3. Guardar las plantillas oficiales de INAP usadas en las 254 preguntas o, como mínimo, su URL oficial estable y fecha de consulta.
4. Decidir explícitamente si las 3 reservas M3 2025 participan en el simulacro aleatorio o solo en práctica libre/histórico.
5. Archivar las actas de anulación/corrección que ya se citan en los README de M1 2023.

La auditoría reproducible está en `scripts/audit-official-questions.mjs` y se ejecuta con `npm run content:audit:official`. Este informe y el script son locales; no se ha hecho ningún `push`.
