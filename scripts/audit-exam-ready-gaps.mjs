import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const readJson = async path => JSON.parse(await readFile(join(root, path), 'utf8'));

const [questions, syllabus, poolTarget, examConfig] = await Promise.all([
  readJson('data/questions.json'),
  readJson('data/syllabus.json'),
  readJson('data/pool-target.json'),
  readJson('data/exam-config.json')
]);

const expectedOptions = examConfig.firstExercise.optionsPerQuestion;
const topicsById = new Map(syllabus.topics.map(topic => [topic.id, topic]));
const current = question => question.active === true || (question.active !== false && question.origin?.historical !== true);
const byTopic = new Map();

for (const question of questions.filter(current)) {
  const bucket = byTopic.get(question.topicId) || {
    totalActive: 0,
    examReady: 0,
    threeOptionOfficial: 0,
    legalAnchoredThreeOption: 0,
    referenceDrafts: 0,
    examples: []
  };
  bucket.totalActive += 1;
  if (question.options?.length === expectedOptions) bucket.examReady += 1;
  if (question.options?.length === 3 && question.origin?.type === 'official_exam') bucket.threeOptionOfficial += 1;
  if (question.options?.length === 3 && question.source?.lawId) bucket.legalAnchoredThreeOption += 1;
  if (question.editorialStatus?.startsWith('draft')) bucket.referenceDrafts += 1;
  if (bucket.examples.length < 5) {
    bucket.examples.push({
      id: question.id,
      optionCount: question.options?.length,
      origin: question.origin?.type || question.source?.kind || 'propia',
      source: question.source?.lawId || question.source?.kind || question.source?.reference || null
    });
  }
  byTopic.set(question.topicId, bucket);
}

const gaps = [];
for (const [topicId, target] of Object.entries(poolTarget.byTopic || {})) {
  const bucket = byTopic.get(topicId) || {
    totalActive: 0,
    examReady: 0,
    threeOptionOfficial: 0,
    legalAnchoredThreeOption: 0,
    referenceDrafts: 0,
    examples: []
  };
  if (bucket.examReady >= target.pool3) continue;
  const topic = topicsById.get(topicId);
  gaps.push({
    topicId,
    title: topic?.title || topicId,
    pool3: target.pool3,
    pool5: target.pool5,
    totalActive: bucket.totalActive,
    examReady: bucket.examReady,
    missingForPool3: Math.max(0, target.pool3 - bucket.examReady),
    missingForPool5: Math.max(0, target.pool5 - bucket.examReady),
    threeOptionOfficial: bucket.threeOptionOfficial,
    legalAnchoredThreeOption: bucket.legalAnchoredThreeOption,
    referenceDrafts: bucket.referenceDrafts,
    safeNextStep: bucket.legalAnchoredThreeOption
      ? 'Crear variantes B de cuatro opciones desde ancla jurídica.'
      : bucket.threeOptionOfficial
        ? 'Usar solo como histórico/práctica salvo que exista fuente verificable para variante propia.'
        : 'Necesita fuente de referencia o pregunta propia verificable antes de entrar en simulacro.',
    examples: bucket.examples
  });
}

gaps.sort((a, b) => b.missingForPool3 - a.missingForPool3 || b.missingForPool5 - a.missingForPool5 || a.topicId.localeCompare(b.topicId));

const report = {
  generatedAt: '2026-08-01',
  expectedOptions,
  policy: 'El simulacro aleatorio solo usa preguntas activas con el número de opciones vigente. Las oficiales de tres opciones se conservan como histórico o práctica, pero no cubren cuota de examen.',
  summary: {
    topicsBelowPool3ForExam: gaps.filter(item => item.examReady < item.pool3).length,
    missingForPool3: gaps.reduce((sum, item) => sum + item.missingForPool3, 0),
    topicsWithoutExamReadyQuestions: gaps.filter(item => item.examReady === 0).length
  },
  gaps
};

await writeFile(join(root, 'data/exam-ready-gap-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Huecos de simulacro: ${report.summary.topicsBelowPool3ForExam} temas bajo pool3; ${report.summary.missingForPool3} preguntas faltan para pool3.`);
