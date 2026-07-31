import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
let normalized = 0;
for (const question of questions.filter(item => item.id.startsWith('m3-oficial-igualdad-2023-'))) {
  question.origin = {
    ...question.origin,
    label: 'M3 Ciencias de la Información · Ministerio de Igualdad · 2023',
    questionNumber: question.origin.numeroOriginal,
    questionnaire: question.origin.cuestionario,
    answerKey: question.origin.plantilla
  };
  normalized += 1;
}
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Normalizadas ${normalized} preguntas oficiales de Igualdad.`);
