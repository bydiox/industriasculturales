export async function loadContent() {
  const [syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest, examConfig, poolTarget, historyReading, lawScopes, studyScope, simpleExplanations, studySources] = await Promise.all([
    fetch('data/syllabus.json').then(response => response.json()),
    fetch('data/questions.json').then(response => response.json()),
    fetch('data/study-units.json').then(response => response.json()),
    fetch('data/editorial-rules.json').then(response => response.json()),
    fetch('data/orientation-guide.json').then(response => response.json()),
    fetch('data/laws/laws-manifest.json').then(response => response.json()),
    fetch('data/exam-config.json').then(response => response.json()),
    fetch('data/pool-target.json').then(response => response.json()),
    fetch('data/history-reading.json').then(response => response.json()),
    fetch('data/law-scopes.json').then(response => response.json()),
    fetch('data/study-scope.json').then(response => response.json()),
    fetch('data/laws/simple-explanations.json').then(response => response.json()),
    fetch('data/study-sources.json').then(response => response.json())
  ]);
  const byTopic = questions.reduce((map, question) => {
    (map[question.topicId] ||= []).push(question);
    return map;
  }, {});
  const topicsById = Object.fromEntries(syllabus.topics.map(topic => [topic.id, topic]));
  const unitsById = Object.fromEntries(studyPlan.units.map(unit => [unit.id, unit]));
  const lawsById = Object.fromEntries(lawsManifest.laws.map(law => [law.lawId, law]));
  const rulesByTopic = editorialRules.rules.reduce((map, rule) => {
    rule.topicIds.forEach(topicId => (map[topicId] ||= []).push(rule));
    return map;
  }, {});
  return { syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest, lawScopes, studyScope, simpleExplanations, studySources, examConfig, poolTarget, historyReading, lawsById, byTopic, topicsById, unitsById, rulesByTopic };
}

function shuffled(items) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function currentQuestions(questions, expectedOptions = 4) {
  return questions.filter(question => {
    const activeInCurrentBank = question.active === true || (question.active !== false && question.origin?.historical !== true);
    const matchesCurrentFormat = !expectedOptions || question.options?.length === expectedOptions;
    return activeInCurrentBank && matchesCurrentFormat;
  });
}

function questionSourceType(question) {
  if (!question.source) return 'none';
  if (question.source.kind === 'official_exam' || question.origin?.type === 'official_exam') return 'official';
  if (question.source.lawId) return 'law';
  if (question.source.kind === 'bibliografia' || question.source.kind === 'referencia') return 'reference';
  return question.source.kind || 'other';
}

function questionMatchesFreeFilters(content, question, filters = {}) {
  if (!filters || typeof filters !== 'object') return true;
  if (filters.unitId) {
    const unit = content.unitsById?.[filters.unitId];
    if (!unit?.topicIds?.includes(question.topicId)) return false;
  }
  if (filters.topicId && question.topicId !== filters.topicId) return false;
  if (filters.part && filters.part !== 'all') {
    const topic = content.topicsById?.[question.topicId];
    if (topic?.part !== filters.part) return false;
  }
  if (filters.sourceType && filters.sourceType !== 'all' && questionSourceType(question) !== filters.sourceType) return false;
  return true;
}

function hasMeaningfulFreeFilters(filters = {}) {
  return Boolean(filters.unitId || filters.topicId || (filters.sourceType && filters.sourceType !== 'all') || (filters.part && filters.part !== 'all'));
}

export function countFreePracticeQuestions(content, filters = {}) {
  const expectedOptions = content.examConfig?.firstExercise?.optionsPerQuestion || 4;
  return currentQuestions(content.questions, expectedOptions)
    .filter(question => questionMatchesFreeFilters(content, question, filters))
    .length;
}

function isPrimaryHistoricalExam(question) {
  const text = [
    question.id,
    question.origin?.label,
    question.origin?.examId,
    question.origin?.questionnaire
  ].filter(Boolean).join(' ').toLowerCase();
  return question.origin?.type === 'official_exam'
    && text.includes('m3')
    && text.includes('2021');
}

function allocateExamQuotas(poolTarget, total) {
  const entries = Object.entries(poolTarget?.byTopic || {});
  const raw = entries.map(([topicId, target]) => ({ topicId, exact: (target.perExam / 100) * total }));
  const quotas = raw.map(item => ({ ...item, quota: Math.floor(item.exact) }));
  let remaining = total - quotas.reduce((sum, item) => sum + item.quota, 0);
  quotas.sort((a, b) => (b.exact - b.quota) - (a.exact - a.quota));
  for (let index = 0; index < remaining; index += 1) quotas[index].quota += 1;
  return quotas;
}

