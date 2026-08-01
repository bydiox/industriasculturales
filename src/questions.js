export async function loadContent() {
  const [syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest, examConfig, poolTarget, historyReading, lawScopes, simpleExplanations] = await Promise.all([
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
    fetch('data/laws/simple-explanations.json').then(response => response.json())
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
  return { syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest, lawScopes, simpleExplanations, examConfig, poolTarget, historyReading, lawsById, byTopic, topicsById, unitsById, rulesByTopic };
}

function shuffled(items) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function currentQuestions(questions) {
  return questions.filter(question => question.active === true || (question.active !== false && question.origin?.historical !== true));
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

function sampleUnitQuestions(content, unitId) {
  const unit = content.unitsById[unitId];
  if (!unit) return [];
  const limit = content.studyPlan.historyRules.unitQuestionLimit;
  const queues = unit.topicIds
    .map(topicId => shuffled(currentQuestions(content.byTopic[topicId] || [])))
    .filter(queue => queue.length);
  const selected = [];
  while (queues.length && selected.length < limit) {
    for (let index = queues.length - 1; index >= 0 && selected.length < limit; index -= 1) {
      selected.push(queues[index].shift());
      if (!queues[index].length) queues.splice(index, 1);
    }
  }
  return shuffled(selected);
}

export function sampleQuestions(content, mode, targetId = null, examType = 'aleatorio') {
  if (mode === 'examen' && examType === 'historico') {
    return {
      questions: content.questions
        .filter(question => question.origin?.type === 'official_exam')
        .sort((a, b) => String(a.origin.label || '').localeCompare(String(b.origin.label || ''), 'es')
          || (a.origin.questionNumber || 0) - (b.origin.questionNumber || 0)),
      notice: ''
    };
  }
  if (mode === 'historia-tema') {
    const limit = content.studyPlan.historyRules.topicQuestionLimit;
    return { questions: shuffled(currentQuestions(content.byTopic[targetId] || [])).slice(0, limit), notice: '' };
  }
  if (mode === 'historia-unidad') return { questions: sampleUnitQuestions(content, targetId), notice: '' };
  if (mode === 'examen') return sampleProportionalExam(content);
  const active = currentQuestions(content.questions);
  return { questions: shuffled(active), notice: '' };
}
