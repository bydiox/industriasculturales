import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = file => readFile(join(root, file), 'utf8').then(JSON.parse);
const fail = message => { console.error(`ERROR: ${message}`); process.exitCode = 1; };
const warn = message => console.warn(`AVISO: ${message}`);
const readLawHtml = async (law, context) => {
  try {
    return await readFile(join(root, 'data/laws', law.file), 'utf8');
  } catch (error) {
    fail(`No se pudo leer la fuente de ${context}: ${law.file} (${error.code || error.message})`);
    return null;
  }
};
const readLawStudyHtml = async (law, context) => {
  if (!law.studyFile) return null;
  try {
    return await readFile(join(root, 'data/laws', law.studyFile), 'utf8');
  } catch (error) {
    fail(`No se pudo leer la versiÃ³n de estudio de ${context}: ${law.studyFile} (${error.code || error.message})`);
    return null;
  }
};
const readSourceHtml = async (file, context) => {
  try {
    return await readFile(join(root, 'data', file), 'utf8');
  } catch (error) {
    fail(`No se pudo leer la fuente bibliográfica de ${context}: ${file} (${error.code || error.message})`);
    return null;
  }
};

const [questions, manifest, syllabus, studyPlan, editorialRules, sourcePolicy, examConfig, lawScopes] = await Promise.all([
  readJson('data/questions.json'),
  readJson('data/laws/laws-manifest.json'),
  readJson('data/syllabus.json'),
  readJson('data/study-units.json'),
  readJson('data/editorial-rules.json'),
  readJson('data/topic-source-policy.json').catch(() => ({ topics: {} })),
  readJson('data/exam-config.json'),
  readJson('data/law-scopes.json').catch(() => ({ laws: {}, default: { mode: 'full' } }))
]);
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));
const officialTopicIds = new Set(syllabus.topics.map(topic => topic.id));
const historicalTopicIds = new Set((syllabus.historicalBanks || []).map(topic => topic.id));
const topicIds = new Set([...officialTopicIds, ...historicalTopicIds]);
const questionIds = new Set();
const anchorsByLaw = new Map();
const unitIds = new Set();
const assignedTopicIds = new Set();
const editorialRuleIds = new Set();
const criticalRulesByTopic = new Map();
const scopeByLaw = new Map(Object.entries(lawScopes.laws || {}));

for (const rule of editorialRules.rules) {
  if (editorialRuleIds.has(rule.id)) fail(`ID de regla editorial duplicado: ${rule.id}`);
  editorialRuleIds.add(rule.id);
  if (!rule.officialSources?.length) fail(`Regla editorial sin fuentes oficiales: ${rule.id}`);
  for (const topicId of rule.topicIds || []) {
    if (!officialTopicIds.has(topicId)) fail(`Tema inexistente en regla editorial ${rule.id}: ${topicId}`);
    if (rule.severity === 'critical') {
      const rules = criticalRulesByTopic.get(topicId) || [];
      rules.push(rule.id);
      criticalRulesByTopic.set(topicId, rules);
    }
  }
  for (const topicId of rule.prerequisiteTopicIds || []) {
    if (!officialTopicIds.has(topicId)) fail(`Prerrequisito inexistente en regla editorial ${rule.id}: ${topicId}`);
  }
}

if (studyPlan.units.length !== 19) fail(`El modo Historia debe tener 19 unidades, no ${studyPlan.units.length}`);
for (const unit of studyPlan.units) {
  if (unitIds.has(unit.id)) fail(`ID de unidad duplicado: ${unit.id}`);
  unitIds.add(unit.id);
  if (!unit.title || !unit.topicIds?.length) fail(`Unidad incompleta: ${unit.id}`);
  for (const topicId of unit.topicIds) {
    if (!officialTopicIds.has(topicId)) fail(`Tema inexistente en ${unit.id}: ${topicId}`);
    if (assignedTopicIds.has(topicId)) fail(`Tema asignado a varias unidades: ${topicId}`);
    assignedTopicIds.add(topicId);
  }
}
for (const topicId of officialTopicIds) {
  if (!assignedTopicIds.has(topicId)) fail(`Tema oficial sin unidad de Historia: ${topicId}`);
}
const totalWeight = studyPlan.units.reduce((total, unit) => total + unit.weight, 0);
if (Math.abs(totalWeight - studyPlan.totalWeight) > 0.001) {
  fail(`Los pesos de Historia suman ${totalWeight.toFixed(2)}, pero se declara ${studyPlan.totalWeight}`);
}

