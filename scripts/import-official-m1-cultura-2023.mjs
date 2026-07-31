import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceDir = join(root, 'data/historical-exams/m1-cultura-2023');
const questionsPath = join(root, 'data/questions.json');
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const topicIds = new Set(syllabus.topics.map((topic) => topic.id));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const existingIds = new Set(questions.map((question) => question.id));
const incoming = [];

for (const file of (await readdir(sourceDir)).filter((name) => name.startsWith('preguntas-m1-cultura-') && name.endsWith('.json'))) {
  const batch = JSON.parse(await readFile(join(sourceDir, file), 'utf8'));
  for (const question of batch) {
    if (existingIds.has(question.id) || incoming.some((item) => item.id === question.id)) throw new Error(`ID oficial M1 duplicado: ${question.id}`);
    if (!topicIds.has(question.topicId)) throw new Error(`Tema M3 inexistente en ${question.id}: ${question.topicId}`);
    if (question.options?.length !== 3 || !question.correctOptionId || !question.options.some((option) => option.id === question.correctOptionId)) {
      throw new Error(`Pregunta M1 incompleta o con formato inesperado: ${question.id}`);
    }
    if (question.source?.kind !== 'official_exam' || question.origin?.historical !== true || question.active !== true) {
      throw new Error(`Procedencia o estado inválido en ${question.id}`);
    }
    incoming.push(question);
  }
}

await writeFile(questionsPath, `${JSON.stringify([...questions, ...incoming], null, 2)}\n`, 'utf8');
console.log(`Importadas ${incoming.length} preguntas oficiales M1 Cultura (2023).`);
