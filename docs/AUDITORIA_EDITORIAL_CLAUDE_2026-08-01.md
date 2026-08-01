# Auditoría editorial para Claude · M3 Industrias Culturales

Este paquete contiene una app personal de preparación de la oposición **M3 · Gestión de Industrias Culturales y Creativas**. La app no es un producto comercial: es una herramienta de estudio para María.

La revisión que se pide no es técnica de diseño visual, sino **editorial y de contenido**.

## Objetivo de la revisión

Queremos saber si María puede estudiar con esta app sin confundirse:

- qué entra realmente en la convocatoria;
- qué es legislación principal;
- qué es fuente técnica o bibliográfica;
- qué es contexto;
- qué material conviene no priorizar;
- si el modo Historia conduce bien el estudio;
- si las preguntas se apoyan en fuentes adecuadas y no en anclas forzadas.

## Estado actual del banco

Validación ejecutada antes de empaquetar:

```text
npm run content:validate
npm run check
npm run content:test:exam
```

Resultado actual:

- 1871 preguntas totales.
- 1669 preguntas activas.
- 69 normas/fuentes en el manifiesto.
- 60 temas oficiales.
- 19 mundos/unidades de Historia.
- 1124 preguntas activas con 4 opciones.
- 545 preguntas activas con 3 opciones, normalmente procedentes de exámenes oficiales históricos o material oficial de comparación.

La app baraja las opciones al mostrar cada pregunta.

## Archivos clave para auditar

### Convocatoria y temario

- `data/syllabus.json`: 60 temas oficiales.
- `data/study-units.json`: agrupación en 19 mundos del modo Historia y pesos aprobados.
- `data/pool-target.json`: objetivo de banco por tema.
- `data/exam-config.json`: formato del examen y puntuación.

### Preguntas

- `data/questions.json`: banco completo.
- Las preguntas propias del examen vigente deben tener 4 opciones.
- Las preguntas históricas u oficiales de convocatorias anteriores pueden conservar 3 opciones si se muestran como históricas/comparativas.
- Si una pregunta oficial antigua se transforma en variante propia, debe tener 4 opciones y no confundirse con la original.

### Legislación y fuentes

- `data/laws/laws-manifest.json`: manifiesto de normas y fuentes.
- `data/laws/`: HTML de normas y fuentes importadas.
- `data/law-scopes.json`: qué partes de una ley/fuente se muestran por defecto como “lo que entra”.
- `data/study-scope.json`: brújula editorial: estudiar, estudiar parcial, fuente de apoyo, contexto o no prioritario.
- `data/history-reading.json`: lecturas previas de cada mundo de Historia.
- `data/topic-source-policy.json`: decisiones editoriales sobre temas técnicos/bibliográficos.

### Documentos explicativos

- `docs/MAPA_ESTUDIO_MODO_HISTORIA.md`: mapa mundo por mundo de qué debe estudiar María.
- `docs/FUENTES_SIN_CORPUS.md`: tratamiento de temas sin legislación.
- `docs/FUENTE_TEMARIOS_TECNICOS_M1.md`: uso de temarios técnicos INAEM/M1 como apoyo.
- `docs/GUIA_MARIA.md`: guía general preparada para María.
- `docs/practico_dossier_estudio.md`: hipótesis y preparación del supuesto práctico.

## Modelo editorial aplicado

La app distingue entre:

### 1. Legislación

Normas jurídicas que sí sirven como fuente directa de preguntas.

Ejemplo:

- Constitución Española.
- Ley 39/2015.
- Ley 40/2015.
- Ley 9/2017 de Contratos del Sector Público.
- IV Convenio Único.
- Ley 31/1995 de Prevención de Riesgos Laborales.

### 2. Legislación parcial

Normas que se conservan completas para trazabilidad, pero que María no debe estudiar enteras.

En el lector, cuando hay delimitación, la app muestra por defecto solo las anclas seleccionadas y ofrece un botón para “Ver norma completa”.

Esto se controla en:

```text
data/law-scopes.json
```

Punto importante: la delimitación actual se ha hecho de forma conservadora a partir de anclas ya usadas por preguntas trazadas. Si una norma todavía no tiene anclas suficientes, no se recorta automáticamente.

### 3. Fuentes técnicas o bibliográficas

