import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const bankPath = join(root, 'data/questions.json');
const deficitPath = join(root, 'data/pool5-deficit.json');
const sourceDir = join(root, 'data/historical-exams/m1-cultura-2023');

const deficit = JSON.parse(await readFile(deficitPath, 'utf8'));
const baselineByTopic = deficit.byTopic;
const original = new Map();
for (const file of (await readdir(sourceDir)).filter((name) => name.startsWith('preguntas-m1-cultura-') && name.endsWith('.json'))) {
  for (const question of JSON.parse(await readFile(join(sourceDir, file), 'utf8'))) original.set(question.id, question);
}

const bank = JSON.parse(await readFile(bankPath, 'utf8'));
const candidates = bank.filter((question) => question.optionMigration?.source === 'm1-pool5-curated');
const keepByTopic = new Map();
for (const question of candidates) {
  const target = baselineByTopic[question.topicId];
  const isDeficitTopic = target && target.deficit > 0;
  if (!isDeficitTopic) {
    const source = original.get(question.id);
    if (!source) throw new Error(`No se encuentra la versión original de ${question.id}`);
    question.options = source.options;
    delete question.optionsOrigin;
    delete question.optionMigration;
    if (question.source?.note) delete question.source.note;
    continue;
  }
  const kept = keepByTopic.get(question.topicId) || 0;
  if (kept < target.deficit) {
    keepByTopic.set(question.topicId, kept + 1);
    continue;
  }
  const source = original.get(question.id);
  if (!source) throw new Error(`No se encuentra la versión original de ${question.id}`);
  question.options = source.options;
  delete question.optionsOrigin;
  delete question.optionMigration;
  if (question.source?.note) delete question.source.note;
}

const keptIds = new Set();
for (const question of bank) {
  if (question.optionMigration?.source === 'm1-pool5-curated') keptIds.add(question.id);
}
const reverted = candidates.length - keptIds.size;
const migrated = keptIds.size;
const remainingDeficitTopics = Object.entries(baselineByTopic)
  .filter(([topicId, item]) => item.deficit > 0 && (item.deficit - (keepByTopic.get(topicId) || 0)) > 0)
  .map(([topicId]) => topicId);
const remainingDeficitQuestions = Object.entries(baselineByTopic)
  .reduce((sum, [topicId, item]) => sum + Math.max(0, item.deficit - (keepByTopic.get(topicId) || 0)), 0);

deficit.migration = {
  source: 'm1-cultura-2023',
  migratedQuestions: migrated,
  strategy: 'curated-distractors',
  remainingDeficitTopics: remainingDeficitTopics.length,
  remainingDeficitQuestions
};
await writeFile(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
await writeFile(deficitPath, `${JSON.stringify(deficit, null, 2)}\n`, 'utf8');
console.log(`Conservadas ${migrated} migraciones curadas y revertidas ${reverted} fuera del déficit exacto.`);
