# Preguntas oficiales M1 → temario M3 — paquete final

**248 preguntas activas.** No 777. La primera cifra era un error de proporción por mi parte, corregido aquí.

---

## Por qué 248 y no 777

M1 y M3 son oposiciones distintas. M1 son perfiles técnicos operativos (maquinista, sastre, peluquero, técnico de sonido); M3 es gestión. Sus cuestionarios comparten materia, pero **no comparten ni profundidad ni proporción**.

Dos correcciones, en este orden:

### Proporción

El tema 35 de María —*"Conceptos básicos de sastrería. Conceptos básicos de caracterización: maquillaje y peluquería"*— vale **0,76 % del examen**: menos de una pregunta por convocatoria. Le había asignado **129 preguntas**. Eso es pool para 170 simulacros de un tema que sale una vez.

Regla aplicada:

- **Parte específica → tope estricto en `pool5`** (cinco simulacros sin repetir). Es otra oposición: debe ser fuente secundaria, no dominante.
- **Parte común → sin tope.** Aquí el contenido es genuinamente el mismo: TREBEP, IV Convenio Único, Estatuto de los Trabajadores y Constitución son idénticos para M1 y M3, porque ambas son personal laboral de la AGE bajo el mismo convenio. Más material es mejor sin ninguna reserva.

### Profundidad

El temario de M3 dice *"conceptos básicos"*. Los cuestionarios M1 examinan ejecución profesional. Ejemplos reales de lo que había colado:

- *"¿Cómo se sujeta un bisoñe en la cabeza?"*
- *"¿Qué orden debe seguirse para la sujeción de la peluca a los puntos de anclaje?"*
- *"¿Cómo se puede recuperar la forma original de una pluma apelmazada?"*

A un perfil de gestión no se le pregunta cómo se coloca un postizo. Se ha filtrado por registro, usando como patrón el examen real de M3 de 2022: se conservan definición, localización, identificación y rol organizativo; se descarta procedimiento de ejecución.

**El resultado del filtro, en el tema 35:** de 129 preguntas sobreviven cuatro — *¿Qué es un coleto?*, *¿Qué es un tahalí?*, *¿Qué es un esmoquin?*, *¿Qué es un tontillo?*. Es exactamente el registro de *"¿Qué es una basquiña?"*, que es lo que preguntó el tribunal de M3 en 2022.

En `especifico-33` sobreviven *¿Qué es un Fresnel?*, *¿Qué es un svoboda?*, *¿Qué es la impedancia?* — y conviene notar que «Svoboda» aparecía literalmente como opción en la pregunta 40 del examen de 2022.

---

## Reparto final

| | Preguntas |
|---|---:|
| Parte común | 121 |
| Parte específica | 127 |
| **Total activas** | **248** |
| De cuatro opciones (listas para simulacro) | 129 |
| De tres opciones (Libre e Histórico) | 119 |
| Con `lawId` | 96 |
| Con `anchorId` verificado contra el corpus | 25 |

Ningún tema específico supera su `pool5`. La parte común aporta sobre todo a `comun-13` (IV Convenio, 26), `comun-01` (24), `comun-11` (20) y `comun-04` (17) — que son cuatro de los temas más pesados del examen y donde María parte de cero.

---

## Descartes conservados, no borrados

`descartes/` contiene 557 preguntas con `active: false` y el motivo explícito en `inactiveReason`:

| Fichero | Preguntas | Motivo |
|---|---:|---|
| `preguntas-m1-descartadas-proporcion-nivel.json` | 529 | Exceso de proporción sobre `pool5`, o nivel de ejecución profesional |
| `preguntas-m1-podadas.json` | 22 | Dependen de una figura o plano no disponible; más un duplicado exacto |
| `preguntas-m1-produccion-descartadas-caducas.json` | 6 | Dato con fecha de caducidad (director actual de una unidad, temporada concreta) |

Se conservan porque el criterio puede revisarse: si algún día se extraen las imágenes de los PDF, las 21 dependientes de figura son recuperables; y si el reparto de pesos cambia, el excedente vuelve a estar disponible sin reprocesar nada.

---

## Trazabilidad: hasta dónde llega

96 preguntas llevan `lawId` y 25 `anchorId`, este último verificado contra el HTML real del corpus — no hay ninguna ancla inventada.

Las demás no pueden llevarlo, y no es un defecto: *"¿Qué es un coleto?"* no tiene norma detrás. Son el caso para el que se creó `source.kind: "referencia"`. Forzarles un `lawId` sería repetir el error del RD 486/1997.

---

## Lo que sigue pendiente

- **Verificación por muestreo del mapeo temático.** Con 248 preguntas ya es asumible revisar 25-30 al azar antes de dar el conjunto por bueno.
- **Las 119 de tres opciones** siguen necesitando cuarto distractor para entrar en el simulacro, o quedarse en Libre e Histórico.
- **Las 21 dependientes de figura** requieren extraer las imágenes de los PDF originales, que están en el RAR.
