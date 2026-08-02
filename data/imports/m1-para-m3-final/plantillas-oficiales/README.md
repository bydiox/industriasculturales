# Plantillas oficiales M1 de 2025

Estos tres PDF proceden del Ministerio de Cultura y son la fuente de verdad para
el campo `correctOptionId` de las preguntas `m1c-2025-*`.

- `plantilla-m1-tl-maquinaria-escenica.pdf`: Maquinaria Escénica para el Espectáculo en Vivo, 18 de febrero de 2025.
- `plantilla-m1-tl-guia.pdf`: Guía, Información y Asistencia Turística, 18 de febrero de 2025.
- `plantilla-m1-tl-imagen.pdf`: Iluminación, Captación y Tratamiento de Imagen, 19 de febrero de 2025.

La revisión del 2 de agosto de 2026 detectó que la importación inicial había
asignado una plantilla equivocada a parte de las preguntas. El script
`scripts/repair-m1-2025-official-answer-keys.mjs` cruza especialidad y número
original, corrige la letra y añade a cada pregunta la ruta y la URL de su
plantilla. El validador impide que esas claves vuelvan a separarse.

Una pregunta oficial puede conservarse aunque no tenga `anchorId`: en ese caso
su procedencia verificable es el cuestionario y su plantilla oficial. El
`lawId`, cuando existe, sirve para clasificarla y abrir el material de estudio,
pero no se presenta como una falsa ancla jurídica exacta.
