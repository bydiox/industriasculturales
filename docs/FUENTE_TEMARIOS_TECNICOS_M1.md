# Temarios técnicos INAEM — especialidades M1

`data/sources/temarios-tecnicos-inaem-M1.json` conserva nueve temarios oficiales de especialidades M1 del INAEM:

- Gestión de Sastrería del Espectáculo en Vivo.
- Maquinaria Escénica para el Espectáculo en Vivo.
- Realización de Proyectos Audiovisuales y Espectáculos.
- Caracterización y Maquillaje Profesional.
- Estilismo y Dirección de Peluquería.
- Iluminación, Captación y Tratamiento de Imagen.
- Asistencia a la Dirección Técnica de Espectáculos en Vivo y Eventos.
- Sonido para Audiovisuales y Espectáculos.
- Utilería para el Espectáculo en Vivo.

No se incorporan como temas M3: son un corpus profesional de apoyo para los temas técnicos de espacio escénico, dirección de escenario, iluminación, sonido, vestuario y utilería. Las preguntas que se generen desde este material deberán llevar `source.kind: "referencia"`, citar la especialidad y el número de tema M1, y no presentarlo como legislación aplicable.

## Mapa oficial de correspondencias

`data/sources/inaem-m1-2022-mapping.json` y `data/sources/inaem-m1-2022.html` incorporan el desglose publicado en la Resolución de 27 de diciembre de 2022 (BOE-A-2022-23830) y un mapa editorial de correspondencias con los temas técnicos M3 (`especifico-29` a `especifico-40`).

El mapa no convierte un temario M1 en el temario de esta convocatoria: cada relación está graduada como `exacta`, `fuerte` o `parcial`, y sirve para localizar contenido profesional relacionado y escoger una referencia concreta para futuras preguntas. No se deben generar preguntas de M3 a partir de una correspondencia `parcial` sin comprobar antes que el enunciado pertenece realmente al tema de la convocatoria. El archivo no sustituye al syllabus M3 ni añade temas nuevos.

La fuente HTML conserva anclas estables con el formato `inaem-m1-2022-<especialidad>-t<n>`; el JSON mantiene la relación de cada ancla con el `topicId` M3 correspondiente. Las preguntas que usen estos bloques deben indicar que se trata de una referencia profesional oficial del INAEM, no de una norma jurídica vigente.
