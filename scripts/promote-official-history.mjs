import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const topicByQuestionNumber = new Map([
  [36, 'especifico-06'],
  [47, 'especifico-07'],
  [48, 'especifico-06'],
  [59, 'especifico-07'],
  [60, 'especifico-07'],
  [61, 'especifico-07'],
  [62, 'especifico-07'],
  [63, 'especifico-07'],
  [64, 'especifico-07'],
  [65, 'especifico-07'],
  [66, 'especifico-07']
]);

for (const [questionNumber, topicId] of topicByQuestionNumber) {
  const question = questions.find(item => item.origin?.type === 'official_exam' && item.origin.questionNumber === questionNumber);
  if (!question) throw new Error(`No se encontró la pregunta oficial ${questionNumber}`);
  question.active = true;
  question.topicId = topicId;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Promovidas ${topicByQuestionNumber.size} preguntas oficiales a Historia (06/07).`);
