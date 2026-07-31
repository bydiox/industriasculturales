import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { correctPositionCounts, optionProblems } from '../src/option-quality.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const active = questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
const expectedOptions = JSON.parse(await readFile(join(root, 'data/exam-config.json'), 'utf8')).firstExercise.optionsPerQuestion;
const counts = {};
const problems = [];
for (const question of active) {
  counts[question.options.length] = (counts[question.options.length] || 0) + 1;
  const issue = optionProblems(question);
  if (issue.length) problems.push({ id: question.id, issues: issue });
}
const storedCorrectPosition = correctPositionCounts(active, expectedOptions);
if (problems.length) {
  console.error(`ERROR: ${problems.length} preguntas tienen opciones duplicadas o respuesta correcta inválida.`);
  console.error(JSON.stringify(problems, null, 2));
  process.exitCode = 1;
}
console.log(JSON.stringify({
  active: active.length,
  options: counts,
  expectedOptions,
  storedCorrectPosition,
  note: 'La interfaz baraja las opciones al mostrar cada pregunta.'
}, null, 2));
