import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const bankPath = join(root, 'data/questions.json');
const sourceDir = join(root, 'data/historical-exams/m1-cultura-2023');
const targetId = 'm1-cultura-maquinaria-2023-61';
const original = new Map();
for (const file of (await readdir(sourceDir)).filter((name) => name.startsWith('preguntas-m1-cultura-') && name.endsWith('.json'))) {
  for (const question of JSON.parse(await readFile(join(sourceDir, file), 'utf8'))) original.set(question.id, question);
}
const bank = JSON.parse(await readFile(bankPath, 'utf8'));
const question = bank.find((item) => item.id === targetId);
if (!question || question.optionMigration?.source !== 'm1-pool5-curated') throw new Error(`No se encuentra la migración excedente: ${targetId}`);
question.options = original.get(targetId).options;
delete question.optionsOrigin;
delete question.optionMigration;
if (question.source?.note) delete question.source.note;
await writeFile(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
console.log(`Revertida la pregunta excedente ${targetId}; se mantiene el déficit exacto de especifico-30.`);
