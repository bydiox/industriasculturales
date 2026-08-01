# Preguntas de referencia — cierre de los 10 temas pendientes

**30 preguntas de cuatro opciones**, tres por tema, que completan a `pool3` los diez temas específicos que ningún examen oficial cubre. Con esto el banco queda cerrado a `pool3` en los 60 temas.

Todas llevan `source.anchorId` verificado: se comprobó una por una que el ancla existe en el HTML incluido en este mismo paquete. **Cero anclas rotas.**

---

## Qué contiene

### `preguntas/` — 30 preguntas

| Tema | Preguntas | Fuente principal |
|---|---:|---|
| `especifico-08` Historia de la Danza | 3 | CDAEM |
| `especifico-09` Artes Circenses | 3 | Temarios técnicos INAEM |
| `especifico-10` Artes Visuales: exhibición, mercado y gestión | 3 | Anuario de Estadísticas Culturales |
| `especifico-19` Planificación: ejecución, gobernanza, evaluación | 3 | FEMP + Plan de Derechos Culturales |
| `especifico-21` Mercadotecnia cultural | 3 | FEMP + Anuario |
| `especifico-22` Comunicación y públicos | 3 | Anuario + FEMP |
| `especifico-23` Planificación y difusión comunicativa | 3 | FEMP + Plan |
| `especifico-24` Mediación, educación y participación | 3 | Plan de Derechos Culturales |
| `especifico-25` Programación y comisariado | 3 | Plan de Derechos Culturales |
| `especifico-27` Economía de la cultura | 3 | Componente 24 + Anuario |

Cubren el **8,16 % del examen**.

### `fuentes/` — 6 documentos, 159 anclas

| Fichero | Anclas | Qué es |
|---|---:|---|
| `fuente-anuario-estadisticas-2024.html` | 51 | Anuario de Estadísticas Culturales 2024, síntesis de indicadores. División de Estadística y Estudios, Ministerio de Cultura. NIPO 190-24-187-4 |
| `fuente-cdaem-danza.html` | 41 | CDAEM: fondos de danza, videoteca, bases de datos, Mapa del patrimonio de danza, publicaciones y funciones patrimoniales |
| `fuente-femp-indicadores.html` | 27 | Sistema de indicadores para la evaluación de las políticas culturales locales en el marco de la Agenda 21 de la cultura. FEMP y Ministerio de Cultura |
| `fuente-plan-derechos-culturales.html` | 26 | Plan de Derechos Culturales, Ministerio de Cultura, edición 2025. NIPO 190-25-128-3. Cinco ejes y 21 medidas desarrolladas |
| `inaem-m1-2022.html` | 134 | Temarios técnicos del INAEM (`BOE-A-2022-23830`), ya presente en el corpus. **Incluido porque tres preguntas anclan aquí** |
| `fuente-componente-24.html` | 7 | Plan de Recuperación, Componente 24: Revalorización de la industria cultural |

Todas se registran como fuentes de tipo **`referencia`**, no como normas: no son legislación y no deben entrar en `laws-manifest.json`.

---

## De dónde sale cada cosa

**CDAEM** — Centro de Documentación de las Artes Escénicas y de la Música, órgano documental del propio INAEM, con funciones reglamentadas por la Orden CUD/428/2019. Contenido transcrito de sus páginas institucionales (`musicadanza.es`), consultadas el 1 de agosto de 2026. Es la mayor autoridad posible en historia de la danza en España: su clasificación por géneros —flamenco, clásica, española, histórica, contemporánea, tradicional y danza-teatro— es la que emplea el Centro para estructurar sus fondos.

**FEMP** — El *Sistema de indicadores para la evaluación de las políticas culturales locales* es un proyecto conjunto de la Federación Española de Municipios y Provincias y el Ministerio de Cultura, primera realización a nivel internacional de las Recomendaciones de la Agenda 21 de la cultura. Aporta objetivos codificados (A1, B1, B2, C1) y fichas de indicador con definiciones cerradas, ideales para preguntas de definición.

