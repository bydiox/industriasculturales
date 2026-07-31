import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = file => readFile(join(root, file), 'utf8').then(JSON.parse);
const [questions, policy] = await Promise.all([
  readJson('data/questions.json'),
  readJson('data/topic-source-policy.json')
]);
const active = questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
const violations = [];
for (const question of active) {
  const rule = policy.topics[question.topicId];
  if (!rule || !question.source?.lawId) continue;
  if (!rule.allowedLawIds.includes(question.source.lawId)) {
    violations.push(`${question.id} · ${question.topicId} · ${question.source.lawId} · ${question.prompt}`);
  }
}
if (!violations.length) console.log('Pertinencia de fuentes: sin infracciones activas en los temas auditados.');
else {
  console.warn(`AVISO: ${violations.length} preguntas activas usan una fuente no pertinente según la política temática.`);
  for (const violation of violations) console.warn(`- ${violation}`);
}
