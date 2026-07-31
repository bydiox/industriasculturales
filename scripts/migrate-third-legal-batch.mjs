import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const fourth = {
  'm3-ce-001': 'Legalidad, seguridad jurídica, responsabilidad y solidaridad como valores superiores.',
  'm3-ce-002': 'En el Rey, como representante de la unidad nacional.',
  'm3-ce-003': 'República parlamentaria con una Jefatura del Estado electiva.',
  'm3-ce-016': 'Únicamente a los órganos constitucionales y a las entidades territoriales.',
  'm3-ce-017': 'Solo la discriminación por razón de ideología, religión o sexo.',
  'm3-ce-018': 'En cualquier delito cuando lo autorice una ley orgánica posterior.',
  'm3-pool-019': 'Reconoce soberanía independiente a cada Comunidad Autónoma y excluye la solidaridad.',
  'm3-pool-020': 'Las demás lenguas españolas solo pueden ser oficiales mediante una ley estatal.',
  'm3-pool-021': 'La libertad de empresa como principio general de actuación de todos los poderes públicos.',

  'm3-ce-004': 'Es el jefe del Gobierno y dirige la Administración civil y militar.',
  'm3-ce-005': 'No puede conceder indultos particulares en ningún caso.',
  'm3-ce-006': 'Mediante una ley ordinaria aprobada por mayoría simple.',
  'm3-ce-019': 'La cooperación con las confesiones solo puede producirse mediante tratados internacionales.',
  'm3-ce-020': 'Cuarenta y ocho horas, sin posibilidad de control judicial posterior.',
  'm3-ce-021': 'Acceder a funciones y cargos públicos sin que puedan exigirse requisitos legales.',
  'm3-pool-032': 'Dirigir la política interior y exterior y ejercer la potestad reglamentaria.',

  'm3-ce-013': 'Municipios, partidos judiciales y Comunidades Autónomas.',
  'm3-ce-014': 'La legislación mercantil y penal, en los términos que establezca cada Estatuto.',
  'm3-ce-015': 'Mayoría de tres quintos del Congreso y del Senado reunidos conjuntamente.',
  'm3-ce-028': 'La legislación civil completa y la ordenación general de la economía autonómica.',
  'm3-ce-029': 'Catorce miembros designados por el Congreso, el Senado, el Gobierno y el Consejo General del Poder Judicial.',
  'm3-ce-030': 'Mayoría de dos tercios de cada Cámara en la primera votación.',

  'm3-eu-001': 'El TUE prevalece jerárquicamente y el TFUE solo desarrolla sus disposiciones.',
  'm3-eu-002': 'La uniformidad cultural y la centralización de las Administraciones nacionales.',
  'm3-eu-003': 'Un espacio económico sin libertad de circulación para las personas.',
  'm3-eu-004': 'Jerarquía, centralización y uniformidad territorial de las competencias.',
  'm3-eu-005': 'La Comisión Europea, la OTAN y el Tribunal Europeo de Derechos Humanos.',
  'm3-eu-006': 'La dirección exclusiva de la política monetaria de todos los Estados miembros.',
  'm3-law-043': 'Que los Estados forman un único Estado federal y renuncian a sus competencias.',
  'm3-law-044': 'La competencia general de la Unión sobre cualquier materia no reservada expresamente a un Estado.',

  'm3-admin-001': 'La organización interna de los ministerios y el régimen electoral general.',
  'm3-admin-002': 'Los partidos políticos y las asociaciones privadas sin vinculación administrativa.',
  'm3-admin-003': 'Reserva de toda actuación administrativa y preferencia por la tramitación presencial.',
  'm3-admin-004': 'Puede crearse sin delimitar funciones si existe una unidad con competencias similares.',
  'm3-admin-005': 'Se transmite automáticamente cuando se encomienda la gestión de una actividad.',
  'm3-admin-006': 'La transferencia completa de la competencia a otra Administración mediante convenio.',
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
    source: 'third-legal-batch'
  };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas del tercer lote jurídico.`);
