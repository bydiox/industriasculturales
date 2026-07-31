# Checklist de una nueva oposición

## Fuente y temario

- [ ] Convocatoria oficial archivada.
- [ ] Lista de temas y subapartados transcrita.
- [ ] Fuentes oficiales identificadas y fechadas.
- [ ] Alcance de cada tema marcado como entra/no entra.

## Legislación

- [ ] Cada norma tiene un `lawId` estable.
- [ ] El HTML conserva el texto fuente.
- [ ] Cada bloque tiene `anchorId` permanente y `data-ref` jurídico.
- [ ] No hay anclas duplicadas.
- [ ] La URL y la versión de origen están registradas.

## Preguntas

- [ ] Cada pregunta tiene una única respuesta correcta.
- [ ] Las opciones son plausibles y comparables.
- [ ] Hay feedback explicativo.
- [ ] Las preguntas legales enlazan con la norma y el ancla.
- [ ] Las preguntas cubren los apartados que entran.
- [ ] Los huecos de cobertura son avisos, no fallos de build automáticos.

## Producto

- [ ] Libre usa el banco completo y filtros.
- [ ] Examen aplica una composición proporcional documentada.
- [ ] Historia avanza solo al aprobar el capítulo.
- [ ] El progreso se puede reanudar desde otro dispositivo si se activa nube.
- [ ] El cambio de versión invalida la caché.
- [ ] `npm run check` y `npm run content:validate` pasan.
