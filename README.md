# M3 Â· GestiÃ³n de Industrias Culturales y Creativas

Fork independiente de SKELETON para preparar la oposiciÃ³n M3 de GestiÃ³n de Industrias Culturales y Creativas.

La aplicaciÃ³n separa:

- `data/`: temario, preguntas, normas y fuentes oficiales.
- `data/official-exams/m3-2021/`: cuestionario, plantilla y supuesto prÃ¡ctico de una convocatoria oficial anterior.
- `data/exam-config.json`: reglas del ejercicio previstas en la convocatoria vigente incorporada al proyecto.
- `data/study-units.json`: distribuciÃ³n aprobada de las 19 unidades del modo Historia, pesos y reglas de desbloqueo.
- `data/editorial-rules.json`: controles de vigencia que impiden mezclar la organizaciÃ³n antigua del INAEM o los dos regÃ­menes del Estatuto del Artista.
- `data/orientation-guide.json`: explicaciÃ³n neutral mostrada desde la cabecera para orientar el uso y el estudio.
- `src/`: motor de cuestionarios, modos, feedback y progreso.
- `styles/`: presentaciÃ³n visual.
- `scripts/`: servidor local, validaciÃ³n e importaciÃ³n reproducible.

## Arranque

```text
npm run dev
```

DespuÃ©s abre `http://localhost:4173`.

## Banco oficial incorporado

El banco actual contiene 70 preguntas del primer ejercicio oficial M3 de 2021. Cada pregunta tiene un identificador estable `m3-2021-oficial-001` a `m3-2021-oficial-070` y un bloque `origin` que conserva resoluciÃ³n, nÃºmero de pregunta, parte, pÃ¡gina y documentos originales.

La interfaz las muestra como material histÃ³rico de comparaciÃ³n. No deben interpretarse como una afirmaciÃ³n de que el temario o el formato de 2021 siga vigente. El cuestionario original tenÃ­a tres opciones por pregunta; se conserva ese formato.

El supuesto prÃ¡ctico oficial se conserva como PDF en `data/official-exams/m3-2021/supuesto-practico-3er-ejercicio.pdf` para revisarlo posteriormente.

## Modo Historia

El itinerario contiene 19 unidades ordenadas por la distribuciÃ³n aprobada y reÃºne dentro de ellas los 60 temas oficiales. Los cuestionarios de tema se desbloquean en secuencia; al superar todos los temas de una unidad se habilita su prueba final, y aprobarla abre la siguiente unidad.

Los bancos histÃ³ricos de 2021 se conservan fuera de este recorrido y siguen disponibles mediante el selector `Examen Â· HistÃ³rico oficial 2021`.

En la unidad `INAEM y sus centros`, el tema 1 fija primero la estructura posterior a noviembre de 2025. Los estatutos histÃ³ricos de los centros se estudian despuÃ©s como normas de base, aplicando sobre ellos la reforma de 2025: se conservan sus misiones y organizaciÃ³n interna compatible, pero no se dan por actuales las adscripciones, Ã³rganos o competencias desplazados por el Real Decreto 1028/2025.

## Contrato de una pregunta

```json
{
  "id": "m3-2021-oficial-001",
  "topicId": "oficial-2021-comun",
  "prompt": "Pregunta oficial",
  "options": [
    { "id": "a", "text": "OpciÃ³n A" },
    { "id": "b", "text": "OpciÃ³n B" },
    { "id": "c", "text": "OpciÃ³n C" }
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

Las preguntas jurÃ­dicas futuras deben aÃ±adir ademÃ¡s `source` con `lawId`, `anchorId` y referencia concreta. Las preguntas oficiales no jurÃ­dicas conservan su procedencia en `origin`.

## ValidaciÃ³n

```text
npm run check
npm run content:validate
```

La validaciÃ³n comprueba identificadores, temas, unidades, pesos, opciones, respuestas y anclas jurÃ­dicas. Los temas que todavÃ­a no tengan preguntas producen avisos, pero no hacen fallar la construcciÃ³n.

Para continuar el desarrollo, lee [`AI_BRIEF.md`](AI_BRIEF.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) y [`AGENTS.md`](AGENTS.md).
