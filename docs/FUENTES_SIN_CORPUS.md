# Fuentes pendientes para los 14 temas sin corpus

El lote `pool3` ha cubierto los temas que ya tenían corpus jurídico o CNECP. Los 14 temas siguientes siguen a cero y no se generarán preguntas hasta fijar una fuente editorial verificable.

## Fuentes institucionales ya identificadas

### Historia de las artes · `especifico-06` a `especifico-10`

El **Centro de Documentación de las Artes Escénicas y de la Música (CDAEM)** es una unidad del INAEM que reúne documentación de teatro, circo, música y danza. La fuente institucional explica su creación y su función de inventariado, catalogación y difusión del patrimonio documental: [CDAEM e INAEM](https://www.cultura.gob.es/cultura/artesescenicas/contenedora-noticias-prensa/a2019/abril/cdaem.html). Sus publicaciones y catálogos pueden servir para anclas bibliográficas, pero todavía hay que seleccionar obras y apartados concretos antes de convertirlos en preguntas.

Para `especifico-10` (artes visuales) se revisarán además catálogos y publicaciones de museos estatales del Ministerio de Cultura; no se asumirá que una fuente de artes escénicas cubra automáticamente artes visuales.

### Públicos, comunicación y programación · `especifico-21` a `especifico-25`

La **Encuesta de Hábitos y Prácticas Culturales en España** es una operación estadística oficial del Ministerio de Cultura, incluida en el Plan Estadístico Nacional. Su ficha describe población, periodicidad, muestreo y variables de participación, satisfacción, motivos y barreras: [metodología EHPC](https://www.cultura.gob.es/servicios-al-ciudadano/estadisticas/cultura/mc/culturabase/encuesta-de-habitos/metodologia-habitos.html). Los resultados 2024-2025 incluyen apartados específicos de artes escénicas, música, participación activa y equipamientos: [resultados EHPC 2024-2025](https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/culturabase/encuesta-de-habitos/resultados-habitos/2024-2025.html).

Esta fuente sirve para indicadores y análisis de públicos; no cubre por sí sola segmentación, posicionamiento, diseño de campañas o comisariado artístico. Esos subapartados requerirán bibliografía profesional adicional.

## Pendientes de decisión editorial

- `especifico-13`: políticas y modelos culturales, gobernanza y economía creativa.
- `especifico-18` y `especifico-19`: planificación estratégica, evaluación y retorno social.
- `especifico-27`: economía de la cultura e industrias culturales y creativas.

Para estos cuatro temas se buscarán primero estrategias y estadísticas oficiales del Ministerio de Cultura, INAEM, Unión Europea y organismos internacionales. Hasta identificar apartados estables, se mantendrán a cero y no se usarán anclas jurídicas de conveniencia.

## Criterio para la siguiente importación

Cada fuente deberá tener institución autora, título, URL estable, fecha o edición y un apartado local con `anchorId`. Las preguntas se etiquetarán como `bibliografia` y explicarán si la fuente aporta una definición, una metodología, un indicador o un marco de política cultural. No se presentarán datos estadísticos de una edición concreta como si fueran una regla permanente.

Para contenidos académicos o profesionales sin ancla institucional estable se admite además `source.kind: "referencia"`, con `reference`, autoría o edición cuando se conozcan y, opcionalmente, URL y localizador bibliográfico. Estas preguntas no se presentarán como legislación ni como fuente oficial; el objetivo es declarar honestamente el origen académico o profesional.
