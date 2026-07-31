import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const bankPath = join(root, 'data/questions.json');
const sourceDir = join(root, 'data/historical-exams/m1-cultura-2023');
const original = new Map();
for (const file of (await readdir(sourceDir)).filter((name) => name.startsWith('preguntas-m1-cultura-') && name.endsWith('.json'))) {
  for (const question of JSON.parse(await readFile(join(sourceDir, file), 'utf8'))) original.set(question.id, question);
}
const bank = JSON.parse(await readFile(bankPath, 'utf8'));
let reset = 0;
for (const question of bank) {
  if (question.optionMigration?.source !== 'm1-pool5-curated') continue;
  const source = original.get(question.id);
  if (!source) throw new Error(`No se encuentra la versión original de ${question.id}`);
  question.options = source.options;
  delete question.optionsOrigin;
  delete question.optionMigration;
  if (question.source?.note) delete question.source.note;
  reset += 1;
}
await writeFile(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
console.log(`Restauradas ${reset} preguntas curadas a sus tres opciones oficiales.`);
