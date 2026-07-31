import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifest = JSON.parse(await readFile(join(root, 'data/laws/laws-manifest.json'), 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));
const legal = (id, anchorId, reference) => ({ lawId: id, anchorId, reference, url: lawMap.get(id)?.officialUrl });
const q = (id, topicId, prompt, options, correctOptionId, explanation, source, metadata = {}) => {
  if (options.length !== 4) throw new Error(`${id}: las preguntas nuevas deben tener exactamente cuatro opciones`);
  return ({
  id, topicId, prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId, explanation, source, ...metadata
  });
};
const lawQ = (id, topic, prompt, options, correct, explanation, law, anchor, reference, metadata) => q(id, topic, prompt, options, correct, explanation, legal(law, anchor, reference), metadata);
const bibQ = (id, topic, prompt, options, correct, explanation, reference, url, anchor) => q(id, topic, prompt, options, correct, explanation, { kind: 'bibliografia', reference, url, file: 'sources/m3-bibliography.html', anchorId: anchor });

const additions = [
  bibQ('m3-corpus-034', 'especifico-42', 'Según la NTP 0179 del INSST, la carga mental de trabajo se refiere principalmente a:', [
    'Efecto de las exigencias intelectuales de la tarea y de factores externos sobre la persona',
    'Suma de los accidentes laborales registrados durante una jornada y sus consecuencias',
    'Esfuerzo muscular necesario para completar una tarea y mantener una postura de trabajo'
  ], 'a', 'La NTP 0179 define la carga mental en relación con las exigencias intelectuales de la tarea y los factores que afectan mentalmente a la persona.', 'NTP 0179, La carga mental del trabajo: definición y evaluación', 'https://www.insst.es/normativa/riesgos-psicosociales/listado-de-ntp', 'ntp-0179-definicion'),
  bibQ('m3-corpus-035', 'especifico-42', '¿Cuál de estos conjuntos recoge factores que la NTP 534 relaciona con la carga mental de trabajo?', [
    'Las exigencias de la tarea, las condiciones externas y las características de la persona',
    'Únicamente la edad y la antigüedad, con independencia del contenido de la tarea',
    'Solo la temperatura, el ruido y la iluminación del local'
  ], 'a', 'La NTP 534 analiza factores de la tarea, de las condiciones externas y de la persona, cuya combinación configura la carga mental.', 'NTP 534, Carga mental de trabajo: factores', 'https://www.insst.es/documents/94886/191756/NTP%20534%20Carga%20mental%20de%20trabajo%20factores.pdf', 'ntp-0534-factores'),
  bibQ('m3-corpus-036', 'especifico-42', 'En el modelo de la NTP 318, el estrés laboral se genera como resultado de:', [
    'Interacción entre estresores del entorno, percepción y recursos personales',
    'La presencia automática de cualquier tarea que requiera concentración',
    'La existencia exclusiva de una respuesta fisiológica, sin intervención de procesos cognitivos'
  ], 'a', 'La NTP 318 explica el estrés como un proceso de interacción en el que intervienen los estresores, la percepción y las características de la persona.', 'NTP 318, El estrés: proceso de generación en el ámbito laboral', 'https://www.insst.es/documents/94886/326827/ntp_318.pdf/2c36529c-e315-4b60-9b6d-33cb81a8bfd0', 'ntp-0318-proceso'),
  bibQ('m3-corpus-037', 'especifico-42', '¿Qué describe la NTP 355 como respuesta fisiológica de estrés?', [
    'Una respuesta general del organismo ante una demanda o alteración de su equilibrio',
    'Una decisión voluntaria de abandonar siempre la tarea que provoca presión',
    'Un trastorno que solo aparece cuando existe una lesión física acreditada'
  ], 'a', 'La NTP 355 presenta la fisiología del estrés como una respuesta general del organismo ante demandas que alteran su equilibrio.', 'NTP 355, Fisiología del estrés', 'https://www.insst.es/materias/riesgos/riesgos-psicosociales/estres-laboral', 'ntp-0355-fisiologia'),
  lawQ('m3-corpus-038', 'especifico-42', 'Conforme al artículo 16 de la Ley 31/1995, la prevención debe integrarse:', [
    'En el sistema general de gestión de la empresa y en todos sus niveles jerárquicos',
    'Solo en el servicio de prevención y al margen de la organización ordinaria',
    'Únicamente cuando ya se haya producido un daño para la salud'
  ], 'a', 'El artículo 16 exige integrar la prevención en el sistema general de gestión, en todas las actividades y niveles jerárquicos.', 'ley-31-1995', 'ley-31-1995-a16', 'Ley 31/1995, artículo 16'),

  lawQ('m3-corpus-039', 'especifico-12', 'El ámbito del Real Decreto 1435/1985 comprende:', [
    'La actividad artística y las actividades técnicas o auxiliares necesarias para ella',
    'Solo la actividad de artistas intérpretes con contrato indefinido',
    'Cualquier trabajo administrativo de una empresa cultural, aunque no guarde relación con la producción'
  ], 'a', 'El artículo 1 incluye la actividad artística y las actividades técnicas o auxiliares necesarias para su desarrollo.', 'rd-1435-1985', 'rd-1435-1985-a1', 'Real Decreto 1435/1985, artículo 1', { temporalContext: 'vigente-hasta-2027-05-24' }),
  lawQ('m3-corpus-040', 'especifico-12', '¿Cómo debe formalizarse el contrato de trabajo artístico conforme al Real Decreto 1435/1985?', [
    'Por escrito, para una o varias actuaciones, temporada o fase de producción',
    'Verbalmente, salvo que la actuación se prolongue más de una temporada',
    'Solo mediante escritura pública autorizada por la autoridad laboral'
  ], 'a', 'El artículo 3 exige forma escrita y permite vincular el contrato a actuaciones, temporadas, permanencia en cartel o fases de producción.', 'rd-1435-1985', 'rd-1435-1985-a3', 'Real Decreto 1435/1985, artículo 3', { temporalContext: 'vigente-hasta-2027-05-24' }),
  lawQ('m3-corpus-041', 'especifico-12', 'La duración determinada del contrato artístico debe:', [
    'Estar justificada por la actividad artística y vincularse a obra, actuación, temporada o fase de producción',
    'Responder a un plazo fijo de quince días, aunque cambien las necesidades de la producción',
    'Quedar excluida cuando intervengan actividades técnicas o auxiliares de la producción artística'
  ], 'a', 'El artículo 5 admite duración indefinida o determinada; la temporal debe justificarse por las necesidades de la actividad artística.', 'rd-1435-1985', 'rd-1435-1985-a5', 'Real Decreto 1435/1985, artículo 5', { temporalContext: 'vigente-hasta-2027-05-24' }),

  lawQ('m3-corpus-042', 'especifico-14', 'Según el artículo 2 de la Ley Orgánica 1/2002, el derecho de asociación comprende:', [
    'La libertad de asociarse o crear asociaciones sin necesidad de autorización previa',
    'La obligación de inscribirse antes de poder expresar cualquier finalidad común',
    'La autorización administrativa previa para toda asociación cultural'
  ], 'a', 'El artículo 2 reconoce la libertad de asociarse o crear asociaciones sin autorización previa y prohíbe obligar a integrarse o permanecer en ellas.', 'lo-1-2002', 'lo-1-2002-a2', 'Ley Orgánica 1/2002, artículo 2'),
  lawQ('m3-corpus-043', 'especifico-14', '¿Cuál es el número mínimo de personas promotoras para constituir una asociación conforme al artículo 5 de la Ley Orgánica 1/2002?', [
    'Tres personas físicas o jurídicas legalmente constituidas',
    'Dos personas físicas, siempre que una de ellas sea funcionaria',
    'Cinco personas físicas y una entidad pública'
  ], 'a', 'El artículo 5 exige el acuerdo de tres o más personas físicas o jurídicas legalmente constituidas.', 'lo-1-2002', 'lo-1-2002-a5', 'Ley Orgánica 1/2002, artículo 5'),
  lawQ('m3-corpus-044', 'especifico-14', 'A efectos de la Ley 49/2002, una entidad sin fines lucrativos debe, entre otros requisitos:', [
    'Perseguir fines de interés general y destinar el 70 % de determinadas rentas a ellos',
    'Repartir anualmente sus rentas entre los miembros del patronato',
    'Limitar sus fines a actividades comerciales con contraprestación directa'
  ], 'a', 'El artículo 3 exige fines de interés general y el destino legal de, al menos, el 70 % de determinadas rentas a esos fines.', 'ley-49-2002', 'ley-49-2002-a3', 'Ley 49/2002, artículo 3'),

  lawQ('m3-corpus-045', 'especifico-15', '¿Qué función encomienda el artículo 44 de la Constitución a los poderes públicos en materia cultural?', [
    'Promover y tutelar el acceso de todas las personas a la cultura',
    'Reservar la creación cultural a las instituciones estatales',
    'Sustituir la iniciativa social por una programación cultural única'
  ], 'a', 'El artículo 44.1 dispone que los poderes públicos promoverán y tutelarán el acceso a la cultura.', 'ce-1978', 'ce-1978-a44', 'Constitución Española, artículo 44'),
  lawQ('m3-corpus-046', 'especifico-15', 'La Convención de Naciones Unidas sobre los derechos de las personas con discapacidad reconoce, en su artículo 30, el derecho a:', [
    'Participar en igualdad de condiciones en la vida cultural, el ocio y el deporte',
    'Acceder solo a actividades culturales financiadas por las Administraciones públicas',
    'Recibir autorización individual para participar en actividades artísticas y recreativas'
  ], 'a', 'El artículo 30 exige medidas para que las personas con discapacidad participen en igualdad de condiciones en la vida cultural y el ocio.', 'conv-onu-2006', 'conv-onu-2006-a30', 'Convención sobre los derechos de las personas con discapacidad, artículo 30'),
  lawQ('m3-corpus-047', 'especifico-15', 'La Ley 7/2021 tiene entre sus objetivos:', [
    'Descarbonización, economía circular, adaptación climática y desarrollo sostenible',
    'Regulación exclusiva del patrimonio histórico y de los museos estatales',
    'Régimen general de contratación de artistas y personal técnico cultural'
  ], 'a', 'El artículo 1 vincula la ley con el Acuerdo de París, la descarbonización, la economía circular, la adaptación y el desarrollo sostenible.', 'ley-7-2021', 'ley-7-2021-a1', 'Ley 7/2021, artículo 1'),

  lawQ('m3-corpus-048', 'especifico-20', 'Según el artículo 4 de la Ley 12/1989, la producción estadística para fines estatales debe respetar, entre otros, los principios de:', [
    'Independencia profesional, imparcialidad, objetividad, fiabilidad y secreto estadístico',
    'Publicidad irrestricta de todos los datos individuales y libertad de modificación de resultados',
    'Confidencialidad de la metodología, discrecionalidad y ausencia de controles de calidad'
  ], 'a', 'El artículo 4 remite a esos principios y requisitos junto con los estándares de calidad estadística.', 'ley-12-1989', 'ley-12-1989-a4', 'Ley 12/1989, artículo 4'),
  lawQ('m3-corpus-049', 'especifico-20', '¿Para qué sirve el sistema normalizado previsto en el artículo 5 de la Ley 12/1989?', [
    'Para hacer comparables, integrables y analizables los datos y resultados estadísticos',
    'Para sustituir los registros administrativos por estimaciones no contrastables',
    'Para impedir que los servicios estadísticos estatales y autonómicos cooperen'
  ], 'a', 'El artículo 5 exige conceptos, definiciones, unidades, clasificaciones, nomenclaturas y códigos normalizados que permitan comparabilidad, integración y análisis.', 'ley-12-1989', 'ley-12-1989-a5', 'Ley 12/1989, artículo 5'),
  bibQ('m3-corpus-050', 'especifico-20', '¿Qué caracteriza al Anuario de Estadísticas Culturales del Ministerio de Cultura?', [
    'Publicación anual con una selección de resultados culturales relevantes de varias fuentes',
    'Registro administrativo de las entradas vendidas en espectáculos públicos de España',
    'Norma con rango de ley que aprueba el Plan Estadístico Nacional y sus operaciones'
  ], 'a', 'El Ministerio describe el Anuario como una publicación anual elaborada a partir de múltiples fuentes para ofrecer una selección de resultados culturales relevantes.', 'Anuario de Estadísticas Culturales, Ministerio de Cultura', 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/aec.html', 'anuario-cultura-descripcion'),
  bibQ('m3-corpus-051', 'especifico-20', 'La Cuenta Satélite de la Cultura en España se describe metodológicamente como:', [
    'Operación anual de síntesis sobre unidades residentes vinculadas a la cultura',
    'Encuesta mensual limitada a empresas escénicas de titularidad estatal',
    'Inventario de bienes culturales que no utiliza otros resultados estadísticos'
  ], 'a', 'La metodología oficial la define como una operación estructural anual y de síntesis, con ámbito nacional y unidades residentes vinculadas a la cultura.', 'Cuenta Satélite de la Cultura en España, metodología oficial', 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/culturabase/cuenta-satelite/metodologia-cuenta.html', 'cuenta-satelite-metodologia')
];

const correctPositions = ['b', 'c', 'a', 'c', 'b', 'a', 'b', 'c', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'a', 'b'];
for (let index = 0; index < additions.length; index += 1) {
  const target = correctPositions[index];
  const correctText = additions[index].options[0].text;
  const remaining = additions[index].options.slice(1).map(option => option.text);
  const ordered = target === 'a' ? [correctText, ...remaining] : target === 'b' ? [remaining[0], correctText, remaining[1]] : [remaining[0], remaining[1], correctText];
  additions[index].options = ordered.map((text, optionIndex) => ({ id: String.fromCharCode(97 + optionIndex), text }));
  additions[index].correctOptionId = target;
}
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const existing = new Set(questions.map(item => item.id));
const fresh = additions.filter(item => !existing.has(item.id));
const byId = new Map(additions.map(item => [item.id, item]));
const updated = questions.map(item => byId.get(item.id) || item);
await writeFile(questionsPath, `${JSON.stringify([...updated, ...fresh], null, 2)}\n`, 'utf8');
console.log(`Preguntas de los cinco temas añadidas: ${fresh.length}; revisadas: ${additions.length - fresh.length}.`);
