import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const importDir = join(root, 'data/imports/inap-gestion-a2-2022');
const questionsPath = join(root, 'data/questions.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const topicIds = new Set(syllabus.topics.map(topic => topic.id));

const normalizeWhitespace = text => String(text || '').replace(/\s+/g, ' ').trim();
const normalizeKey = text => normalizeWhitespace(text)
  .normalize('NFKC')
  .toLocaleLowerCase('es-ES')
  .replace(/[¿?¡!.,;:()[\]{}"'“”‘’]/g, '')
  .trim();
const questionKey = question => `${normalizeKey(question.prompt)}@@${question.options.map(option => normalizeKey(option.text)).sort().join('@@')}`;

const cleanPdfArtifacts = text => normalizeWhitespace(text)
  .replace(/\s*2022\s*-\s*GACE-L\s*Página\s+\d+\s+de\s+\d+(?:\s+Preguntas de reserva)?\.?$/u, '')
  .replace(/\s*NO SE DETENGA\. CONTINÚE EN LA PÁGINA SIGUIENTE\s+\d+\.?$/u, '')
  .trim();

const validateQuestion = question => {
  if (!question.id) throw new Error('Pregunta sin id');
  if (!topicIds.has(question.topicId)) throw new Error(`Tema inexistente en ${question.id}: ${question.topicId}`);
  if (!Array.isArray(question.options) || question.options.length !== 4) throw new Error(`A2 debe tener 4 opciones: ${question.id}`);
  const optionIds = new Set(question.options.map(option => option.id));
  if (optionIds.size !== question.options.length) throw new Error(`Opciones duplicadas en ${question.id}`);
  if (!optionIds.has(question.correctOptionId)) throw new Error(`Respuesta correcta inexistente en ${question.id}`);
  if (question.options.some(option => !normalizeWhitespace(option.text))) throw new Error(`Opción vacía en ${question.id}`);
  if (question.source?.kind !== 'official_exam' || !question.source.reference) throw new Error(`Procedencia incompleta en ${question.id}`);
};

await mkdir(importDir, { recursive: true });

const incomingPath = join(importDir, 'preguntas-inap-gestion-A2-2022.json');
const rawIncoming = JSON.parse(await readFile(incomingPath, 'utf8'));
if (!Array.isArray(rawIncoming)) throw new Error('El fichero A2 2022 no contiene una lista de preguntas');

const incoming = rawIncoming.map(item => {
  const question = structuredClone(item);
  question.prompt = cleanPdfArtifacts(question.prompt);
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
    label: question.origin?.label || 'INAP Gestión de la Administración Civil del Estado · A2 · 2022',
    questionNumber: question.origin?.questionNumber ?? question.origin?.numeroOriginal
  };
  validateQuestion(question);
  return question;
});

const byId = new Map(questions.map(question => [question.id, question]));
const byKey = new Map(questions.map(question => [questionKey(question), question]));
const imported = [];
const skippedExistingIds = [];
const skippedDuplicates = [];

for (const question of incoming) {
  if (byId.has(question.id)) {
    skippedExistingIds.push(question.id);
    continue;
  }
  const duplicate = byKey.get(questionKey(question));
  if (duplicate) {
    skippedDuplicates.push({ id: question.id, keptId: duplicate.id });
    continue;
  }
  questions.push(question);
  byId.set(question.id, question);
  byKey.set(questionKey(question), question);
  imported.push(question.id);
}

const report = {
  source: 'data/imports/inap-gestion-a2-2022',
  sourceQuestions: incoming.length,
  imported: imported.length,
  skippedExistingIds,
  skippedDuplicates
};

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(join(importDir, 'import-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`INAP Gestión A2 2022: ${imported.length} importadas, ${skippedDuplicates.length} duplicadas omitidas.`);
