import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [questions, target] = await Promise.all([
  readFile(join(root, 'data/questions.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'data/pool-target.json'), 'utf8').then(JSON.parse)
]);
const active = questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
const counts = {};
for (const question of active) counts[question.topicId] = (counts[question.topicId] || 0) + 1;
const rows = Object.entries(target.byTopic).map(([topicId, goal]) => {
  const activeCount = counts[topicId] || 0;
  const status = activeCount === 0 ? 'ZERO' : activeCount < goal.pool3 ? 'BELOW_POOL3' : activeCount < goal.pool5 ? 'POOL3_ONLY' : activeCount < goal.pool8 ? 'POOL5_ONLY' : 'POOL8_PLUS';
  return {
    topicId,
    active: activeCount,
    perExam: goal.perExam,
    pool3: goal.pool3,
    pool5: goal.pool5,
    pool8: goal.pool8,
    deficitPool3: Math.max(0, goal.pool3 - activeCount),
    deficitPool5: Math.max(0, goal.pool5 - activeCount),
    status
  };
});
const common = active.filter(question => question.topicId.startsWith('comun-')).length;
const specific = active.filter(question => question.topicId.startsWith('especifico-')).length;
console.log(JSON.stringify({
  activeBankSize: active.length,
  common,
  specific,
  pool3Total: Object.values(target.byTopic).reduce((sum, goal) => sum + goal.pool3, 0),
  pool5Total: Object.values(target.byTopic).reduce((sum, goal) => sum + goal.pool5, 0),
  pool8Total: Object.values(target.byTopic).reduce((sum, goal) => sum + goal.pool8, 0),
  zero: rows.filter(row => row.status === 'ZERO').map(row => row.topicId),
  belowPool3: rows.filter(row => row.status === 'BELOW_POOL3'),
  rows
}, null, 2));
