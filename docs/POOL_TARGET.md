# Objetivo operativo del banco

El banco no intenta reproducir la proporción común/específica. La proporción se aplica al seleccionar cada examen mediante el blueprint; el banco solo necesita tener suficiente variedad por tema.

`data/pool-target.json` define tres suelos:

- `pool3`: preguntas suficientes para tres simulacros sin repetir dentro de cada tema.
- `pool5`: referencia para cinco simulacros.
- `pool8`: referencia amplia para ocho simulacros.

Un tema a cero es un bloqueo duro: no puede muestrearse. Un tema por debajo de `pool3` puede practicarse, pero repetirá preguntas. Las preguntas válidas no se eliminan por superar un suelo.

## Auditoría

```text
npm run content:pool
```

El informe devuelve el recuento activo por tema, los déficits frente a `pool3` y `pool5`, y los temas a cero. `data/coverage-target.json` queda conservado únicamente como referencia histórica y ya no participa en la validación.

## Simulacro proporcional

El modo Examen aleatorio aplica las cuotas de `data/pool-target.json` y el total definido en `data/exam-config.json`. Si un tema no tiene suficientes preguntas activas, el generador no redistribuye su cuota entre otros temas: selecciona solo las disponibles y muestra un aviso durante el cuestionario y en el resultado. Así no se presenta como examen completo un simulacro cuyo reparto está incompleto.
