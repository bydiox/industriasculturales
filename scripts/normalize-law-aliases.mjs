import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifest = JSON.parse(await readFile(join(root, 'data/laws/laws-manifest.json'), 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const aliases = {
  'rdleg-2-2015': { lawId: 'rdleg-2-2015-et', prefix: 'rdleg-2-2015-et' },
  'lo-11-1985': { lawId: 'lo-11-1985-lols', prefix: 'lo-11-1985-lols' }
};
const htmlByLawId = new Map();
for (const law of manifest.laws) {
  htmlByLawId.set(law.lawId, await readFile(join(root, 'data/laws', law.file), 'utf8'));
}

const report = { aliases: {}, normalized: [], removedInvalidAnchors: [] };
for (const question of questions) {
  const source = question.source;
  const alias = aliases[source?.lawId];
  if (!alias) continue;
  const oldLawId = source.lawId;
  source.lawId = alias.lawId;
  report.aliases[oldLawId] = (report.aliases[oldLawId] || 0) + 1;
  if (source.anchorId) {
    const oldAnchor = source.anchorId;
    const suffix = oldAnchor.replace(`${oldLawId}-`, '');
    const canonicalAnchor = `${alias.prefix}-${suffix}`;
    const html = htmlByLawId.get(alias.lawId) || '';
    if (new RegExp(`(?:id|data-anchor-id)=["']${canonicalAnchor}["']`).test(html)) {
      source.anchorId = canonicalAnchor;
    } else {
      delete source.anchorId;
      source.note = `El cuestionario oficial cita ${oldAnchor}; el HTML consolidado actual no contiene esa ancla, por lo que se conserva la ley canónica sin enlace a un artículo no verificado.`;
      report.removedInvalidAnchors.push({ id: question.id, oldAnchor, lawId: alias.lawId });
    }
  }
  report.normalized.push({ id: question.id, from: oldLawId, to: alias.lawId });
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Alias jurídicos normalizados: ${report.normalized.length}; anclas no verificables retiradas: ${report.removedInvalidAnchors.length}.`);
if (Object.keys(report.aliases).length) console.log(JSON.stringify(report.aliases));
