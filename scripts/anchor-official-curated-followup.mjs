import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));
const questionById = new Map(questions.map(question => [question.id, question]));

const source = (lawId, anchorId, reference) => {
  const law = lawMap.get(lawId);
  if (!law) throw new Error(`Ley no importada: ${lawId}`);
  return { lawId, anchorId, reference, url: law.officialUrl };
};

const anchors = {
  'm1-cultura-comun-2023-24': source('convenio-iv', 'convenio-iv-a8', 'IV Convenio único AGE, artículo 8.1.d'),
  'm1-cultura-comun-2023-27': source('convenio-iv', 'convenio-iv-a1-4', 'IV Convenio único AGE, artículo 12.3')
};

const reviewOnly = [
  {
    id: 'm1-cultura-produccion-2023-78',
    issue: 'La respuesta importada marca 40 horas, pero el artículo 64.1 del IV Convenio fija la jornada general en 37,5 horas semanales; no se ancla hasta revisar plantilla/origen.'
  }
];

for (const [id, legalSource] of Object.entries(anchors)) {
  const question = questionById.get(id);
  if (!question) throw new Error(`Pregunta no encontrada: ${id}`);
  const law = lawMap.get(legalSource.lawId);
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  if (!html.includes(`id="${legalSource.anchorId}"`) && !html.includes(`data-anchor-id="${legalSource.anchorId}"`)) {
    throw new Error(`Ancla inexistente para ${id}: ${legalSource.lawId}#${legalSource.anchorId}`);
  }
  if (question.source?.kind === 'official_exam') question.officialSource = question.source;
  else if (question.source && !question.officialSource) question.previousSource = question.source;
  question.source = legalSource;
  question.sourceReview = {
    status: 'anchored-from-official-question',
    reviewedAt: '2026-08-01',
    note: 'Ancla curada manualmente a partir del texto legal aplicable; la procedencia oficial se conserva en origin/officialSource.'
  };
}

for (const item of reviewOnly) {
  const question = questionById.get(item.id);
  if (!question) continue;
  question.sourceReview = {
    status: 'needs-answer-review-before-anchoring',
    reviewedAt: '2026-08-01',
    note: item.issue
  };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Anclas curadas añadidas: ${Object.keys(anchors).length}`);
console.log(`Preguntas marcadas para revisión antes de anclar: ${reviewOnly.length}`);
