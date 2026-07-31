import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const fourth = {
  'm3-common-009': 'Soberanía territorial independiente de las Comunidades Autónomas.',
  'm3-common-010': 'Una circunscripción judicial sin personalidad jurídica ni funciones territoriales propias.',
  'm3-common-011': 'Pueden establecer cualquier tributo sin límites constitucionales ni legales.',
  'm3-common-012': 'Cada Comunidad Autónoma puede impedir la prestación de servicios procedentes de otra.'
};
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
for (const [id, text] of Object.entries(fourth)) {
  const question = questions.find((candidate) => candidate.id === id);
  if (!question) throw new Error(`No se encontró ${id}`);
  if (question.options.length !== 3) throw new Error(`${id}: formato inesperado`);
  question.options = [...question.options, { id: 'd', text }];
  question.optionMigration = { version: 1, migratedAt: '2026-07-31', source: 'third-legal-batch' };
}
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log('Completada la corrección territorial: 4 preguntas migradas.');
