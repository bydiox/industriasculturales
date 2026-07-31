import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const syllabus = JSON.parse(await readFile(join(root, 'data/syllabus.json'), 'utf8'));
const active = questions.filter((question) => question.active !== false && question.origin?.type !== 'official_exam');
const topics = new Map(syllabus.topics.map((topic) => [topic.id, topic.title]));

// Indicador editorial, no validador jurídico: sirve para localizar enunciados
// genéricos que conviene revisar, no para decidir automáticamente que una pregunta sea mala.
const broadPatterns = [
  /^¿qué es /i,
  /^¿qué son /i,
  /^¿qué finalidad general/i,
  /^¿qué regula /i,
  /^¿cuál es el objeto/i,
  /^¿cuál es la finalidad/i,
  /^¿qué principios rigen/i
];
const counts = new Map();
const migrated = active.filter((question) => ['priority-legal-batch', 'second-legal-batch', 'third-legal-batch', 'specific-legal-batch'].includes(question.optionMigration?.source));
const isBroad = (question) => broadPatterns.some((pattern) => pattern.test(question.prompt.trim()));
for (const question of active) {
  const row = counts.get(question.topicId) || { total: 0, broad: 0 };
  row.total += 1;
  if (isBroad(question)) row.broad += 1;
  counts.set(question.topicId, row);
}

console.log('Auditoría editorial: definicionales frente a dato concreto (heurística, no fallo de build)');
const migratedBroad = migrated.filter(isBroad).length;
console.log(`Lote migrado prioritario: ${migrated.length} preguntas; definicionales amplias=${migratedBroad}; dato concreto=${migrated.length - migratedBroad}`);
for (const [topicId, row] of [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const concrete = row.total - row.broad;
  const marker = row.broad > concrete ? '  AVISO: revisar proporción' : '';
  console.log(`${topicId}\t${topics.get(topicId) || '(sin título)'}\t total=${row.total}\t definicional=${row.broad}\t concreto=${concrete}${marker}`);
}
