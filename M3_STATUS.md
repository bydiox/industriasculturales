# Estado del fork M3

## Identidad

- Oposición: M3 · Gestión de Industrias Culturales y Creativas.
- Aplicación: single-user.
- Base técnica: SKELETON 0.1.0.

## Banco incorporado

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

## Verificaciones ejecutadas

- `npm run check`
- `npm run content:validate`
- Interfaz local comprobada en escritorio y móvil, sin desbordamiento horizontal.
- Examen histórico comprobado: conserva 70 preguntas en el orden oficial.

## Próximo trabajo

1. Incorporar la legislación y las fuentes técnicas propias del temario vigente.
2. Generar preguntas propias con referencias trazables y feedback editorial.
3. Cubrir progresivamente los 60 temas para activar el recorrido completo.