for (const question of questions) {
  if (questionIds.has(question.id)) fail(`ID de pregunta duplicado: ${question.id}`);
  questionIds.add(question.id);
  if (!topicIds.has(question.topicId)) fail(`Tema inexistente en ${question.id}: ${question.topicId}`);
  const optionIds = question.options.map(option => option.id);
  if (optionIds.length < 2 || new Set(optionIds).size !== optionIds.length) fail(`Opciones inválidas en ${question.id}`);
  if (question.optionCount !== undefined && question.optionCount !== optionIds.length) fail(`optionCount no coincide con las opciones en ${question.id}`);
  if (!optionIds.includes(question.correctOptionId)) fail(`Respuesta correcta inexistente en ${question.id}`);
  if (question.optionMigration?.source?.startsWith('m1-pool5-') && !(question.source?.lawId && question.officialSource?.kind === 'official_exam')) {
    if (question.options.length !== 4 || question.source?.kind !== 'official_exam') fail(`Migración M1 con formato o procedencia inválidos: ${question.id}`);
    const origin = question.optionsOrigin || {};
    if (origin.A !== 'official_exam' || origin.B !== 'official_exam' || origin.C !== 'official_exam' || origin.d !== 'editorial') {
      fail(`Procedencia por opción incompleta en ${question.id}`);
    }
  }
  // Los cuestionarios oficiales históricos conservan su contexto de examen y
  // no se presentan como afirmaciones de vigencia actual. Las reglas críticas
  // sí siguen siendo obligatorias para las preguntas propias activas.
  if (!(question.origin?.type === 'official_exam' && question.origin?.historical === true)) {
    for (const ruleId of criticalRulesByTopic.get(question.topicId) || []) {
      if (!(question.editorialRuleIds || []).includes(ruleId)) {
        fail(`Pregunta sin control editorial obligatorio ${ruleId}: ${question.id}`);
      }
    }
  }
  if (question.source?.lawId === 'rd-1435-1985' && question.temporalContext !== 'vigente-hasta-2027-05-24') {
    fail(`Pregunta del RD 1435/1985 sin contexto temporal correcto: ${question.id}`);
  }
  if (question.source?.lawId === 'rd-607-2026' && !['prospectivo-hasta-2027-05-24', 'vigente-desde-2027-05-25'].includes(question.temporalContext)) {
    fail(`Pregunta del RD 607/2026 sin contexto temporal correcto: ${question.id}`);
  }
  if (question.source) {
    if (question.source.kind === 'official_exam') {
      if (!question.source.reference) fail(`Examen oficial sin referencia: ${question.id}`);
      continue;
    }
    if (question.source.kind === 'bibliografia' || question.source.kind === 'referencia') {
      if (!question.source.reference) fail(`Fuente bibliográfica sin referencia: ${question.id}`);
      if (question.source.file && question.source.anchorId) {
        const html = await readSourceHtml(question.source.file, question.id);
        if (html && !new RegExp(`(?:id|data-anchor-id)=["']${question.source.anchorId}["']`).test(html)) {
          fail(`Ancla bibliográfica inexistente en ${question.id}: ${question.source.anchorId}`);
        }
      }
      continue;
    }
    const law = lawMap.get(question.source.lawId);
    if (!law) fail(`Ley inexistente en ${question.id}: ${question.source.lawId}`);
    else {
      if (law.active === false && (question.active === true || (question.active !== false && question.origin?.historical !== true))) {
        fail(`Pregunta activa basada en una fuente marcada como histórica: ${question.id}`);
      }
      if (law.entryType === 'institutional' && question.source.kind !== 'institutional') {
        fail(`Fuente institucional sin kind=\"institutional\": ${question.id}`);
      }
      if (law.entryType === 'amending-norm' && question.source.kind !== 'amending-norm') {
        fail(`Norma modificativa sin kind=\"amending-norm\": ${question.id}`);
      }
      const html = await readLawHtml(law, question.id);
      if (!html) continue;
      const pattern = new RegExp(`(?:id|data-anchor-id)=["']${question.source.anchorId}["']`);
      if (!pattern.test(html)) fail(`Ancla inexistente en ${question.id}: ${question.source.anchorId}`);
      const scope = scopeByLaw.get(law.lawId) || lawScopes.default;
      if (scope?.mode === 'selected' && !scope.anchorIds?.includes(question.source.anchorId)) {
        fail(`Pregunta fuera del alcance verificado de ${law.lawId}: ${question.id} (${question.source.anchorId})`);
      }
      const seen = anchorsByLaw.get(law.lawId) || new Set();
      if (seen.has(question.source.anchorId)) warn(`Ancla repetida por varias preguntas: ${question.source.anchorId}`);
      seen.add(question.source.anchorId); anchorsByLaw.set(law.lawId, seen);
    }
  }
}

const expectedExamOptions = examConfig.firstExercise.optionsPerQuestion;
const activeFormatCounts = new Map();
const activeNonOfficialFormatCounts = new Map();
const activeOfficialFormatCounts = new Map();
for (const question of questions) {
  if (!(question.active === true || (question.active !== false && question.origin?.historical !== true))) continue;
  activeFormatCounts.set(question.options.length, (activeFormatCounts.get(question.options.length) || 0) + 1);
  const target = question.origin?.type === 'official_exam' ? activeOfficialFormatCounts : activeNonOfficialFormatCounts;
  target.set(question.options.length, (target.get(question.options.length) || 0) + 1);
}
const legacyActive = [...activeNonOfficialFormatCounts.entries()]
  .filter(([optionCount]) => optionCount !== expectedExamOptions)
  .map(([optionCount, count]) => `${count} con ${optionCount} opciones`);
