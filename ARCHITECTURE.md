# Arquitectura de SKELETON

```text
data/
  syllabus.json              # 60 temas oficiales y bancos históricos
  study-units.json           # 19 unidades, pesos y reglas del modo Historia
  questions.json             # banco editorial
  laws/
    laws-manifest.json       # catálogo de normas
    *.html                   # texto fuente navegable
    metadata.json            # procedencia y versión
src/
  app.js                     # orquestación de interfaz y modos
  questions.js               # carga, filtros y selección
  progress-store.js          # adaptador single-user sustituible
styles/
  app.css                    # presentación
scripts/
  serve.mjs                  # servidor local
  validate-content.mjs       # trazabilidad del corpus
```

## Flujo de una pregunta

1. `questions.js` carga el banco.
2. El modo selecciona un subconjunto según `topicId`, unidad o banco completo.
3. `app.js` muestra opciones y feedback.
4. `progress-store.js` guarda agregados, temas y unidades aprobadas.
5. `source` permite abrir la norma y el ancla concreta.

## Sustitución por nube

Mantén la firma de `progressStore.load`, `save` y `reset`. Una implementación Supabase puede sustituir el módulo sin cambiar el formato de preguntas ni los componentes del test. En una app single-user no hace falta crear perfiles de oposición: basta con un identificador de usuario estable y una fila de progreso.

## Separación de estados

- Contenido: versionado en el repositorio.
- Progreso: datos del usuario, local o nube.
- Sesión activa: reanudable, pero con caducidad y tamaño acotado.
- Banco editorial: nunca debe mezclarse con el estado temporal de un intento.

## Progresión del modo Historia

1. Solo la primera unidad está disponible al comenzar.
2. Aprobar un cuestionario de tema desbloquea el siguiente tema de la unidad.
3. Completar todos sus temas habilita el cuestionario final.
4. Aprobar el final registra la unidad y desbloquea la siguiente.
5. Los bancos históricos quedan fuera de esta progresión.
