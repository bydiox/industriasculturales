import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const targetIds = new Set([
  'm1-cultura-asistencia-2023-64',
  'm1-cultura-asistencia-2023-65',
  'm1-cultura-asistencia-2023-67',
  'm1-cultura-asistencia-2023-68',
  'm1-cultura-asistencia-2023-75',
  'm1-cultura-asistencia-2023-77',
  'm1-cultura-asistencia-2023-78',
  'm1-cultura-asistencia-2023-79',
  'm1-cultura-asistencia-2023-80',
  'm1-cultura-asistencia-2023-81',
  'm1-cultura-asistencia-2023-88',
  'm1-cultura-asistencia-2023-89',
  'm1-cultura-asistencia-2023-90',
  'm1-cultura-asistencia-2023-91',
  'm1-cultura-asistencia-2023-92',
  'm1-cultura-maquinaria-2023-37',
  'm1-cultura-maquinaria-2023-55'
]);

let reverted = 0;
for (const question of questions) {
  if (!targetIds.has(question.id)) continue;
  const before = question.options?.length || 0;
  question.options = (question.options || []).filter(option => String(option.id).toLowerCase() !== 'd');
  question.optionCount = question.options.length;
  delete question.optionMigration;
  if (question.source?.note?.includes('cuarta')) delete question.source.note;
  if (before !== question.options.length) reverted += 1;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Revertidas a tres opciones oficiales: ${reverted}`);
