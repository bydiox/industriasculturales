# M3 · Gestión de Industrias Culturales y Creativas

Fork independiente de SKELETON para preparar la oposición M3 de Gestión de Industrias Culturales y Creativas.

La aplicación separa:

- `data/`: temario, preguntas, normas y fuentes oficiales.
- `data/official-exams/m3-2021/`: cuestionario, plantilla y supuesto práctico de una convocatoria oficial anterior.
- `data/exam-config.json`: reglas del ejercicio previstas en la convocatoria vigente incorporada al proyecto.
- `data/study-units.json`: distribución aprobada de las 19 unidades del modo Historia, pesos y reglas de desbloqueo.
- `data/editorial-rules.json`: controles de vigencia que impiden mezclar la organización antigua del INAEM o los dos regímenes del Estatuto del Artista.
- `data/orientation-guide.json`: explicación neutral mostrada desde la cabecera para orientar el uso y el estudio.
- `src/`: motor de cuestionarios, modos, feedback y progreso.
- `styles/`: presentación visual.
- `scripts/`: servidor local, validación e importación reproducible.

## Arranque

```text
npm run dev
```

Después abre `http://localhost:4173`.

## Banco oficial incorporado

Actualización: además del banco M3 de 2021, se han incorporado 32 preguntas oficiales del examen M3 de Ciencias de la Información del Ministerio de Igualdad (2023) y 571 preguntas oficiales M1 del Ministerio de Cultura (2023). El selector histórico agrupa las convocatorias y el examen aleatorio vigente excluye los cuestionarios de tres opciones.

El banco actual contiene 70 preguntas del primer ejercicio oficial M3 de 2021. Cada pregunta tiene un identificador estable `m3-2021-oficial-001` a `m3-2021-oficial-070` y un bloque `origin` que conserva resolución, número de pregunta, parte, página y documentos originales.

La interfaz las muestra como material histórico de comparación. Diez preguntas técnicas que coinciden con el temario vigente tienen además `active: true`: aparecen en Libre/Historia y siguen formando parte del examen histórico oficial. No deben interpretarse como una afirmación de que todo el temario o el formato de 2021 siga vigente. El cuestionario original tenía tres opciones por pregunta; se conserva ese formato.

El supuesto práctico oficial se conserva como PDF en `data/official-exams/m3-2021/supuesto-practico-3er-ejercicio.pdf` para revisarlo posteriormente.

Los cuestionarios M1 de Cultura se conservan en `data/historical-exams/m1-cultura-2023/`. Son material oficial de referencia técnica para los temas escénicos de M3, no una ampliación del temario ni legislación aplicable. Se han mantenido las tres opciones del examen original y se han aplicado las correcciones de plantilla descritas en su documentación.

El dossier de preparación del práctico está en `docs/practico_dossier_estudio.md`: reconstruye el supuesto histórico, propone tres familias de casos para el temario vigente y contiene plantillas de respuesta, normativa y rúbrica de entrenamiento.

La pantalla inicial incluye una Biblioteca de estudio con lector integrado, índice de apartados y navegación entre documentos; no depende de ventanas emergentes para las lecturas.

## Preguntas activas

El primer mundo del modo Historia (Constitución y organización del Estado) ya dispone de 30 preguntas propias distribuidas entre sus cinco temas. Cada una enlaza con un artículo anclado de la Constitución y muestra la opción «Ver ley» en la retroalimentación. Estas preguntas se usan en Libre y en Historia; las 70 oficiales siguen reservadas al examen histórico.

## Modo Historia

El itinerario contiene 19 unidades ordenadas por la distribución aprobada y reúne dentro de ellas los 60 temas oficiales. Los cuestionarios de tema se desbloquean en secuencia; al superar todos los temas de una unidad se habilita su prueba final, y aprobarla abre la siguiente unidad.

Los bancos históricos se conservan fuera de este recorrido y siguen disponibles mediante el selector `Examen · Históricos oficiales`.

En la unidad `INAEM y sus centros`, el tema 1 fija primero la estructura posterior a noviembre de 2025. Los estatutos históricos de los centros se estudian después como normas de base, aplicando sobre ellos la reforma de 2025: se conservan sus misiones y organización interna compatible, pero no se dan por actuales las adscripciones, órganos o competencias desplazados por el Real Decreto 1028/2025.

## Contrato de una pregunta

```json
{
  "id": "m3-2021-oficial-001",
  "topicId": "oficial-2021-comun",
  "prompt": "Pregunta oficial",
  "options": [
    { "id": "a", "text": "Opción A" },
    { "id": "b", "text": "Opción B" },
    { "id": "c", "text": "Opción C" }
  ],
  "correctOptionId": "b",
  "explanation": "Feedback y clave oficial.",
  "origin": {
    "type": "official_exam",
    "questionNumber": 1,
    "historical": true
  }
}
```

Las preguntas jurídicas futuras deben añadir además `source` con `lawId`, `anchorId` y referencia concreta. Las preguntas oficiales no jurídicas conservan su procedencia en `origin`.

## Validación

```text
npm run check
npm run content:validate
```

La validación comprueba identificadores, temas, unidades, pesos, opciones, respuestas y anclas jurídicas. Los temas que todavía no tengan preguntas producen avisos, pero no hacen fallar la construcción.

Para continuar el desarrollo, lee [`AI_BRIEF.md`](AI_BRIEF.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) y [`AGENTS.md`](AGENTS.md).

## Preguntas oficiales reutilizables

El campo `active: true` permite que una pregunta oficial historica tambien se use en Libre e Historia sin duplicarla en el examen historico. Se han promovido diez preguntas tecnicas del cuestionario oficial (telon Wagner, chácena, maquinaria, iluminacion, microfonia, sastreria y telon cortafuegos) porque encajan con los temas vigentes. El resto de preguntas oficiales mantiene exclusivamente su caracter historico.
