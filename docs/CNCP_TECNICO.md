# Fuentes técnicas CNCP del bloque escénico

La selección de `data/sources/cncp-technical.html` sirve para estudiar los temas técnicos de M3 y preparar preguntas con procedencia verificable. El nombre de archivo se conserva por estabilidad, aunque el marco vigente desde 2025 es el CNECP.

## Qué se ha incorporado

- Producción y regiduría: IMS437_3 e IMS442_3, establecidas y actualizadas mediante el RD 1957/2009 y la Orden PCI/477/2019.
- Maquinaria y decorado: ART524_3 y ART523_3, del RD 145/2011.
- Luminotecnia: IMS075_3, con su cadena de origen y actualización (RD 295/2004, RD 1200/2007 y Orden PCI/797/2019).
- Vídeo y software escénico: contenidos de la actualización de 2024 (RD 918/2024).
- Correspondencia temporal de estándares: RD 532/2025.
- Marco vigente y asimilación de las antiguas unidades: RD 69/2025.
- Corrección de errores del RD 532/2025: BOE-A-2025-23619.

## Equivalencia de nomenclatura

El CNCP anterior utilizaba códigos de **unidades de competencia** (`UC`). El CNECP utiliza **estándares de competencias profesionales** (`ECP`). El RD 69/2025 establece la asimilación automática de las antiguas unidades a estándares; por eso los contenidos históricos siguen siendo aprovechables, pero no conviene presentar `UC` como la nomenclatura vigente. En una pregunta nueva se preferirá el código `ECP` cuando la correspondencia esté comprobada. Si solo se cita el anexo histórico, se conservará la referencia original y se indicará la equivalencia, sin inventar códigos.

## Regla editorial

Son fuentes oficiales de carácter profesional y bibliográfico. No son legislación aplicable, no sustituyen la convocatoria y no deben utilizarse para afirmar que una conducta, función o requisito es jurídicamente obligatorio. Las preguntas deben usar `source.kind: "bibliografia"`, `source.file: "sources/cncp-technical.html"` y un `anchorId` estable. La explicación debe enlazar el BOE de la disposición correspondiente y, si procede, la corrección de errores de 2025.

## Validación

```text
npm run content:validate:sources
```

La validación comprueba que cada fuente tiene referencia, URL, temas y anclas existentes, y que no hay anclas duplicadas en la página.
