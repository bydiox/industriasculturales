import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const topicIds = new Set(syllabus.topics.map(topic => topic.id));

const batches = [
  {
    dir: 'data/imports/inap-egoa-2019',
    file: 'preguntas-inap-egoa-2019.json',
    label: 'INAP Escala de Gestión de Organismos Autónomos · 2019',
    footerPattern: /\s*Página\s+\d+\s+de\s+\d+\s+2019\s+EGOA-ES\.?$/u
  },
  {
    dir: 'data/imports/inap-etgoa-a1-2024',
    file: 'preguntas-inap-etgoa-A1-2024.json',
    label: 'INAP Escala Técnica de Gestión de Organismos Autónomos · A1 · 2024',
    footerPattern: /\s*2024\s*-\s*ETGOA-L\s*Página\s+\d+\s+de\s+\d+\.?$/u
  }
];

const normalizeWhitespace = text => String(text || '').replace(/\s+/g, ' ').trim();
const normalizeKey = text => normalizeWhitespace(text)
  .normalize('NFKC')
  .toLocaleLowerCase('es-ES')
  .replace(/[¿?¡!.,;:()[\]{}"'“”‘’]/g, '')
  .trim();
const questionKey = question => `${normalizeKey(question.prompt)}@@${question.options.map(option => normalizeKey(option.text)).sort().join('@@')}`;

const cleanPdfArtifacts = (text, footerPattern) => normalizeWhitespace(text)
  .replace(footerPattern, '')
  .replace(/\s*NO SE DETENGA\. CONTINÚE EN LA PÁGINA SIGUIENTE\s+\d+\.?$/u, '')
  .replace(/\.\s+\d+$/u, '.')
  .trim();

const validateQuestion = question => {
  if (!question.id) throw new Error('Pregunta sin id');
  if (!topicIds.has(question.topicId)) throw new Error(`Tema inexistente en ${question.id}: ${question.topicId}`);
  if (!Array.isArray(question.options) || question.options.length !== 4) throw new Error(`Pregunta oficial sin 4 opciones: ${question.id}`);
  const optionIds = new Set(question.options.map(option => option.id));
  if (optionIds.size !== question.options.length) throw new Error(`Opciones duplicadas en ${question.id}`);
  if (!optionIds.has(question.correctOptionId)) throw new Error(`Respuesta correcta inexistente en ${question.id}`);
  if (question.options.some(option => !normalizeWhitespace(option.text))) throw new Error(`Opción vacía en ${question.id}`);
  if (question.source?.kind !== 'official_exam' || !question.source.reference) throw new Error(`Procedencia incompleta en ${question.id}`);
};

const byId = new Map(questions.map(question => [question.id, question]));
const byKey = new Map(questions.map(question => [questionKey(question), question]));
const report = {
  imported: {},
  skippedExistingIds: {},
  skippedDuplicates: {}
};

for (const batch of batches) {
  const importDir = join(root, batch.dir);
  await mkdir(importDir, { recursive: true });
  const rawIncoming = JSON.parse(await readFile(join(importDir, batch.file), 'utf8'));
  if (!Array.isArray(rawIncoming)) throw new Error(`El fichero no contiene una lista de preguntas: ${batch.file}`);

  const imported = [];
  const skippedExistingIds = [];
  const skippedDuplicates = [];

  for (const item of rawIncoming) {
    const question = structuredClone(item);
    question.prompt = cleanPdfArtifacts(question.prompt, batch.footerPattern);
    question.options = question.options.map(option => ({
      ...option,
      text: cleanPdfArtifacts(option.text, batch.footerPattern)
    }));
    question.active = true;
    question.optionCount = question.options.length;
    question.origin = {
      ...question.origin,
      type: 'official_exam',
      historical: true,
      label: question.origin?.label || batch.label,
      questionNumber: question.origin?.questionNumber ?? question.origin?.numeroOriginal
    };
    validateQuestion(question);

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

  report.imported[batch.file] = imported.length;
  report.skippedExistingIds[batch.file] = skippedExistingIds;
  report.skippedDuplicates[batch.file] = skippedDuplicates;
  await writeFile(join(importDir, 'import-report.json'), `${JSON.stringify({
    source: batch.dir,
    sourceQuestions: rawIncoming.length,
    imported: imported.length,
    skippedExistingIds,
    skippedDuplicates
  }, null, 2)}\n`, 'utf8');
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Importación EGOA/ETGOA completada: ${JSON.stringify(report.imported)}`);
