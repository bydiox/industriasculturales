import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDir = join(root, 'data/imports/m1-para-m3-final/preguntas');
const questionsPath = join(root, 'data/questions.json');
const reportPath = join(root, 'data/imports/m1-para-m3-final/import-report.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const topicIds = new Set(syllabus.topics.map(topic => topic.id));

const normalize = value => String(value || '')
  .normalize('NFKC')
  .toLocaleLowerCase('es-ES')
  .replace(/\s+/g, ' ')
  .replace(/[¿?¡!.,;:()[\]{}"'“”‘’]/g, '')
  .trim();
const questionKey = question => `${normalize(question.prompt)}||${question.options.map(option => normalize(option.text)).sort().join('|')}`;
const labelFor = origin => `M1 · ${origin.especialidad || 'Ministerio de Cultura'} · ${String(origin.fecha || '').slice(0, 4)}`;

const files = (await readdir(sourceDir)).filter(name => name.endsWith('.json')).sort();
const incoming = [];
for (const file of files) {
  const batch = JSON.parse(await readFile(join(sourceDir, file), 'utf8'));
  if (!Array.isArray(batch)) throw new Error(`El fichero no contiene una lista: ${file}`);
  for (const raw of batch) {
    const question = structuredClone(raw);
    if (!topicIds.has(question.topicId)) throw new Error(`Tema M3 inexistente en ${question.id}: ${question.topicId}`);
    if (![3, 4].includes(question.options?.length)) throw new Error(`Número de opciones inválido en ${question.id}`);
    if (!question.correctOptionId || !question.options.some(option => option.id === question.correctOptionId)) {
      throw new Error(`Respuesta correcta inexistente en ${question.id}`);
    }
    if (question.source?.kind !== 'official_exam' || !question.source.reference) {
      throw new Error(`Procedencia oficial incompleta en ${question.id}`);
    }
    question.active = true;
    question.optionCount = question.options.length;
    question.origin = {
      ...question.origin,
      type: 'official_exam',
      historical: true,
      label: question.origin.label || labelFor(question.origin),
      questionNumber: question.origin.questionNumber ?? question.origin.numeroOriginal
    };
    incoming.push(question);
  }
}

const byId = new Map(questions.map((question, index) => [question.id, { question, index }]));
const byKey = new Map(questions.map((question, index) => [questionKey(question), { question, index }]));
const report = {
  source: 'data/imports/m1-para-m3-final',
  sourceQuestions: incoming.length,
  imported: [],
  skippedExistingIds: [],
  skippedDuplicates: [],
  replacedWithFourOptions: [],
  optionCounts: { 3: 0, 4: 0 }
};

for (const question of incoming) {
  report.optionCounts[question.options.length] += 1;
  const existingById = byId.get(question.id);
  if (existingById) {
    const promptDiffers = normalize(existingById.question.prompt) !== normalize(question.prompt);
    const sameOfficialM1Lineage = question.origin?.grupo === 'M1'
      && existingById.question.origin?.grupo === 'M1'
      && existingById.question.origin?.type === 'official_exam';
    if (promptDiffers && !sameOfficialM1Lineage) {
      throw new Error(`Colisión de ID con enunciado distinto: ${question.id}`);
    }
    report.skippedExistingIds.push({ id: question.id, keptOptionCount: existingById.question.options.length, incomingOptionCount: question.options.length, promptDiffers });
    continue;
  }

  const existingByKey = byKey.get(questionKey(question));
  if (existingByKey) {
    if (question.options.length > existingByKey.question.options.length) {
      questions[existingByKey.index] = question;
      byId.delete(existingByKey.question.id);
      byId.set(question.id, { question, index: existingByKey.index });
      byKey.set(questionKey(question), { question, index: existingByKey.index });
      report.replacedWithFourOptions.push({ removedId: existingByKey.question.id, importedId: question.id });
    } else {
      report.skippedDuplicates.push({ id: question.id, keptId: existingByKey.question.id });
    }
    continue;
  }

  const index = questions.push(question) - 1;
  byId.set(question.id, { question, index });
  byKey.set(questionKey(question), { question, index });
  report.imported.push(question.id);
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Paquete M1 procesado: ${report.imported.length} nuevas, ${report.skippedExistingIds.length} IDs ya presentes, ${report.skippedDuplicates.length} duplicados y ${report.replacedWithFourOptions.length} reemplazos por versión de cuatro opciones.`);
