import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const importDir = join(root, 'data/imports/nuevas-preguntas-2026-08-01');
const draftsDir = join(root, 'data/drafts');
const questionsPath = join(root, 'data/questions.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const topicIds = new Set(syllabus.topics.map(topic => topic.id));
const existingIds = new Set(questions.map(question => question.id));

const normalizeWhitespace = text => String(text || '').replace(/\s+/g, ' ').trim();
const cleanPdfArtifacts = text => normalizeWhitespace(text)
  .replace(/\s*2024\s*-\s*ADVO-L\s*[–-]\s*MODELO A\s*Página\s+\d+\s+de\s+\d+\.?$/u, '')
  .replace(/\s*NO SE DETENGA\. CONTINÚE EN LA PÁGINA SIGUIENTE\s+\d+\.?$/u, '')
  .trim();

const validateQuestion = question => {
  if (!question.id) throw new Error('Pregunta sin id');
  if (!topicIds.has(question.topicId)) throw new Error(`Tema inexistente en ${question.id}: ${question.topicId}`);
  if (!Array.isArray(question.options) || question.options.length !== 4) throw new Error(`INAP debe tener 4 opciones: ${question.id}`);
  const optionIds = new Set(question.options.map(option => option.id));
  if (optionIds.size !== question.options.length) throw new Error(`Opciones duplicadas en ${question.id}`);
  if (!optionIds.has(question.correctOptionId)) throw new Error(`Respuesta correcta inexistente en ${question.id}`);
  if (question.options.some(option => !normalizeWhitespace(option.text))) throw new Error(`Opción vacía en ${question.id}`);
};

await mkdir(importDir, { recursive: true });
await mkdir(draftsDir, { recursive: true });

const inapPath = join(importDir, 'preguntas-inap-administrativo-2024.json');
const m2Path = join(importDir, 'preguntas-m2-igualdad-audiovisual-2023.json');
const rawInap = JSON.parse(await readFile(inapPath, 'utf8'));
const rawM2 = JSON.parse(await readFile(m2Path, 'utf8'));

const incomingInap = rawInap.map(item => {
  const question = structuredClone(item);
  question.prompt = normalizeWhitespace(question.prompt);
  question.options = question.options.map(option => ({
    ...option,
    text: cleanPdfArtifacts(option.text)
  }));
  question.active = true;
  question.optionCount = question.options.length;
  question.origin = {
    ...question.origin,
    type: 'official_exam',
    historical: true,
    label: question.origin?.label || 'INAP Administrativo del Estado · 2024',
    questionNumber: question.origin?.questionNumber ?? question.origin?.numeroOriginal
  };
  validateQuestion(question);
  return question;
});

const draftM2 = rawM2.map(item => ({
  ...item,
  active: false,
  reviewStatus: 'pending-options-reconstruction',
  reviewNote: 'No se incorpora al banco activo porque el fichero recibido tiene opciones vacías o pegadas en un solo campo. Requiere reconstruir A/B/C desde el cuestionario oficial antes de usarla.'
}));

const imported = [];
const skippedExistingIds = [];
for (const question of incomingInap) {
  if (existingIds.has(question.id)) {
    skippedExistingIds.push(question.id);
    continue;
  }
  questions.push(question);
  existingIds.add(question.id);
  imported.push(question.id);
}

const report = {
  source: 'data/imports/nuevas-preguntas-2026-08-01',
  importedInap: imported.length,
  skippedExistingIds,
  m2StoredAsDraft: draftM2.length,
  m2Reason: 'Opciones incompletas en el JSON recibido'
};

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(join(draftsDir, 'preguntas-m2-igualdad-audiovisual-2023-pendientes.json'), `${JSON.stringify(draftM2, null, 2)}\n`, 'utf8');
await writeFile(join(importDir, 'import-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`INAP 2024 importadas: ${imported.length}; M2 2023 guardadas como borrador: ${draftM2.length}.`);
