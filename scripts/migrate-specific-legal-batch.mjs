import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const fourth = {
  'm3-stage-005': 'La Ley 31/1995, de Prevención de Riesgos Laborales, y sus reglamentos de desarrollo.',
  'm3-law-013': 'Solo a espectáculos públicos organizados por Administraciones, aunque carezcan de público.',
  'm3-law-014': 'Únicamente la programación cultural y el régimen de acceso de los edificios públicos.',
  'm3-law-015': 'Mantenía indefinidamente las normas anteriores junto con las nuevas exigencias del CTE.',

  'm3-admin-018': 'Las unidades administrativas sin personalidad jurídica diferenciada.',
  'm3-admin-019': 'Cada dos años, sin necesidad de planes anuales complementarios.',
  'm3-admin-020': 'Órganos administrativos integrados en un ministerio y sin patrimonio propio.',
  'm3-law-020': 'Transferir definitivamente la titularidad de la competencia a una entidad privada.',
  'm3-law-021': 'Una autorización judicial previa en todos los procedimientos afectados.',
  'm3-law-022': 'Cede la titularidad de la competencia al órgano que ejecuta la actividad material.',
  'm3-law-023': 'La competencia del órgano delegante pasa al firmante durante toda la delegación.',
  'm3-law-024': 'El convenio siempre exige una prestación onerosa y un precio a cargo de una Administración.',

  'm3-contract-011': 'Solo actuaciones teatrales de intérpretes, sin incluir personal técnico o auxiliar.',
  'm3-contract-012': 'Debe formalizarse siempre mediante escritura pública ante notario.',
  'm3-contract-013': 'Solo puede celebrarse por tiempo determinado, sin excepciones.',
  'm3-contract-014': 'El orden civil, por tratarse de una actividad artística y no laboral.',
  'm3-contract-015': 'Únicamente los usos profesionales del sector, aunque contradigan la legislación laboral.',
  'm3-contract-016': 'El 25 de mayo de 2026, al cumplirse un año de su publicación.',

  'm3-corpus-013': 'Cualquier sociedad mercantil con beneficios reducidos, aunque no cumpla los requisitos legales.',
  'm3-corpus-014': 'El 50 por ciento de las rentas obtenidas durante el ejercicio.',
  'm3-corpus-015': 'Cualquier sociedad mercantil cotizada, por el solo hecho de realizar una donación.',
  'm3-pool-026': 'Cualquier empresa mercantil, aunque no cumpla los requisitos del régimen fiscal especial.',
  'm3-pool-027': 'Una donación revocable que obligue a la entidad a prestar un servicio futuro.',

  'm3-corpus-016': 'El derecho a obtener automáticamente una subvención pública por cada obra creada.',
  'm3-corpus-017': 'El derecho a exigir el reconocimiento de la autoría como modalidad de explotación.',
  'm3-corpus-018': 'La distribución del original o de copias mediante un soporte tangible.',
  'm3-corpus-019': 'La comunicación pública de una obra sin poner el original o las copias a disposición en soporte tangible.',
  'm3-pool-028': 'El derecho automático a recibir subvenciones por cualquier obra protegida.',
  'm3-pool-029': 'Una modalidad concreta de explotación elegida por el autor, sin incluir las demás formas legales.',
};

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const selected = questions.filter((question) => Object.hasOwn(fourth, question.id));
const missing = Object.keys(fourth).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`Faltan preguntas del lote: ${missing.join(', ')}`);

for (const question of selected) {
  if (question.options.length !== 3) throw new Error(`${question.id}: formato inesperado`);
  const texts = [...question.options.map((option) => option.text), fourth[question.id]];
  if (new Set(texts).size !== texts.length) throw new Error(`${question.id}: distractor duplicado`);
  question.options = [...question.options, { id: 'd', text: fourth[question.id] }];
  question.optionMigration = { version: 1, migratedAt: '2026-07-31', source: 'specific-legal-batch' };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas jurídicas específicas.`);
