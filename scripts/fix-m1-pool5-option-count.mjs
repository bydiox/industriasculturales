import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const path = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(path, 'utf8'));
let fixed = 0;
for (const question of questions) {
  if (question.optionMigration?.source !== 'm1-pool5-curated') continue;
  if (question.options.length !== 4) throw new Error(`${question.id}: se esperaba una migración de cuatro opciones`);
  question.optionCount = 4;
  fixed += 1;
}
await writeFile(path, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Actualizado optionCount=4 en ${fixed} preguntas migradas.`);
