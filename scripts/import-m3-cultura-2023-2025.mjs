import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDir = join(root, 'data/imports/m3-cultura-2023-2025');
const questionsPath = join(root, 'data/questions.json');
const reportPath = join(sourceDir, 'import-report.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
let questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const topicIds = new Set(syllabus.topics.map(topic => topic.id));

const normalize = value => String(value || '')
  .normalize('NFKC')
  .toLocaleLowerCase('es-ES')
  .replace(/\s+/g, ' ')
  .replace(/[¿?¡!.,;:()[\]{}"'“”‘’]/g, '')
  .trim();
const questionKey = question => `${normalize(question.prompt)}||${question.options.map(option => normalize(option.text)).sort().join('|')}`;

const discardedFiles = (await readdir(sourceDir)).filter(name => name.startsWith('preguntas-m3-descartadas') && name.endsWith('.json'));
const discardedIds = new Set();
for (const file of discardedFiles) {
  const discarded = JSON.parse(await readFile(join(sourceDir, file), 'utf8'));
  for (const question of discarded) discardedIds.add(question.id);
}
const beforeDiscardRemoval = questions.length;
questions = questions.filter(question => !discardedIds.has(question.id));
const files = (await readdir(sourceDir)).filter(name => name.endsWith('.json') && name !== 'import-report.json' && !name.startsWith('preguntas-m3-descartadas')).sort();
const incoming = [];
for (const file of files) {
  const raw = JSON.parse(await readFile(join(sourceDir, file), 'utf8'));
  if (!Array.isArray(raw)) throw new Error(`El fichero no contiene una lista: ${file}`);
  for (const item of raw) {
    const question = structuredClone(item);
    if (!topicIds.has(question.topicId)) throw new Error(`Tema M3 inexistente en ${question.id}: ${question.topicId}`);
    if (![3, 4].includes(question.options?.length)) throw new Error(`Número de opciones inválido en ${question.id}`);
    if (!question.correctOptionId || !question.options.some(option => option.id === question.correctOptionId)) {
      throw new Error(`Respuesta correcta inexistente en ${question.id}`);
    }
    if (question.source?.kind !== 'official_exam' || !question.source.reference) throw new Error(`Procedencia incompleta en ${question.id}`);
    question.active = question.active !== false;
    question.optionCount = question.options.length;
    question.origin = {
      ...question.origin,
      type: 'official_exam',
      historical: true,
      label: question.origin.label || `M3 · ${question.origin.especialidad || 'Ministerio de Cultura'} · ${String(question.origin.fecha || '').slice(0, 4)}`,
      questionNumber: question.origin.questionNumber ?? question.origin.numeroOriginal
    };
    incoming.push(question);
  }
}

const byId = new Map(questions.map((question, index) => [question.id, { question, index }]));
const byKey = new Map(questions.map((question, index) => [questionKey(question), { question, index }]));
const report = { source: 'data/imports/m3-cultura-2023-2025', sourceQuestions: incoming.length, removedDiscardedFromBank: beforeDiscardRemoval - questions.length, imported: [], skippedExistingIds: [], skippedDuplicates: [], optionCounts: { 3: 0, 4: 0 } };

for (const question of incoming) {
  report.optionCounts[question.options.length] += 1;
  if (byId.has(question.id)) {
    report.skippedExistingIds.push(question.id);
    continue;
  }
  const duplicate = byKey.get(questionKey(question));
  if (duplicate) {
    report.skippedDuplicates.push({ id: question.id, keptId: duplicate.question.id });
    continue;
  }
  const index = questions.push(question) - 1;
  byId.set(question.id, { question, index });
  byKey.set(questionKey(question), { question, index });
  report.imported.push(question.id);
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Preguntas M3 Cultura procesadas: ${report.imported.length} nuevas, ${report.skippedExistingIds.length} IDs ya presentes y ${report.skippedDuplicates.length} duplicados.`);
