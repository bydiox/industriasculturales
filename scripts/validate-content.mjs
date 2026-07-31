import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = file => readFile(join(root, file), 'utf8').then(JSON.parse);
const fail = message => { console.error(`ERROR: ${message}`); process.exitCode = 1; };
const warn = message => console.warn(`AVISO: ${message}`);

const [questions, manifest, syllabus, studyPlan, editorialRules] = await Promise.all([
  readJson('data/questions.json'),
  readJson('data/laws/laws-manifest.json'),
  readJson('data/syllabus.json'),
  readJson('data/study-units.json'),
  readJson('data/editorial-rules.json')
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
  if (!optionIds.includes(question.correctOptionId)) fail(`Respuesta correcta inexistente en ${question.id}`);
  for (const ruleId of criticalRulesByTopic.get(question.topicId) || []) {
    if (!(question.editorialRuleIds || []).includes(ruleId)) {
      fail(`Pregunta sin control editorial obligatorio ${ruleId}: ${question.id}`);
    }
  }
  if (question.source?.lawId === 'rd-1435-1985' && question.temporalContext !== 'vigente-hasta-2027-05-24') {
    fail(`Pregunta del RD 1435/1985 sin contexto temporal correcto: ${question.id}`);
  }
  if (question.source?.lawId === 'rd-607-2026' && !['prospectivo-hasta-2027-05-24', 'vigente-desde-2027-05-25'].includes(question.temporalContext)) {
    fail(`Pregunta del RD 607/2026 sin contexto temporal correcto: ${question.id}`);
  }
  if (question.source) {
    const law = lawMap.get(question.source.lawId);
    if (!law) fail(`Ley inexistente en ${question.id}: ${question.source.lawId}`);
    else {
      const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
      const pattern = new RegExp(`(?:id|data-anchor-id)=["']${question.source.anchorId}["']`);
      if (!pattern.test(html)) fail(`Ancla inexistente en ${question.id}: ${question.source.anchorId}`);
      const seen = anchorsByLaw.get(law.lawId) || new Set();
      if (seen.has(question.source.anchorId)) warn(`Ancla repetida por varias preguntas: ${question.source.anchorId}`);
      seen.add(question.source.anchorId); anchorsByLaw.set(law.lawId, seen);
    }
  }
}

for (const law of manifest.laws) {
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  const ids = [...html.matchAll(/(?:^|\s)id=["']([^"']+)["']/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) fail(`IDs HTML duplicados en ${law.file}`);
}

const topicsWithoutQuestions = [...officialTopicIds]
  .filter(topicId => !questions.some(question => question.topicId === topicId));
if (topicsWithoutQuestions.length) {
  warn(`${topicsWithoutQuestions.length} temas oficiales todavía no tienen preguntas activas: ${topicsWithoutQuestions.join(', ')}`);
}

if (!process.exitCode) {
  console.log(`Contenido válido: ${questions.length} preguntas, ${manifest.laws.length} normas, ${officialTopicIds.size} temas oficiales y ${studyPlan.units.length} unidades de Historia.`);
}
