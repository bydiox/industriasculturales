import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const pool = JSON.parse(await readFile(join(root, 'data/pool-target.json'), 'utf8'));
const counts = {};
for (const question of questions) {
  const active = question.active === true || (question.active !== false && question.origin?.historical !== true);
  if (active && question.options?.length === 4) counts[question.topicId] = (counts[question.topicId] || 0) + 1;
}
const byTopic = Object.fromEntries(Object.entries(pool.byTopic).map(([topicId, target]) => {
  const activeCount = counts[topicId] || 0;
  return [topicId, { pool5: target.pool5, activeCount, deficit: Math.max(0, target.pool5 - activeCount) }];
}));
const deficitTopics = Object.entries(byTopic).filter(([, item]) => item.deficit > 0).map(([topicId]) => topicId);
await writeFile(join(root, 'data/pool5-deficit.json'), `${JSON.stringify({
  schemaVersion: 1,
  status: 'active',
  note: 'Déficit operativo de preguntas activas con cuatro opciones frente a pool5. Las preguntas históricas de tres opciones no se cuentan; las migraciones editoriales sí.',
  generatedAt: new Date().toISOString().slice(0, 10),
  byTopic,
  deficitTopics
}, null, 2)}\n`, 'utf8');
console.log(`Déficit pool5: ${deficitTopics.length} temas y ${deficitTopics.reduce((sum, topicId) => sum + byTopic[topicId].deficit, 0)} preguntas.`);
