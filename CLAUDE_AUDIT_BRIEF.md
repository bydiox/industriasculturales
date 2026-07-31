# Informe para auditoría de Claude

## Proyecto

Aplicación personal de preparación de la oposición **M3 · Gestión de Industrias Culturales y Creativas**.

Ruta local del proyecto:

```text
C:\Users\madrid\Documents\Consultor digital\M3-Gestion-Industrias-Culturales-y-Creativas
```

ZIP completo para auditoría:

```text
C:\Users\madrid\Documents\Consultor digital\M3-Gestion-Industrias-Culturales-y-Creativas-audit.zip
```

Si el entorno de Claude comparte este ordenador, debe intentar abrir primero la carpeta del proyecto. Si no puede acceder a ella, utilizar el ZIP.

## Estado actual comprobado

- 387 preguntas en `data/questions.json`.
- 69 normas en `data/laws/laws-manifest.json`.
- 60 temas oficiales.
- 19 unidades del modo Historia.
- 314 preguntas activas; 73 históricas excluidas de la práctica activa.
- Material oficial histórico de 2021 separado del banco activo.
- Planos y esquemas prácticos en `assets/practico/`.
- Progreso y motor de la aplicación separados del contenido editorial.

La validación actual termina correctamente con:

```text
Contenido válido: 387 preguntas, 69 normas, 60 temas oficiales y 19 unidades de Historia.
```

## Cambios realizados

### Corpus legislativo

Se incorporaron 37 normas que estaban en el paquete paralelo de trabajo pero no estaban importadas de forma utilizable en la aplicación activa. Se conservaron las normas que ya existían y se evitaron duplicados semánticos.

También se añadió `data/laws/laws-backlog.json`, que distingue las fuentes ya importadas de las que siguen pendientes de verificación.

### Material práctico

Se añadieron al inicio de la aplicación:

- Esquema de teatro a la italiana.
- Esquema de configuración invertida.
- Plano del Teatro de la Zarzuela en configuración normal.
- Plano de la configuración de *La Gatita*.

### Preguntas nuevas

Se añadieron 33 preguntas con fuente y ancla sobre:

- ONE y JONDE.
- Prevención y autoprotección.
- Mecenazgo.
- Propiedad intelectual.
- Patrimonio cultural.
- Igualdad y planes de igualdad.
- Accesibilidad.
- Presupuestos y subvenciones.

No se generaron preguntas artificiales para todas las normas. Las fuentes pendientes —TUE, TFUE, Reglamento de IA y convenciones UNESCO— siguen sin preguntas hasta verificar su fuente oficial y sus anclas.

### Cobertura activa actual

Comparada con `data/coverage-target.json`:

- Banco activo antes de la auditoría de pertinencia: 314 preguntas (153 comunes y 161 específicas).
- Banco activo tras retirar 20 preguntas con ancla forzada: 294 preguntas (153 comunes y 141 específicas).
- Los 20 registros se conservan en `data/questions.json` con `active: false` y quedan documentados en `data/editorial-rejections.json`.
- Los seis temas técnicos auditados quedan a cero de forma deliberada hasta importar bibliografía profesional adecuada.

El objetivo de cobertura es una guía editorial y de planificación; no hace fallar el build.

### Reproducibilidad

Scripts relevantes:

- `scripts/merge-corpus-from-fork.mjs`: fusiona el corpus legislativo y los materiales prácticos.
- `scripts/add-corpus-questions.mjs`: incorpora el bloque de preguntas seleccionadas de forma idempotente.
- `scripts/validate-content.mjs`: valida preguntas, anclas, normas, temas e Historia.
- `scripts/normalize-source-status.mjs`: marca fuentes históricas, institucionales y modificativas y actualiza las referencias EUR-Lex.
- `scripts/audit-coverage.mjs`: compara el banco activo con `data/coverage-target.json` y muestra ceros, déficits y temas bajo el umbral.
- `scripts/audit-source-relevance.mjs`: comprueba que las preguntas activas de los temas auditados solo usen fuentes permitidas por `data/topic-source-policy.json`.

Comandos de comprobación:

```text
npm run content:validate
npm run content:coverage
npm run content:audit:sources
npm run check
```

## Pendientes conocidos

- Hay temas oficiales que todavía no tienen preguntas activas.
- Hay avisos de anclas utilizadas por varias preguntas; no son errores bloqueantes, pero deben revisarse editorialmente.
- Magalia y la página de centros del INAEM tienen fuente institucional, pero no son normas con articulado; sus preguntas están marcadas como contexto institucional.
- El Real Decreto 2084/1978 sobre la OCNE se conserva solo como fuente histórica y sus tres preguntas ya no aparecen en la práctica activa; la referencia vigente es el Real Decreto 1245/2002.
- Las dos preguntas sobre becas JONDE se conservan activas como contexto, pero están marcadas para que no desplacen las preguntas nucleares del tema 3.
- Los estatutos de centros anteriores a la reforma del INAEM de 2025 deben distinguirse de la organización vigente.
- Las preguntas futuras deben mantener siempre `lawId`, `anchorId`, referencia jurídica y explicación.
- En contenidos técnico-artísticos sin fuente legal directa no se debe forzar un `lawId`: se incorporará bibliografía profesional o material docente verificable y se indicará su referencia.

### Promoción de preguntas oficiales técnicas

Diez preguntas del examen oficial se han reclasificado hacia los temas técnicos vigentes y llevan `active: true`, conservando simultáneamente `origin.type: "official_exam"` y `origin.historical: true`. Así aparecen en práctica e Historia sin duplicarse y siguen entrando en el selector de examen histórico. La cobertura activa pasa a 304 preguntas: 153 comunes y 151 específicas.

### Cierre de cinco temas con fuentes disponibles

Se han añadido 18 preguntas activas para `especifico-12`, `14`, `15`, `20` y `42`. Las preguntas de carga mental y estrés usan NTP oficiales del INSST como bibliografía; las de estadísticas usan el Anuario y la Cuenta Satélite del Ministerio de Cultura. El marco jurídico se mantiene separado y enlazado mediante `lawId` y `anchorId` cuando procede. Después se añadieron 16 preguntas comunes de refuerzo: el banco activo queda en 338 preguntas, con 169 comunes y 169 específicas.

## Instrucciones para la auditoría

No modificar archivos durante la auditoría. Comprobar:

1. Cobertura real por tema y por norma.
2. Validez de todas las anclas.
3. Corrección jurídica de las preguntas nuevas.
4. Calidad y longitud comparable de los distractores.
5. Tratamiento temporal de los estatutos anteriores a 2025 y del régimen artístico.
6. Funcionamiento del modo Historia, práctica libre, examen histórico y examen aleatorio.
7. Ausencia de mezclas entre la oposición M3 y otros proyectos.

Toda incidencia debe indicar ruta de archivo, identificador de pregunta o norma y motivo concreto.