Material que ayuda a estudiar temas que no nacen de una ley.

Ejemplos:

- Temarios técnicos INAEM/M1.
- Cualificaciones profesionales.
- Fuentes del Ministerio de Cultura.
- Estadísticas culturales.
- Referencias profesionales o académicas.

No deben presentarse como legislación.

### 4. Contexto

Material útil para entender cambios, vigencias o reformas, pero que no debe memorizarse como núcleo del test.

Ejemplos:

- RD 607/2026 como reforma futura del régimen artístico.
- RD 2084/1978 de OCNE como norma histórica/obsoleta.
- Estatutos antiguos de centros cuando puedan estar desfasados por la reorganización reciente del INAEM.

### 5. No prioritario

Material marginal que puede aparecer como contexto o fuente de una pregunta concreta, pero que no debe desplazar lo importante.

Ejemplo:

- Becas JONDE, salvo que se justifique muy bien su presencia.

## Lo que nos preocupa especialmente

### A. Que María no estudie de más

Si una ley es enorme y solo entran algunos artículos, queremos que la app muestre por defecto solo lo que debe estudiar.

Revisar:

- si `data/law-scopes.json` recorta demasiado;
- si recorta demasiado poco;
- si hay normas marcadas como “texto completo” que deberían tener selección;
- si alguna selección se basa en preguntas actuales pero la convocatoria exige más.

### B. Que no se fuerce legislación donde no toca

Los temas de historia de las artes, públicos, programación, dirección de escenario, técnica escénica o tecnología aplicada no siempre tienen ley. Es preferible una fuente bibliográfica honesta a una ancla jurídica falsa.

Revisar especialmente:

- `especifico-06` a `especifico-10`;
- `especifico-21` a `especifico-25`;
- `especifico-29` a `especifico-40`;
- `especifico-42`.

### C. Que el modo Historia sea útil

Cada mundo debería dejar claro:

- qué temas oficiales agrupa;
- qué debe leer María antes de contestar;
- qué parte es legislación;
- qué parte es fuente de apoyo;
- qué no debe estudiar como núcleo.

Revisar:

- `data/study-units.json`;
- `data/history-reading.json`;
- `data/study-scope.json`;
- `docs/MAPA_ESTUDIO_MODO_HISTORIA.md`.

### D. Que el banco no mezcle examen vigente con histórico

Las preguntas históricas son útiles, pero no deben deformar el simulacro vigente.

Revisar:

- preguntas con `origin.type: "official_exam"`;
- preguntas con `origin.historical: true`;
- preguntas activas de 3 opciones;
- variantes propias derivadas de preguntas oficiales antiguas.

### E. Que las preguntas sean de oposición

Evitar preguntas tipo:

- “¿Qué regula el artículo X?”
- distractores absurdos;
- respuestas correctas mucho más largas;
- preguntas de criterio subjetivo;
- preguntas sin fuente clara cuando podrían tenerla.

El estilo objetivo debería ser: hecho comprobable, concepto concreto, atribución, clasificación, plazo, órgano, definición o consecuencia jurídica/profesional.

## Preguntas concretas para Claude

1. ¿La separación entre legislación, fuente de apoyo, contexto y no prioritario está bien hecha?
2. ¿Hay alguna ley que María no debería ver completa y que aún aparece como completa?
3. ¿Hay alguna ley recortada que debería mostrarse con más artículos?
4. ¿Hay alguna fuente que esté tratada como ley sin serlo?
5. ¿El modo Historia explica bien qué se estudia en cada mundo?
6. ¿Hay mundos que deberían reordenarse o reagruparse?
7. ¿Las preguntas activas cubren el temario real o hay inflación artificial por preguntas históricas/oficiales?
8. ¿Hay preguntas con anclas jurídicamente débiles o bibliografía insuficiente?
9. ¿Hay material que convendría marcar como “contexto” o “no prioritario” para no confundir a María?
10. ¿Qué tres mejoras editoriales darían más valor ahora mismo?

## Forma esperada de respuesta

Se pide una auditoría accionable. Para cada hallazgo:

- archivo;
- identificador de tema, ley, fuente o pregunta;
- problema;
- propuesta concreta;
- prioridad: alta, media o baja.

No hace falta corregir archivos directamente. Lo importante es detectar si María puede estudiar mejor y con menos ruido.

