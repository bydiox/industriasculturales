import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifest = JSON.parse(await readFile(join(root, 'data/laws/laws-manifest.json'), 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));
const source = (lawId, anchorId, reference) => ({ lawId, anchorId, reference, url: lawMap.get(lawId)?.officialUrl });
const q = (id, topicId, prompt, options, correctOptionId, explanation, lawId, anchorId, reference) => {
  if (options.length !== 4) throw new Error(`${id}: las preguntas nuevas deben tener exactamente cuatro opciones`);
  return ({
  id, topicId, prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId, explanation, source: source(lawId, anchorId, reference)
  });
};

const additions = [
  q('m3-common-001', 'comun-03', '¿Cuándo se reúnen las Cámaras en sesión conjunta según el artículo 74 de la Constitución?', [
    'Para ejercer competencias no legislativas atribuidas por el Título II a las Cortes Generales',
    'Para aprobar cualquier ley ordinaria que afecte a una comunidad autónoma',
    'Para sustituir siempre la actividad legislativa separada del Congreso y del Senado'
  ], 'a', 'El artículo 74.1 reserva la sesión conjunta al ejercicio de las competencias no legislativas que el Título II atribuye expresamente a las Cortes Generales.', 'ce-1978', 'ce-1978-a74', 'Constitución Española, artículo 74'),
  q('m3-common-002', 'comun-03', '¿Cómo funcionan ordinariamente el Congreso y el Senado conforme al artículo 75 de la Constitución?', [
    'En Pleno y por Comisiones, con límites constitucionales a la delegación legislativa',
    'Solo mediante sesiones conjuntas presididas por el Gobierno',
    'Únicamente a través de comisiones mixtas con igual número de miembros'
  ], 'a', 'El artículo 75 dispone que las Cámaras funcionarán en Pleno y por Comisiones y exceptúa determinadas materias de la delegación legislativa.', 'ce-1978', 'ce-1978-a75', 'Constitución Española, artículo 75'),
  q('m3-common-003', 'comun-03', '¿Qué requisito exige la Constitución para los acuerdos previstos en el artículo 74.2 cuando no hay acuerdo entre ambas Cámaras?', [
    'Comisión Mixta y, si no hay acuerdo, decisión del Congreso por mayoría absoluta',
    'Remitirlo directamente al Tribunal Constitucional para que sustituya la decisión parlamentaria',
    'Celebrar siempre un referéndum estatal antes de continuar el procedimiento'
  ], 'a', 'El artículo 74.2 prevé una Comisión Mixta y, si no se alcanza acuerdo, la decisión del Congreso por mayoría absoluta.', 'ce-1978', 'ce-1978-a74', 'Constitución Española, artículo 74.2'),
  q('m3-common-004', 'comun-03', '¿Qué materias quedan exceptuadas de la delegación en las Comisiones Legislativas Permanentes?', [
    'Reforma constitucional, cuestiones internacionales, leyes orgánicas y de bases y Presupuestos',
    'Solo las leyes de presupuestos de las comunidades autónomas',
    'Cualquier proposición de ley presentada por un grupo parlamentario'
  ], 'a', 'El artículo 75.3 enumera esas materias como excepciones a la delegación legislativa en Comisiones Permanentes.', 'ce-1978', 'ce-1978-a75', 'Constitución Española, artículo 75.3'),

  q('m3-common-005', 'comun-04', '¿Quién dirige la acción del Gobierno y coordina las funciones de sus miembros?', [
    'El Presidente dirige y coordina, sin perjuicio de la responsabilidad directa de cada miembro',
    'El Consejo de Estado mediante dictámenes vinculantes',
    'El Congreso de los Diputados mediante instrucciones a cada Ministerio'
  ], 'a', 'El artículo 98.2 atribuye esa dirección y coordinación al Presidente, respetando la responsabilidad directa de cada miembro en su gestión.', 'ce-1978', 'ce-1978-a98', 'Constitución Española, artículo 98.2'),
  q('m3-common-006', 'comun-04', '¿Cuándo cesa el Gobierno conforme al artículo 101 de la Constitución?', [
    'Tras elecciones, pérdida de confianza, dimisión o fallecimiento del Presidente',
    'Solo cuando lo acuerda una mayoría de tres quintos del Senado',
    'Únicamente al aprobarse los Presupuestos Generales del Estado'
  ], 'a', 'El artículo 101.1 recoge esas cuatro causas de cese y el apartado 2 mantiene al Gobierno en funciones hasta la toma de posesión del nuevo.', 'ce-1978', 'ce-1978-a101', 'Constitución Española, artículo 101'),
  q('m3-common-007', 'comun-04', '¿Ante qué Cámara responde solidariamente el Gobierno en su gestión política?', [
    'Ante el Congreso de los Diputados',
    'Ante el Senado, con exclusión del Congreso',
    'Ante ambas Cámaras reunidas siempre en sesión conjunta'
  ], 'a', 'El artículo 108 establece la responsabilidad solidaria del Gobierno ante el Congreso de los Diputados.', 'ce-1978', 'ce-1978-a108', 'Constitución Española, artículo 108'),
  q('m3-common-008', 'comun-04', '¿Qué incompatibilidad establece el artículo 98.3 para los miembros del Gobierno?', [
    'No pueden ejercer otras funciones representativas ni otra función pública no derivada del cargo',
    'No pueden desempeñar ninguna actividad docente, aunque sea compatible con su cargo',
    'No pueden pertenecer a un partido político durante el mandato'
  ], 'a', 'El artículo 98.3 establece esas incompatibilidades y permite la actividad profesional o mercantil en los términos legales.', 'ce-1978', 'ce-1978-a98', 'Constitución Española, artículo 98.3'),

  q('m3-common-009', 'comun-05', '¿Qué garantiza la Constitución a los municipios?', [
    'Autonomía, personalidad jurídica plena y gobierno y administración mediante sus Ayuntamientos',
    'Soberanía territorial independiente de las comunidades autónomas',
    'Capacidad legislativa estatal para aprobar leyes orgánicas propias'
  ], 'a', 'El artículo 140 garantiza la autonomía municipal, la personalidad jurídica plena y el gobierno por Ayuntamientos.', 'ce-1978', 'ce-1978-a140', 'Constitución Española, artículo 140'),
  q('m3-common-010', 'comun-05', '¿Qué es la provincia según el artículo 141 de la Constitución?', [
    'Una entidad local con personalidad jurídica propia determinada por la agrupación de municipios',
    'Una unidad administrativa sin personalidad jurídica creada por cada Ayuntamiento',
    'Una circunscripción judicial que carece de funciones territoriales propias'
  ], 'a', 'El artículo 141 define la provincia como entidad local con personalidad jurídica propia, determinada por la agrupación de municipios.', 'ce-1978', 'ce-1978-a141', 'Constitución Española, artículo 141'),
  q('m3-common-011', 'comun-05', '¿Qué principio establece el artículo 142 sobre las Haciendas locales?', [
    'Deben disponer de medios suficientes para desempeñar las funciones atribuidas por la ley',
    'Deben financiarse exclusivamente mediante transferencias estatales finalistas',
    'Pueden establecer cualquier tributo sin límites constitucionales ni legales'
  ], 'a', 'El artículo 142 reconoce la suficiencia de las Haciendas locales y prevé su financiación fundamentalmente mediante tributos propios y participación en los del Estado y las comunidades autónomas.', 'ce-1978', 'ce-1978-a142', 'Constitución Española, artículo 142'),
  q('m3-common-012', 'comun-05', '¿Qué prevé el artículo 139.2 de la Constitución para el territorio español?', [
    'Ninguna autoridad puede adoptar medidas que obstaculicen la libertad de circulación y establecimiento',
    'Cada comunidad autónoma puede impedir la prestación de servicios procedentes de otra',
    'La circulación de personas depende de autorizaciones territoriales aprobadas por las Cortes'
  ], 'a', 'El artículo 139.2 prohíbe a cualquier autoridad adoptar medidas que directa o indirectamente obstaculicen la libertad de circulación y establecimiento.', 'ce-1978', 'ce-1978-a139', 'Constitución Española, artículo 139.2'),

  q('m3-common-013', 'comun-13', '¿Qué finalidad tiene el sistema de clasificación del IV Convenio Único?', [
    'Ordenar los puestos atendiendo a titulación, formación y capacitación y favorecer la movilidad y promoción',
    'Determinar exclusivamente las retribuciones, sin relación con las funciones del puesto',
    'Sustituir las familias profesionales por una categoría única para todo el personal'
  ], 'a', 'El artículo 7 vincula la clasificación con los niveles de titulación, formación y capacitación y con la movilidad y promoción profesional.', 'convenio-iv', 'convenio-iv-a7', 'IV Convenio Único, artículo 7'),
  q('m3-common-014', 'comun-13', '¿Qué principio de recursos humanos considera básico el artículo 6 del IV Convenio Único?', [
    'Conciliación familiar, personal y laboral como principio de igualdad y corresponsabilidad',
    'La disponibilidad permanente sin medidas de corresponsabilidad',
    'La prioridad de la movilidad geográfica sobre cualquier medida de conciliación'
  ], 'a', 'El artículo 6 configura la conciliación como principio básico para hacer efectivos igualdad y corresponsabilidad y mejorar el clima laboral.', 'convenio-iv', 'convenio-iv-a6', 'IV Convenio Único, artículo 6'),
  q('m3-common-015', 'comun-13', '¿Cómo se determinan las familias profesionales en el IV Convenio Único?', [
    'Las define la autoridad competente dentro del Sistema Nacional de Cualificaciones',
    'Las fija cada trabajador en su contrato sin referencia a ningún sistema nacional',
    'Se determinan únicamente por la antigüedad acumulada en la Administración'
  ], 'a', 'El artículo 9 remite a las familias profesionales definidas por la autoridad competente dentro del Sistema Nacional de Cualificaciones y Formación Profesional.', 'convenio-iv', 'convenio-iv-a9', 'IV Convenio Único, artículo 9'),
  q('m3-common-016', 'comun-13', '¿Qué establece el artículo 10 del IV Convenio Único sobre los puestos de trabajo?', [
    'Todos los puestos tienen una especialidad y, cuando proceda, requisitos de titulación o formación',
    'Solo los puestos del grupo M3 tienen especialidad y los demás se cubren sin requisitos',
    'La especialidad se asigna únicamente después de superar un periodo de prueba de dos años'
  ], 'a', 'El artículo 10 asigna una especialidad a todos los puestos y mantiene, cuando proceda, las exigencias de titulación o formación habilitante.', 'convenio-iv', 'convenio-iv-a1-2', 'IV Convenio Único, artículo 10')
];

const positions = ['b', 'c', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c'];
for (let index = 0; index < additions.length; index += 1) {
  const target = positions[index];
  const correct = additions[index].options[0].text;
  const rest = additions[index].options.slice(1).map(option => option.text);
  const ordered = target === 'a' ? [correct, ...rest] : target === 'b' ? [rest[0], correct, rest[1]] : [rest[0], rest[1], correct];
  additions[index].options = ordered.map((text, optionIndex) => ({ id: String.fromCharCode(97 + optionIndex), text }));
  additions[index].correctOptionId = target;
}

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const existing = new Set(questions.map(item => item.id));
const fresh = additions.filter(item => !existing.has(item.id));
const byId = new Map(additions.map(item => [item.id, item]));
const updated = questions.map(item => byId.get(item.id) || item);
await writeFile(questionsPath, `${JSON.stringify([...updated, ...fresh], null, 2)}\n`, 'utf8');
console.log(`Preguntas comunes añadidas: ${fresh.length}; revisadas: ${additions.length - fresh.length}.`);
