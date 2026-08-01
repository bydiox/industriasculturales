import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const reportPath = join(root, 'data/official-originals-with-b-variants.json');
const today = '2026-08-01';

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const byId = new Map(questions.map(question => [question.id, question]));

const active = question => question.active === true || (question.active !== false && question.origin?.historical !== true);
const isOfficialOrigin = question => question.origin?.type === 'official_exam' || question.source?.kind === 'official_exam' || question.officialSource?.kind === 'official_exam';

const report = {
  generatedAt: today,
  policy: 'Cuando una pregunta oficial de tres opciones ya tiene variante propia -B activa de cuatro opciones, la original se conserva como histórica y deja de contar en el banco activo.',
  deactivated: [],
  skipped: []
};

for (const variant of questions) {
  if (!variant.id.endsWith('-B')) continue;
  if (!active(variant)) continue;
  if ((variant.options || []).length !== 4) continue;

  const baseId = variant.id.slice(0, -2);
  const original = byId.get(baseId);
  if (!original) continue;
  if (!active(original)) {
    report.skipped.push({ id: baseId, variantId: variant.id, reason: 'original-already-inactive' });
    continue;
  }
  if (!isOfficialOrigin(original)) {
    report.skipped.push({ id: baseId, variantId: variant.id, reason: 'original-not-official' });
    continue;
  }

  original.active = false;
  original.origin = {
    ...(original.origin || {}),
    type: original.origin?.type || 'official_exam',
    historical: true
  };
  original.editorialStatus = 'replaced-by-four-option-variant';
  original.replacedBy = variant.id;
  original.sourceReview = {
    status: 'replaced-by-four-option-variant',
    reviewedAt: today,
    reviewer: 'codex-editorial-scope',
    note: 'La pregunta oficial original se conserva como histórica. Para práctica y examen vigente se usa la variante propia de cuatro opciones.'
  };
  report.deactivated.push({
    id: original.id,
    variantId: variant.id,
    topicId: original.topicId,
    originalOptions: original.options?.length,
    variantSource: variant.source?.lawId || variant.source?.kind || null,
    variantAnchorId: variant.source?.anchorId || null
  });
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Originales oficiales desactivadas por variante -B: ${report.deactivated.length}`);
console.log(`Omitidas: ${report.skipped.length}`);
