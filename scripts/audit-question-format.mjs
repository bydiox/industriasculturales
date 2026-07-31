import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const active = questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
const count = items => items.reduce((map, question) => map.set(question.options.length, (map.get(question.options.length) || 0) + 1), new Map());
const official = active.filter(question => question.origin?.type === 'official_exam');
const generated = active.filter(question => question.origin?.type !== 'official_exam');
const asObject = map => Object.fromEntries([...map.entries()].sort((a, b) => a[0] - b[0]).map(([options, total]) => [`${options}_opciones`, total]));
console.log(JSON.stringify({
  active: active.length,
  all: asObject(count(active)),
  official: asObject(count(official)),
  nonOfficial: asObject(count(generated)),
  officialQuestionIds: official.map(question => question.id)
}, null, 2));
