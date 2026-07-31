import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const pool = JSON.parse(await readFile(join(root, 'data/pool-target.json'), 'utf8'));
const current = {};
const migrated = {};
for (const question of questions) {
  const active = question.active === true || (question.active !== false && question.origin?.historical !== true);
  if (!active || question.options?.length !== 4) continue;
  current[question.topicId] = (current[question.topicId] || 0) + 1;
  if (question.optionMigration?.source === 'm1-pool5-curated') migrated[question.topicId] = (migrated[question.topicId] || 0) + 1;
}
const byTopic = {};
const postMigrationByTopic = {};
for (const [topicId, target] of Object.entries(pool.byTopic)) {
  const activeCount = current[topicId] || 0;
  const baselineCount = Math.max(0, activeCount - (migrated[topicId] || 0));
  byTopic[topicId] = { pool5: target.pool5, activeCount: baselineCount, deficit: Math.max(0, target.pool5 - baselineCount) };
  postMigrationByTopic[topicId] = { pool5: target.pool5, activeCount, deficit: Math.max(0, target.pool5 - activeCount) };
}
const deficitTopics = Object.entries(byTopic).filter(([, item]) => item.deficit > 0).map(([topicId]) => topicId);
const remainingDeficitTopics = Object.entries(postMigrationByTopic).filter(([, item]) => item.deficit > 0).map(([topicId]) => topicId);
const sum = (table) => Object.values(table).reduce((total, item) => total + item.deficit, 0);
const migratedQuestions = Object.values(migrated).reduce((total, count) => total + count, 0);
const output = {
  schemaVersion: 1,
  status: 'active',
  note: 'Déficit operativo de preguntas activas con cuatro opciones frente a pool5. El bloque byTopic es la línea base previa a la migración; postMigrationByTopic refleja el estado resultante. Las preguntas históricas de tres opciones no se cuentan.',
  generatedAt: '2026-07-31',
  baselineBeforeMigration: {
    deficitTopics: deficitTopics.length,
    deficitQuestions: sum(byTopic),
    activeFourOptionQuestions: Object.values(byTopic).reduce((total, item) => total + item.activeCount, 0)
  },
  byTopic,
  deficitTopics,
  migration: {
    source: 'm1-cultura-2023',
    migratedQuestions,
    strategy: 'curated-distractors',
    remainingDeficitTopics: remainingDeficitTopics.length,
    remainingDeficitQuestions: sum(postMigrationByTopic)
  },
  postMigrationByTopic,
  remainingDeficitTopics
};
await writeFile(join(root, 'data/pool5-deficit.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Pool5 finalizado: línea base ${deficitTopics.length} temas/${sum(byTopic)} preguntas; después ${remainingDeficitTopics.length} temas/${sum(postMigrationByTopic)} preguntas.`);
