import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const fourth = {
  'm3-emp-001': 'Personal estatutario, personal contratado y personal colaborador externo.',
  'm3-emp-002': 'Al personal laboral, siempre que tenga titulación universitaria.',
  'm3-emp-003': 'La promoción automática por el mero transcurso del tiempo de servicio.',
  'm3-emp-004': 'La fijación individual de las condiciones generales de trabajo.',
  'm3-emp-005': 'Competitividad, rentabilidad, oportunidad y obediencia corporativa.',
  'm3-emp-006': 'Abstenerse únicamente cuando el interés personal haya producido ya un perjuicio.',
  'm3-emp-007': 'Cuando la orden resulte inconveniente para la organización, aunque sea legal.',
  'm3-emp-008': 'Rechazar incluso las atenciones ordinarias de cortesía permitidas por los usos sociales.',
  'm3-emp-009': 'Utilizar sin límites para fines privados los dispositivos digitales de la Administración.',
  'm3-emp-010': 'La formación continua debe realizarse siempre fuera de la jornada de trabajo.',
  'm3-law-025': 'La progresión exige necesariamente ocupar un puesto de nivel superior.',
  'm3-law-027': 'La evaluación puede basarse en confianza personal y no necesita criterios revisables.',

  'm3-emp-011': 'Igualdad, mérito, capacidad y profesionalidad, sin necesidad de publicidad.',
  'm3-emp-012': 'Veinticinco años cumplidos en la fecha de la convocatoria.',
  'm3-emp-013': 'El personal funcionario de carrera que no pertenezca al órgano convocante.',
  'm3-emp-014': 'Cuando así lo acuerde el órgano convocante aunque no exista habilitación legal.',
  'm3-emp-015': 'La elección del destino antes de superar el proceso selectivo.',
  'm3-emp-016': 'La excedencia voluntaria solicitada por interés particular.',
  'm3-emp-017': 'Se permite siempre que el segundo puesto tenga jornada inferior a la mitad.',
  'm3-emp-018': 'Una participación superior al veinticinco por ciento del capital social.',
  'm3-emp-019': 'Una declaración responsable posterior sustituye siempre al reconocimiento previo.',
  'm3-emp-020': 'La actividad privada se desarrolla fuera de la localidad del puesto público.',
  'm3-law-026': 'Al menos cinco años de servicio activo en cualquier Administración pública.',
  'm3-law-028': 'Cualquier actividad privada coincidente con las funciones del puesto público.',
  'm3-law-029': 'No más de cinco consejos, sin posibilidad de autorización excepcional.',

  'm3-labor-001': 'Actividad profesional por cuenta propia, aunque se realice bajo organización ajena.',
  'm3-labor-002': 'La modificación unilateral de cualquier condición de trabajo sin causa legal.',
  'm3-labor-003': 'Puede pactarse verbalmente si la duración no supera quince días.',
  'm3-labor-004': 'Cuarenta y ocho horas semanales de trabajo efectivo de promedio anual.',
  'm3-labor-005': 'Solo una decisión empresarial discrecional, sin necesidad de causa acreditada.',
  'm3-labor-006': 'Suspensiones temporales del contrato que no producen extinción alguna.',
  'm3-labor-007': 'Un incumplimiento leve, aunque no sea imputable al trabajador.',
  'm3-labor-008': 'Una referencia genérica a la conducta, sin precisar hechos ni fecha de efectos.',
  'm3-labor-009': 'Solo tienen fuerza vinculante para quienes los firmaron personalmente.',
  'm3-labor-010': 'Registro interno de la empresa, sin publicación en ningún boletín oficial.',
  'm3-law-033': 'La participación en los beneficios empresariales como derecho colectivo básico.',
  'm3-law-034': 'El periodo de prueba permite suspender todos los derechos laborales mientras dura.',
  'm3-law-035': 'Cuarenta y cinco horas semanales calculadas por cada mes natural.',
  'm3-law-036': 'La existencia de pérdidas económicas, aunque no haya incumplimiento del trabajador.',

  'm3-labor-011': 'Afiliarse solo al sindicato que autorice expresamente la empresa.',
  'm3-labor-012': 'Imponer sanciones disciplinarias a cualquier trabajador no afiliado.',
  'm3-labor-013': 'La capacidad exclusiva para negociar todos los convenios colectivos.',
  'm3-labor-014': 'Provincial, municipal y estatal, sin reconocimiento del ámbito autonómico.',
  'm3-labor-015': 'Sustituir automáticamente al comité de empresa cualquiera que sea la plantilla.',
  'm3-labor-016': 'En empresas o centros con más de cincuenta trabajadores en todo caso.',
  'm3-labor-017': 'Una autorización judicial previa para cada descuento de cuota sindical.',
  'm3-labor-018': 'Controlar unilateralmente la organización y la dirección de la empresa.',
  'm3-labor-019': 'Por decisión administrativa no motivada cuando exista interés público.',
  'm3-labor-020': 'La afiliación puede exigirse si lo aprueba la mayoría de la plantilla.',
  'm3-law-037': 'Disolver una empresa por decisión de la organización sindical sin control judicial.',
  'm3-law-038': 'Aprobar por sí solas el convenio colectivo aplicable a toda la empresa.',
};

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const selected = questions.filter((question) => Object.hasOwn(fourth, question.id));
const missing = Object.keys(fourth).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`Faltan preguntas del lote: ${missing.join(', ')}`);

for (const question of selected) {
  if (question.options.length !== 3) throw new Error(`${question.id}: no tiene el formato original de tres opciones`);
  const texts = [...question.options.map((option) => option.text), fourth[question.id]];
  if (new Set(texts).size !== texts.length) throw new Error(`${question.id}: distractor duplicado`);
  question.options = [...question.options, { id: 'd', text: fourth[question.id] }];
  question.optionMigration = {
    version: 1,
    migratedAt: '2026-07-31',
    source: 'second-legal-batch'
  };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas del segundo lote jurídico.`);