function sampleProportionalExam(content) {
  const total = content.examConfig?.firstExercise?.questions || 100;
  const expectedOptions = content.examConfig?.firstExercise?.optionsPerQuestion || 4;
  const quotas = allocateExamQuotas(content.poolTarget, total);
  const selected = [];
  const missing = [];
  for (const { topicId, quota } of quotas) {
    const queue = shuffled(currentQuestions(content.byTopic[topicId] || [])
      .filter(question => question.options?.length === expectedOptions));
    const available = Math.min(quota, queue.length);
    selected.push(...queue.slice(0, available));
    if (available < quota) missing.push({ topicId, expected: quota, available, missing: quota - available });
  }
  const notice = missing.length
    ? `Simulacro incompleto: faltan ${missing.reduce((sum, item) => sum + item.missing, 0)} preguntas de ${missing.length} temas sin banco suficiente en formato de ${expectedOptions} opciones. Cobertura actual: ${selected.length}/${total} (${Math.round(selected.length / total * 100)}%). No se ha redistribuido ese peso.`
    : '';
  const minimumCoverage = content.examConfig?.firstExercise?.partialExamMinimumCoverage || 0.5;
  const blocked = selected.length / total < minimumCoverage;
  return { questions: shuffled(selected), notice, blocked, coverage: selected.length / total };
}

function sampleAvoidingPrevious(candidates, limit, excludeQuestionIds = []) {
  const excluded = new Set(excludeQuestionIds);
  const selected = shuffled(candidates.filter(question => !excluded.has(question.id))).slice(0, limit);
  if (selected.length < Math.min(limit, candidates.length)) {
    const used = new Set(selected.map(question => question.id));
    selected.push(...shuffled(candidates.filter(question => !used.has(question.id))).slice(0, limit - selected.length));
  }
  return shuffled(selected);
}

function sampleUnitQuestions(content, unitId, excludeQuestionIds = []) {
  const unit = content.unitsById[unitId];
  if (!unit) return [];
  const limit = content.studyPlan.historyRules.unitQuestionLimit;
  const expectedOptions = content.examConfig?.firstExercise?.optionsPerQuestion || 4;
  const excluded = new Set(excludeQuestionIds);
  const queues = unit.topicIds
    .map(topicId => shuffled(currentQuestions(content.byTopic[topicId] || [], expectedOptions).filter(question => !excluded.has(question.id))))
    .filter(queue => queue.length);
  const selected = [];
  while (queues.length && selected.length < limit) {
    for (let index = queues.length - 1; index >= 0 && selected.length < limit; index -= 1) {
      selected.push(queues[index].shift());
      if (!queues[index].length) queues.splice(index, 1);
    }
  }
  if (selected.length < limit) {
    const used = new Set(selected.map(question => question.id));
    const fallback = unit.topicIds.flatMap(topicId => currentQuestions(content.byTopic[topicId] || [], expectedOptions))
      .filter(question => !used.has(question.id));
    selected.push(...shuffled(fallback).slice(0, limit - selected.length));
  }
  return shuffled(selected);
}

export function sampleQuestions(content, mode, targetId = null, examType = 'aleatorio', excludeQuestionIds = []) {
  if (mode === 'examen' && examType === 'historico') {
    return {
      questions: content.questions
        .filter(isPrimaryHistoricalExam)
        .sort((a, b) => String(a.origin.label || '').localeCompare(String(b.origin.label || ''), 'es')
          || (a.origin.questionNumber || 0) - (b.origin.questionNumber || 0)),
      notice: ''
    };
  }
  if (mode === 'historia-tema') {
    const limit = content.studyPlan.historyRules.topicQuestionLimit;
    const expectedOptions = content.examConfig?.firstExercise?.optionsPerQuestion || 4;
    return { questions: sampleAvoidingPrevious(currentQuestions(content.byTopic[targetId] || [], expectedOptions), limit, excludeQuestionIds), notice: '' };
  }
  if (mode === 'historia-unidad') return { questions: sampleUnitQuestions(content, targetId, excludeQuestionIds), notice: '' };
  if (mode === 'examen') return sampleProportionalExam(content);
  const expectedOptions = content.examConfig?.firstExercise?.optionsPerQuestion || 4;
  const filters = mode === 'libre' && targetId && typeof targetId === 'object' ? targetId : {};
  const active = currentQuestions(content.questions, expectedOptions)
    .filter(question => questionMatchesFreeFilters(content, question, filters));
  const notice = hasMeaningfulFreeFilters(filters)
    ? `Práctica libre filtrada: ${active.length} preguntas disponibles.`
    : '';
  return { questions: shuffled(active), notice };
}
