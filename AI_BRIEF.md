# Brief para construir el clon de SKELETON

Eres la IA responsable de continuar una aplicación web personal de cuestionarios para una oposición. Debes usar este repositorio como base autocontenida y convertirlo en un clon específico de la convocatoria que entregue el usuario.

## Lo que ya existe

- Una SPA estática sin framework ni dependencias de producción.
- Modo libre, modo examen y modo Historia por temas.
- Feedback inmediato y progreso single-user en un adaptador sustituible.
- Preguntas y temario en JSON.
- Un ejemplo completo de legislación navegable con anclas permanentes.
- Validaciones de sintaxis y trazabilidad.

## Lo que tienes que hacer al recibir una nueva oposición

1. Identificar la convocatoria y separar los temas que entran de los que no entran.
2. Trabajar solo con fuentes oficiales aportadas por el usuario o enlaces oficiales.
3. Crear un manifiesto de leyes con metadatos de procedencia.
4. Convertir cada ley en HTML limpio, conservando el texto fuente y los bloques jurídicos.
5. Registrar anclas estables y comprobar que no hay duplicados.
6. Diseñar el temario en `data/syllabus.json`.
7. Generar preguntas con feedback y referencias a `lawId`, `anchorId` y referencia concreta.
8. Mantener el banco completo disponible para práctica y examen, y delimitar Historia por capítulos.
9. Sustituir el almacenamiento local por un adaptador cloud solo cuando el usuario lo pida; no mezclar identidad, contenido y progreso.
10. Ejecutar las validaciones y documentar cualquier ambigüedad.

## Primera respuesta esperada

Antes de editar, entrega un inventario: arquitectura reutilizable, archivos que son ejemplos, esquema de datos, fuentes necesarias, riesgos y plan de importación. Si faltan fuentes oficiales, detente y enumera exactamente qué falta.

## Prompt de continuación

> Revisa este repositorio completo y adapta SKELETON a mi nueva convocatoria. No borres el motor ni el contrato de datos sin justificarlo. Empieza por el inventario y no generes preguntas hasta que la legislación y el temario estén validados. Pregúntame solo por las fuentes que no puedan verificarse de forma oficial.
