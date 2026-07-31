import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const path = join(root, 'data/questions.json');
const replacements = {
  'm1-cultura-asistencia-2023-52': 'Informarse recíprocamente de los riesgos existentes.',
  'm1-cultura-produccion-2023-54': 'Es una factura que solo puede emitirse a una Administración Pública.',
  'm1-cultura-produccion-2023-57': 'Exige siempre que el receptor disponga de un certificado digital.',
  'm1-cultura-produccion-2023-107': 'Sí, aunque el importe conjunto pueda superar el coste de la actividad subvencionada.'
};
const questions = JSON.parse(await readFile(path, 'utf8'));
for (const [id, text] of Object.entries(replacements)) {
  const question = questions.find((item) => item.id === id);
  if (!question || question.optionMigration?.source !== 'm1-pool5-curated') throw new Error(`No se encuentra una migración curada: ${id}`);
  question.options.find((option) => option.id === 'd').text = text;
}
await writeFile(path, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Refinadas ${Object.keys(replacements).length} opciones editoriales M1.`);
