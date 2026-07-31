import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');

// Cuarto distractor de la misma materia. Cada texto debe revisarse junto con su ancla.
const fourth = {
  'm3-emp-021': 'Al personal estatutario de los servicios públicos de salud.',
  'm3-emp-022': 'El personal laboral de las entidades gestoras de la Seguridad Social.',
  'm3-emp-023': 'Como una medida limitada a la fase de acceso al empleo público.',
  'm3-emp-024': 'La categoría profesional.',
  'm3-emp-025': 'Nivel 4.',
  'm3-emp-026': 'Una Comisión de Igualdad y una Comisión de Formación.',
  'm3-emp-027': 'Resolver en vía judicial las reclamaciones individuales del personal.',
  'm3-emp-028': 'A los comités intercentros, sin límites derivados de la ley.',
  'm3-emp-029': 'Libre designación, concurso y oposición.',
  'm3-emp-030': 'La movilidad voluntaria mediante libre designación.',
  'm3-emp-031': 'Treinta y siete horas semanales de trabajo efectivo.',
  'm3-emp-032': 'Veinticinco días hábiles por año completo de servicios.',
  'm3-emp-033': 'A los cinco años.',
  'm3-emp-034': 'Cuatro meses desde su incoación.',
  'm3-law-030': 'Al personal estatutario de los servicios públicos de salud.',
  'm3-law-031': 'El personal laboral de las universidades públicas.',
  'm3-law-032': 'Se aplica únicamente a la determinación de las retribuciones.',
  'm3-common-013': 'Ordenar exclusivamente los puestos según la antigüedad.',
  'm3-common-014': 'Conciliación aplicable únicamente a quienes trabajan a tiempo parcial.',
  'm3-common-015': 'Las determina cada organismo autónomo en su relación de puestos.',
  'm3-common-016': 'Solo algunos puestos tienen especialidad cuando así lo decide la Administración.',

  'm3-contract-001': 'Confidencialidad y adjudicación directa como principios generales.',
  'm3-contract-002': 'La entrega de bienes muebles con instalación accesoria.',
  'm3-contract-003': 'Obras, suministros y servicios privados de cualquier entidad pública.',
  'm3-contract-004': 'Presumir la necesidad por la mera existencia de crédito presupuestario.',
  'm3-contract-005': 'La división en lotes está prohibida salvo en los contratos menores.',
  'm3-contract-006': 'Solo la solvencia del contratista, sin justificar la necesidad.',
  'm3-contract-007': 'Negociado sin publicidad y abierto simplificado como únicos procedimientos ordinarios.',
  'm3-contract-008': 'La vinculación de los criterios al objeto del contrato no resulta necesaria.',
  'm3-contract-009': 'Requiere directamente la documentación al segundo clasificado.',
  'm3-contract-010': 'Puede modificarlo libremente sin audiencia ni límites legales.',
  'm3-law-039': 'Una concesión de servicios con transferencia del riesgo operacional.',
  'm3-law-040': 'La existencia de crédito basta y excluye la justificación de la necesidad.',
  'm3-law-041': 'La decisión de no dividir nunca necesita justificación.',
  'm3-law-042': 'La identidad del adjudicatario elegido antes de iniciar la licitación.',

  'm3-eu-007': 'Reglamentos, leyes orgánicas y decisiones marco.',
  'm3-eu-008': 'Obligatorio en el resultado, pero necesitado siempre de transposición.',
  'm3-eu-009': 'Puede dirigirse a cualquier particular y es siempre directamente aplicable.',
  'm3-eu-010': 'Solo tiene valor orientativo para los destinatarios designados.',
  'm3-eu-011': 'Son vinculantes cuando los adopta la Comisión Europea.',
  'm3-eu-012': 'En la adopción exclusiva por el Consejo, con consulta al Parlamento.',
  'm3-eu-013': 'Al Consejo, para modificar elementos esenciales del acto legislativo.',
  'm3-eu-014': 'Transponer también los reglamentos antes de que puedan aplicarse.',
  'm3-eu-015': 'Cuando se requiera una decisión del Tribunal de Justicia.',
  'm3-eu-016': 'El derecho originario son recomendaciones y el derivado son tratados.',
  'm3-law-045': 'Leyes, decretos-leyes, órdenes ministeriales y circulares.',
  'm3-law-046': 'Permite modificar elementos esenciales sin límites fijados por el acto legislativo.',

  'm3-ce-007': 'Por el Congreso de los Diputados y el Consejo de Estado.',
  'm3-ce-008': 'Entre 200 y 300 Diputados.',
  'm3-ce-009': 'Es la Cámara de representación municipal.',
  'm3-ce-022': 'Juzgar y ejecutar las sentencias dictadas por los tribunales.',
  'm3-ce-023': 'Cinco años, salvo disolución anticipada.',
  'm3-ce-024': 'Dos Senadores fijos y otro más por cada medio millón de habitantes.',
  'm3-common-001': 'Para aprobar la investidura del Presidente del Gobierno.',
  'm3-common-002': 'Únicamente mediante sesiones conjuntas presididas por el Gobierno.',
  'm3-common-003': 'La decisión definitiva del Senado por mayoría absoluta.',
  'm3-common-004': 'Solo las leyes de Presupuestos Generales del Estado.',
  'm3-pool-022': 'Ejercer la potestad reglamentaria ordinaria de cada ministerio.',

  'm3-ce-010': 'Controlar al Poder Judicial y ejercer su función jurisdiccional.',
  'm3-ce-011': 'Transcurrido un año desde la primera votación de investidura.',
  'm3-ce-012': 'Oportunidad, independencia, colegialidad, publicidad y territorialidad.',
  'm3-ce-025': 'El Presidente del Senado.',
  'm3-ce-026': 'Igualdad, mérito y antigüedad profesional.',
  'm3-ce-027': 'A la recaudación fiscal y al equilibrio presupuestario.',
  'm3-common-005': 'El Consejo de Ministros, mediante instrucciones a cada miembro.',
  'm3-common-006': 'Después de cada remodelación ministerial, aunque continúe el Presidente.',
  'm3-common-007': 'Ante el Senado, con exclusión del Congreso.',
  'm3-common-008': 'No pueden ser diputados durante el mandato.',
  'm3-pool-023': 'Dirigir exclusivamente las Cortes Generales y sus comisiones.',

  'm3-admin-007': 'Las personas físicas que actúen como representantes de otras personas.',
  'm3-admin-008': 'Un registro exclusivo para documentos de salida.',
  'm3-admin-009': 'Dos meses desde la iniciación.',
  'm3-admin-010': 'Solo a los interesados que hayan iniciado el procedimiento.',
  'm3-admin-011': 'La unidad que tramite materialmente el expediente, aunque no sea competente.',
  'm3-admin-012': 'Dentro de quince días desde que se dicta el acto.',
  'm3-admin-013': 'Transcurridos cinco días hábiles desde su puesta a disposición.',
  'm3-admin-014': 'Cualquier defecto formal subsanable, aunque no cause indefensión.',
  'm3-admin-015': 'Siempre que el acto se haya tramitado en formato electrónico.',
  'm3-admin-016': 'Únicamente la resolución final, una vez notificada.',
  'm3-admin-017': 'Solo una resolución expresa puede poner fin al procedimiento.',
  'm3-law-016': 'Todas las personas físicas, sin posibilidad de elección.',
  'm3-law-017': 'Solo registra documentos de salida dirigidos a otros órganos.',
  'm3-law-018': 'Un año, aunque no lo establezca una norma.',
  'm3-law-019': 'Dentro de quince días desde que se dicta el acto.'
};

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const selected = questions.filter(question => Object.hasOwn(fourth, question.id));
if (selected.length !== Object.keys(fourth).length) {
  const missing = Object.keys(fourth).filter(id => !questions.some(question => question.id === id));
  throw new Error(`Faltan preguntas del lote: ${missing.join(', ')}`);
}

for (const question of selected) {
  if (question.options.length !== 3) throw new Error(`Formato inesperado en ${question.id}`);
  // La interfaz baraja las opciones al renderizar y corrige por optionId.
  // No se fuerza una posición almacenada para la respuesta correcta.
  question.options = [...question.options, { id: 'd', text: fourth[question.id] }];
  question.optionMigration = { version: 1, migratedAt: '2026-07-31', source: 'priority-legal-batch' };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas; correctas repartidas A-D: ${Math.floor(selected.length / 4)} por posición.`);