if (legacyActive.length) warn(`Formato de examen: ${legacyActive.join(', ')}; el formato vigente exige ${expectedExamOptions}. Las preguntas históricas pueden conservar su formato de origen.`);

for (const question of questions) {
  if (!(question.active === true || (question.active !== false && question.origin?.historical !== true)) || !question.source?.lawId) continue;
  const policy = sourcePolicy.topics?.[question.topicId];
  if (policy && !policy.allowedLawIds.includes(question.source.lawId)) {
    fail(`Fuente no pertinente para el tema según la política editorial: ${question.id} (${question.topicId} ← ${question.source.lawId})`);
  }
}

for (const law of manifest.laws) {
  const html = await readLawHtml(law, law.lawId);
  if (!html) continue;
  const ids = [...html.matchAll(/(?:^|\s)id=["']([^"']+)["']/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) fail(`IDs HTML duplicados en ${law.file}`);
  const studyHtml = await readLawStudyHtml(law, law.lawId);
  if (studyHtml) {
    const studyIds = [...studyHtml.matchAll(/(?:^|\s)id=["']([^"']+)["']/g)].map(match => match[1]);
    if (new Set(studyIds).size !== studyIds.length) fail(`IDs HTML duplicados en ${law.studyFile}`);
    const scope = scopeByLaw.get(law.lawId);
    for (const anchorId of scope?.anchorIds || []) {
      if (!new RegExp(`(?:id|data-anchor-id)=["']${anchorId}["']`).test(studyHtml)) {
        fail(`La versiÃ³n de estudio ${law.studyFile} no contiene el ancla delimitada: ${anchorId}`);
      }
    }
  }
}

const topicsWithoutQuestions = [...officialTopicIds]
  .filter(topicId => !questions.some(question => question.topicId === topicId && (question.active === true || (question.active !== false && question.origin?.historical !== true))));
if (topicsWithoutQuestions.length) {
  warn(`${topicsWithoutQuestions.length} temas oficiales todavía no tienen preguntas activas: ${topicsWithoutQuestions.join(', ')}`);
}

const poolTarget = await readFile(join(root, 'data/pool-target.json'), 'utf8').then(JSON.parse).catch(() => null);
if (poolTarget) {
  for (const [topicId, target] of Object.entries(poolTarget.byTopic || {})) {
    if (!officialTopicIds.has(topicId)) fail(`Tema inexistente en pool-target: ${topicId}`);
    if (![target.perExam, target.pool3, target.pool5, target.pool8].every(value => Number.isFinite(value) && value >= 0)) {
      fail(`Objetivo de pool inválido: ${topicId}`);
    }
    if (!(target.pool3 <= target.pool5 && target.pool5 <= target.pool8)) fail(`Escalera de pool inválida: ${topicId}`);
  }
  const activeByTopic = new Map();
  const examReadyByTopic = new Map();
  for (const question of questions) {
    if (!(question.active === true || (question.active !== false && question.origin?.historical !== true))) continue;
    activeByTopic.set(question.topicId, (activeByTopic.get(question.topicId) || 0) + 1);
    if (question.options?.length === expectedExamOptions) {
      examReadyByTopic.set(question.topicId, (examReadyByTopic.get(question.topicId) || 0) + 1);
    }
  }
  const zeroTopics = [];
  const belowPool3 = [];
  const examZeroTopics = [];
  const examBelowPool3 = [];
  for (const [topicId, target] of Object.entries(poolTarget.byTopic)) {
    const activeCount = activeByTopic.get(topicId) || 0;
    const examReadyCount = examReadyByTopic.get(topicId) || 0;
    if (activeCount === 0) zeroTopics.push(topicId);
    else if (activeCount < target.pool3) belowPool3.push(`${topicId} (${activeCount}/${target.pool3})`);
    if (examReadyCount === 0) examZeroTopics.push(topicId);
    else if (examReadyCount < target.pool3) examBelowPool3.push(`${topicId} (${examReadyCount}/${target.pool3})`);
  }
  if (zeroTopics.length) warn(`Pool de preguntas: ${zeroTopics.length} temas est?n a cero: ${zeroTopics.join(', ')}`);
  if (belowPool3.length) warn(`Pool de preguntas: temas por debajo de pool3: ${belowPool3.join(', ')}`);
  if (examZeroTopics.length) warn(`Pool de examen (${expectedExamOptions} opciones): ${examZeroTopics.length} temas no tienen preguntas aptas para simulacro aleatorio: ${examZeroTopics.join(', ')}`);
  if (examBelowPool3.length) warn(`Pool de examen (${expectedExamOptions} opciones): temas por debajo de pool3: ${examBelowPool3.join(', ')}`);
}

if (!process.exitCode) {
  const activeQuestionCount = questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true)).length;
  console.log(`Contenido válido: ${questions.length} preguntas (${activeQuestionCount} activas), ${manifest.laws.length} normas, ${officialTopicIds.size} temas oficiales y ${studyPlan.units.length} unidades de Historia.`);
}
