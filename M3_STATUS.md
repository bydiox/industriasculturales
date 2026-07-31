# Estado del fork M3

## Identidad

- Oposición: M3 · Gestión de Industrias Culturales y Creativas.
- Aplicación: single-user.
- Base técnica: SKELETON 0.1.0.

## Banco incorporado

Actualización: el banco histórico incluye también 32 preguntas oficiales M3 del Ministerio de Igualdad (2023). Se conservan con tres opciones, se identifican por su convocatoria y no entran en el examen aleatorio vigente.

Se han incorporado 571 preguntas oficiales M1 del Ministerio de Cultura (2023), procedentes de nueve cuestionarios técnicos y sus plantillas definitivas. Se conservan con tres opciones y procedencia M1; el examen aleatorio vigente las excluye por formato, mientras que Libre, Historia y el selector de históricos las pueden mostrar.

Se han importado 70 preguntas del primer ejercicio oficial de la convocatoria de 2021:

- Resolución de 28 de julio de 2021, de la Secretaría de Estado de Función Pública.
- Publicación: BOE núm. 182, de 31 de julio de 2021.
- 35 preguntas de la parte común y 35 de la parte específica.
- Tres opciones por pregunta, una correcta, según el cuestionario original.
- Clave de respuestas comprobada contra `plantilla-respuestas.pdf`.
- Identificadores estables: `m3-2021-oficial-001` a `m3-2021-oficial-070`.
- Procedencia completa en `origin`, con número, página, resolución y documentos de origen.

Estas preguntas se conservan fuera del modo Historia y están disponibles mediante `Examen · Histórico oficial 2021`. Se muestran como material de práctica y comparación, no como temario vigente: la convocatoria puede haber cambiado.

## Modo Historia

- 19 unidades con los pesos aprobados, que suman 100,05 por redondeo.
- 60 temas oficiales asignados una sola vez.
- Progresión secuencial por tema y cuestionario final de unidad.
- Umbral de aprobado: 70 % y todas las preguntas respondidas.
- Los temas sin preguntas aparecen como pendientes y generan avisos, no errores de construcción.

## Material oficial conservado

`data/official-exams/m3-2021/` contiene el cuestionario, la plantilla de respuestas y el supuesto práctico de la documentación recibida.

Se ha incorporado además el desglose técnico oficial del INAEM publicado en 2022 (`data/sources/inaem-m1-2022.html`) y su mapa de correspondencias editoriales con los temas técnicos M3 (`data/sources/inaem-m1-2022-mapping.json`). Es material profesional de referencia, no legislación ni una ampliación del temario M3.

## Verificaciones ejecutadas

- `npm run check`
- `npm run content:validate`
- Interfaz local comprobada en escritorio y móvil, sin desbordamiento horizontal.
- Examen histórico comprobado: conserva 70 preguntas en el orden oficial.

## Próximo trabajo

1. Incorporar la legislación y las fuentes técnicas propias del temario vigente.
2. Generar preguntas propias con referencias trazables y feedback editorial.
3. Cubrir progresivamente los 60 temas para activar el recorrido completo.
