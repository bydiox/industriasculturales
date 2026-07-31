import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const sourcePath = join(root, 'data/historical-exams/preguntas-oficiales-igualdad-M3-2023.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const incoming = JSON.parse(await readFile(sourcePath, 'utf8'));
const existingIds = new Set(questions.map(question => question.id));
const existingPrompts = new Set(questions.map(question => question.prompt.trim().toLocaleLowerCase('es-ES')));

for (const question of incoming) {
  if (existingIds.has(question.id)) throw new Error(`ID oficial duplicado: ${question.id}`);
  if (question.options?.length !== 3) throw new Error(`${question.id}: el cuestionario histórico debe conservar sus tres opciones originales`);
  if (!question.origin?.type || !question.origin?.cuestionario || !question.origin?.plantilla) {
    throw new Error(`${question.id}: falta procedencia oficial completa`);
  }
  if (existingPrompts.has(question.prompt.trim().toLocaleLowerCase('es-ES'))) {
    throw new Error(`${question.id}: enunciado duplicado en el banco`);
  }
  question.active = true;
  question.origin.historical = true;
  question.origin.type = 'official_exam';
  question.origin.label = 'M3 Ciencias de la Información · Ministerio de Igualdad · 2023';
  question.origin.questionNumber = question.origin.numeroOriginal;
  question.origin.questionnaire = question.origin.cuestionario;
  question.origin.answerKey = question.origin.plantilla;
  question.optionCount = 3;
}

await writeFile(questionsPath, `${JSON.stringify([...questions, ...incoming], null, 2)}\n`, 'utf8');
console.log(`Importadas ${incoming.length} preguntas oficiales del Ministerio de Igualdad (2023).`);
