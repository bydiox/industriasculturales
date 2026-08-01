# Formato del primer ejercicio

La convocatoria vigente define un cuestionario de 100 preguntas, con cuatro respuestas alternativas y una sola correcta. La puntuación máxima es de 40 puntos, el mínimo es de 20, las respuestas incorrectas descuentan un tercio del valor de una correcta y las respuestas en blanco no descuentan.

## Estado de la migración

La auditoría actual devuelve:

- 421 preguntas activas;
- 204 preguntas propias con cuatro opciones;
- 164 preguntas propias todavía pendientes de añadir un cuarto distractor editorialmente válido;
- 53 preguntas oficiales históricas activadas para práctica, que conservan legítimamente sus tres opciones de origen (21 del banco anterior y 32 del Ministerio de Igualdad, 2023).

Las preguntas históricas de 2021 siguen disponibles en el modo histórico y libre. El modo Examen aleatorio solo selecciona preguntas con cuatro opciones; mientras el banco no se migre, muestra un aviso y no redistribuye el peso de las preguntas que faltan.

## Orden de migración

La primera tanda se priorizar? por peso del blueprint: `comun-13`, `comun-10`, `comun-07`, `comun-03`, `comun-04` y `comun-09`. Son preguntas legislativas con ancla, por lo que el cuarto distractor debe salir del mismo texto legal y pasar la revisi?n de pertinencia.

Regla editorial corregida: **no se a?aden nuevos distractores a preguntas espec?ficas que no tengan legislaci?n o una fuente oficial textual equivalente de la que pueda salir el distractor**. Si una pregunta espec?fica procede de un examen hist?rico de tres opciones y no tiene base normativa suficiente, se conserva en modo hist?rico/libre o como borrador, pero no se fuerza al formato de cuatro opciones para el simulacro actual.

El progreso no guarda índices de opción: `src/progress-store.js` conserva únicamente contadores agregados y el estado de Historia. El motor baraja las opciones al mostrar cada pregunta y la respuesta se evalúa por `optionId`, por lo que la posición visible no forma parte del estado.

## Hitos de desbloqueo

El examen parcial se habilita al alcanzar el 50 % de cobertura, equivalente al hito de 15 temas migrados. Los hitos de referencia son 25 % (6 temas), 50 % (15), 75 % (32) y 89,34 % (48). Los 12 temas vacíos impiden llegar al 100 % hasta que se creen sus preguntas.

Comandos de control:

```text
npm run content:audit:format
npm run content:audit:options
npm run content:test:scoring
npm run content:test:options
```

La auditoría de opciones detecta textos o IDs duplicados y, cuando existan preguntas de cuatro opciones, informa de la distribución almacenada de la respuesta correcta entre las posiciones A-D. La interfaz vuelve a barajar las opciones en cada renderizado; no se fuerza una posición fija.

No se a?adir? un distractor gen?rico o absurdo para cerrar una cifra. En legislaci?n, cada cuarta opci?n debe salir del mismo texto legal o de una norma cercana. En temas espec?ficos sin legislaci?n, la pregunta no se completar? artificialmente.

## Pasada editorial del primer lote

Los lotes jurídico común y jurídico específico suman 204 preguntas migradas y se auditaron con `npm run content:audit:editorial`. El indicador heurístico del primer lote identifica 83 enunciados de dato concreto y uno definicional amplio; además se revisaron manualmente preguntas especialmente sensibles (principios de contratación, actos del artículo 288 TFUE, plazo del artículo 21.3 de la Ley 39/2015, jornada anual del IV Convenio, LCSP, CTE, INAEM, Ley 40/2015, Estatuto del Artista, mecenazgo y propiedad intelectual). Las futuras tandas deben mantener el predominio de hechos comprobables —plazos, órganos, mayorías, requisitos, efectos y cifras— y evitar distractores jurídicamente absurdos o distinguibles por estilo.
