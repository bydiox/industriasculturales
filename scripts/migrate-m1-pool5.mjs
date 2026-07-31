import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const deficitPath = join(root, 'data/pool5-deficit.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const deficitManifest = JSON.parse(await readFile(deficitPath, 'utf8'));
const baseline = deficitManifest.byTopic;
const deficits = Object.fromEntries(Object.entries(baseline).filter(([, item]) => item.deficit > 0).map(([topicId, item]) => [topicId, item.deficit]));
const active = (question) => question.active === true || (question.active !== false && question.origin?.historical !== true);
const m1Candidates = questions.filter((question) => question.id.startsWith('m1-cultura-')
  && question.options?.length === 3
  && question.source?.kind === 'official_exam'
  && question.origin?.historical === true
  && active(question)
  && Object.hasOwn(deficits, question.topicId));

const hash = (text) => [...text].reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7);
const clean = (text) => text.replace(/\s+/gu, ' ').trim();
const forbidden = /^(?:ninguna respuesta|a y b son correctas|todas las anteriores)$/iu;
const chooseDistractor = (question, candidates) => {
  const existing = new Set(question.options.map((option) => clean(option.text).toLocaleLowerCase('es-ES')));
  const lengths = question.options.map((option) => option.text.length).sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)];
  const ranked = candidates
    .flatMap((candidate) => candidate.options.map((option) => ({ candidate, option, text: clean(option.text) })))
    .filter(({ text }) => text && !forbidden.test(text) && !existing.has(text.toLocaleLowerCase('es-ES')))
    .map((entry) => ({ ...entry, score: Math.abs(entry.text.length - median) + (entry.text.length < median * 0.62 || entry.text.length > median * 1.55 ? 1000 : 0) }))
    .sort((a, b) => a.score - b.score || a.text.localeCompare(b.text, 'es'));
  return ranked[0] || null;
};

const selected = [];
const byTopic = new Map();
for (const candidate of m1Candidates) (byTopic.get(candidate.topicId) || (byTopic.set(candidate.topicId, []), byTopic.get(candidate.topicId))).push(candidate);
const topicsByDeficit = Object.keys(deficits).sort((a, b) => deficits[b] - deficits[a] || a.localeCompare(b));
for (const topicId of topicsByDeficit) {
  const candidates = byTopic.get(topicId) || [];
  const count = Math.min(deficits[topicId], candidates.length);
  const fallback = topicId.startsWith('comun-')
    ? questions.filter((item) => item.id.startsWith('m1-cultura-') && item.options?.length === 3 && item.topicId.startsWith('comun-'))
    : candidates;
  for (const question of candidates.slice(0, count)) {
    const distractor = chooseDistractor(question, fallback.filter((candidate) => candidate.id !== question.id));
    if (distractor) selected.push({ question, distractor });
    else console.warn(`AVISO: se deja sin migrar ${question.id}; no hay distractor seguro en su campo.`);
  }
}

const selectedByTopic = {};
for (const { question } of selected) selectedByTopic[question.topicId] = (selectedByTopic[question.topicId] || 0) + 1;
const topicPools = new Map();
for (const question of questions.filter((item) => item.id.startsWith('m1-cultura-') && item.options?.length === 3)) {
  (topicPools.get(question.topicId) || (topicPools.set(question.topicId, []), topicPools.get(question.topicId))).push(question);
}

for (const { question, distractor } of selected) {
  const originalOptions = question.options.map((option) => ({ ...option }));
  question.options = [...originalOptions, { id: 'd', text: distractor.text }];
  // Los optionId se conservan para que el motor y el progreso sigan siendo estables;
  // la interfaz ya baraja las opciones al mostrar cada pregunta.
  const shift = hash(question.id) % question.options.length;
  question.options = question.options.slice(shift).concat(question.options.slice(0, shift));
  question.optionsOrigin = { A: 'official_exam', B: 'official_exam', C: 'official_exam', d: 'editorial' };
  question.optionMigration = {
    version: 1,
    migratedAt: '2026-07-31',
    source: 'm1-pool5-surgical',
    distractorSourceQuestionId: distractor.candidate.id
  };
  question.source = {
    ...question.source,
    kind: 'official_exam',
    note: 'Tres opciones proceden del cuestionario oficial M1; la cuarta es una ampliación editorial para el formato de cuatro opciones.'
  };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
const afterCounts = {};
for (const question of questions) if (active(question) && question.options?.length === 4) afterCounts[question.topicId] = (afterCounts[question.topicId] || 0) + 1;
const afterByTopic = Object.fromEntries(Object.entries(deficitManifest.byTopic).map(([topicId, item]) => {
  const activeCount = afterCounts[topicId] || 0;
  return [topicId, { pool5: item.pool5, activeCount, deficit: Math.max(0, item.pool5 - activeCount) }];
}));
const remainingTopics = Object.entries(afterByTopic).filter(([, item]) => item.deficit > 0).map(([topicId]) => topicId);
await writeFile(deficitPath, `${JSON.stringify({
  ...deficitManifest,
  generatedAt: '2026-07-31',
  baselineBeforeMigration: {
    deficitTopics: Object.keys(deficits).length,
    deficitQuestions: Object.values(deficits).reduce((sum, value) => sum + value, 0),
    activeFourOptionQuestions: Object.values(deficitManifest.byTopic).reduce((sum, item) => sum + item.activeCount, 0)
  },
  byTopic: afterByTopic,
  deficitTopics: remainingTopics,
  migration: { source: 'm1-cultura-2023', migratedQuestions: selected.length, selectedByTopic }
}, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas M1; quedan ${remainingTopics.length} temas por debajo de pool5.`);
