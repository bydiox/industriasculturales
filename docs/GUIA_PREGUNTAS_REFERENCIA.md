# Guía editorial: preguntas `source.kind: "referencia"`

Esta guía se aplica a los temas sin corpus normativo: públicos y programación, historia de la danza, circo y artes visuales, planificación estratégica y producción, políticas y economía de la cultura.

## Regla principal

Una pregunta de `referencia` debe tener una respuesta correcta comprobable, no una respuesta razonable. Si dos profesionales competentes pueden discrepar, el enunciado no sirve.

El patrón del tribunal es preguntar por hechos verificables del vocabulario profesional:

- definición de un término;
- atribución de una obra, autor o característica;
- identificación de una diferencia;
- clasificación;
- localización.

No se usarán preguntas de opinión, mejor práctica, decisión profesional o «qué haría usted».

Ejemplos válidos: «¿Qué analiza la matriz DAFO?» o «¿Qué mide el retorno social de la inversión (SROI)?».

Ejemplos que se descartan: «¿Cuál es la mejor política de precios?» o «¿Cómo debe estructurarse un plan de mediación?».

## Campo `reference`

Cada pregunta debe nombrar una fuente localizable: obra y autor con edición, o institución y documento. No se acepta «bibliografía general» ni «conocimiento del sector».

La referencia debe permitir que una tercera persona compruebe la respuesta sin tener que interpretar el criterio del autor. Se usará una única fuente por pregunta; si hacen falta dos para sostenerla, se revisará el enunciado.

Formato recomendado:

```json
{
  "kind": "referencia",
  "reference": "Autor o institución, título",
  "author": "Autor o institución",
  "edition": "Edición o año",
  "locator": "Capítulo, página o apartado",
  "url": "https://..."
}
```

## Distractores y dificultad

- Tres opciones reales del mismo campo semántico.
- Longitud comparable; la correcta no debe destacar por extensión.
- No usar distractores absurdos ni conceptos inventados.
- Rotar la posición de la respuesta correcta.
- Mantener el nivel de vocabulario profesional del examen, sin convertir estos temas en una historia general de las artes.

La guía no sustituye la revisión humana: la validación automática comprueba la declaración de la fuente y detecta patrones de opinión, pero no decide por sí sola si el contenido es verdadero.