**Plan de Derechos Culturales** — Documento oficial completo del Ministerio de Cultura, edición 2025, con NIPO. Estructura de cinco ejes con ámbitos de acción y medidas numeradas. Su medida 15 define el balance social y comunitario como herramienta para medir el retorno social: es literalmente el enunciado de `especifico-19`.

**Anuario de Estadísticas Culturales 2024** — Síntesis de indicadores de la División de Estadística y Estudios. Su epígrafe 15 se dedica a artes escénicas y musicales y cita al INAEM y al CDAEM como productores de la estadística.

**Componente 24** — Plan de Recuperación, palanca IX. Los tres ejes estratégicos del sector cultural.

---

## Criterios editoriales aplicados

**Regla de verificabilidad.** De los 35 enunciados de la parte específica del examen oficial M3 de 2022, 35 son de hecho comprobable y 0 de criterio. Ninguna de estas 30 pide juicio profesional: todas tienen respuesta verificable abriendo la fuente por su ancla.

**Sin datos con caducidad.** Ninguna pregunta cita cifras estadísticas concretas, aunque las fuentes las contienen. Los porcentajes y valores absolutos del Anuario se actualizan cada año y una pregunta sin el año en el enunciado caduca sola. Se ha preferido preguntar por lo estructural: qué operación estadística produce cada dato, qué mide cada instrumento, cómo se define cada concepto.

Única excepción: la pregunta de `especifico-10` sobre hábitos culturales compara la posición relativa entre actividades, no la cifra exacta. Aun así, es la más expuesta a revisión si cambian los datos.

**Distractores reales.** Todos son conceptos existentes del mismo campo semántico. En la pregunta sobre legados del CDAEM, los cuatro nombres —Vicente Escudero, Mariemma, Antonio Gades, Antonia Mercé— existen y todos aparecen en el Centro: solo Gades tiene fondo catalogado; los demás figuran en exposiciones o publicaciones. Se falla por no distinguir, no por no leer.

**Posición de la correcta** repartida: 4 en A, 8 en B, 11 en C, 7 en D.

**Explicación en todas.** Cada pregunta lleva `explanation` con la justificación citando el documento y el apartado concreto, no solo la respuesta.

---

## Integración

1. Cargar los seis HTML de `fuentes/` en `data/sources/` y registrarlos como fuentes `referencia`. `inaem-m1-2022.html` probablemente ya esté: no duplicar, comprobar antes por `sourceId`.
2. Fusionar `preguntas/` en `data/questions.json`. IDs con prefijo `ref-` para distinguirlas del material oficial.
3. Ejecutar `content:validate`, `content:validate:sources` y `content:pool`.

Estas preguntas **no llevan `lawId`, y es correcto**: no derivan de norma. Si el validador lo exige para algún tipo de fuente, la excepción ya está prevista con `source.kind: "referencia"`.

---

## Lo que sigue siendo débil, y conviene saberlo

**`especifico-09` (artes circenses)** es el tema más forzado del lote. No existe fuente institucional sobre circo: las tres preguntas se apoyan en la única mención localizable, los espacios efímeros del espectáculo de los temarios técnicos del INAEM, donde se encuadran las carpas de circo y las artes escénicas de calle. Son correctas y verificables, pero rozan tangencialmente el tema en vez de desarrollarlo. Con 0,51 % de peso es asumible; si aparece una fuente mejor, conviene sustituirlas.

**`especifico-21` (mercadotecnia)** y **`especifico-23` (difusión comunicativa)** se apoyan en el Sistema de indicadores de la FEMP, que es de **ámbito local**. La metodología es transferible al estatal, pero las preguntas están redactadas para no confundir ambos niveles. Aun así, es el punto donde más conviene una segunda lectura editorial.

**Todas las fuentes de este paquete son de ámbito de política cultural general**, no de artes escénicas específicamente. Es lo que hay: el temario pide contenidos de gestión cultural para los que no existe normativa ni examen oficial. Estas preguntas cubren el hueco con material institucional español verificable, que es el estándar más alto alcanzable para estos diez temas.
