import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const file = join(root, 'data/questions.json');
const replacements = {
  'm3-admin-008': 'Un registro específico para recursos administrativos.',
  'm3-admin-010': 'A las autoridades y al personal competente, pero no a los interesados.',
  'm3-admin-016': 'Solo la identificación del órgano que resuelve, sin acceso al expediente.'
};
const questions = JSON.parse(await readFile(file, 'utf8'));
for (const question of questions) {
  if (!replacements[question.id]) continue;
  const seen = new Set();
  for (const option of question.options) {
    const key = option.text.trim().toLocaleLowerCase('es-ES');
    if (seen.has(key)) option.text = replacements[question.id];
    seen.add(option.text.trim().toLocaleLowerCase('es-ES'));
  }
}
await writeFile(file, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log('Corregidas 3 colisiones de distractores.');
