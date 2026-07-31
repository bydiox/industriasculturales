export async function loadContent() {
  const [syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest] = await Promise.all([
    fetch('data/syllabus.json').then(response => response.json()),
    fetch('data/questions.json').then(response => response.json()),
    fetch('data/study-units.json').then(response => response.json()),
    fetch('data/editorial-rules.json').then(response => response.json()),
    fetch('data/orientation-guide.json').then(response => response.json()),
    fetch('data/laws/laws-manifest.json').then(response => response.json())
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
  return { syllabus, questions, studyPlan, editorialRules, orientationGuide, lawsManifest, lawsById, byTopic, topicsById, unitsById, rulesByTopic };
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
  return questions.filter(question => question.origin?.historical !== true);
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
    return content.questions
      .filter(question => question.origin?.type === 'official_exam')
      .sort((a, b) => (a.origin.questionNumber || 0) - (b.origin.questionNumber || 0));
  }
  if (mode === 'historia-tema') {
    const limit = content.studyPlan.historyRules.topicQuestionLimit;
    return shuffled(currentQuestions(content.byTopic[targetId] || [])).slice(0, limit);
  }
  if (mode === 'historia-unidad') return sampleUnitQuestions(content, targetId);
  const active = currentQuestions(content.questions);
  const source = active;
  return shuffled(source).slice(0, mode === 'examen' ? 10 : source.length);
}
