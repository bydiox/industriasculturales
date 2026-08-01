import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [syllabus, scope] = await Promise.all([
  readFile(join(root, 'data/syllabus.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'data/convocation-scope.json'), 'utf8').then(JSON.parse)
]);

const fail = message => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};

const officialTopicIds = new Set(syllabus.topics.map(topic => topic.id));
const scopedTopicIds = new Set(Object.keys(scope.topicScope || {}));
const missing = [...officialTopicIds].filter(topicId => !scopedTopicIds.has(topicId));
const extra = [...scopedTopicIds].filter(topicId => !officialTopicIds.has(topicId));

if (missing.length) fail(`Temas oficiales sin delimitación explícita: ${missing.join(', ')}`);
if (extra.length) fail(`Temas delimitados que no existen en la convocatoria: ${extra.join(', ')}`);

const allowedStatuses = new Set(Object.keys(scope.statuses || {}));
for (const [topicId, item] of Object.entries(scope.topicScope || {})) {
  if (!allowedStatuses.has(item.status)) fail(`Estado no reconocido en ${topicId}: ${item.status}`);
  if (!Array.isArray(item.mustCover) || !item.mustCover.length) fail(`Tema sin mustCover: ${topicId}`);
  if (!Array.isArray(item.doNotExpandTo)) fail(`Tema sin doNotExpandTo: ${topicId}`);
  if (!item.sourceMode) fail(`Tema sin sourceMode: ${topicId}`);
}

if (!process.exitCode) {
  console.log(`Delimitación de convocatoria: OK (${scopedTopicIds.size}/${officialTopicIds.size} temas).`);
}
