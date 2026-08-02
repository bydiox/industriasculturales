import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sampleQuestions } from '../src/questions.js';

const content = {
  examConfig: { firstExercise: { questions: 10 } },
  poolTarget: {
    byTopic: {
      'tema-con-banco': { perExam: 50 },
      'tema-sin-banco': { perExam: 50 }
    }
  },
  byTopic: {
    'tema-con-banco': Array.from({ length: 5 }, (_, index) => ({ id: `q-${index}`, active: true, options: [{}, {}, {}, {}] })),
    'tema-sin-banco': []
  }
};

const result = sampleQuestions(content, 'examen');
assert.equal(result.questions.length, 5);
assert.match(result.notice, /No se ha redistribuido/);
assert.match(result.notice, /5\/10/);
assert.equal(result.blocked, false);
assert.ok(result.questions.every(question => question.id.startsWith('q-')));
console.log('Muestreo proporcional: OK (el peso de un tema vacío no se redistribuye).');

const [questions, syllabus, poolTarget, examConfig, studyPlan] = await Promise.all([
  readFile(new URL('../data/questions.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../data/syllabus.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../data/pool-target.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../data/exam-config.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../data/study-units.json', import.meta.url), 'utf8').then(JSON.parse)
]);
const topicsById = Object.fromEntries(syllabus.topics.map(topic => [topic.id, topic]));
const byTopic = questions.reduce((map, question) => {
  (map[question.topicId] ||= []).push(question);
  return map;
}, {});
const unitsById = Object.fromEntries(studyPlan.units.map(unit => [unit.id, unit]));
const realContent = { questions, topicsById, unitsById, byTopic, poolTarget, examConfig, studyPlan };
const rotatedTopics = new Map(['especifico-23', 'especifico-29', 'especifico-40'].map(topicId => [topicId, 0]));
for (let run = 0; run < 400; run += 1) {
  const exam = sampleQuestions(realContent, 'examen');
  assert.equal(exam.questions.length, 100);
  assert.equal(exam.questions.filter(question => question.topicId.startsWith('comun-')).length, 50);
  assert.equal(exam.questions.filter(question => question.topicId.startsWith('especifico-')).length, 50);
  for (const question of exam.questions) {
    if (rotatedTopics.has(question.topicId)) rotatedTopics.set(question.topicId, rotatedTopics.get(question.topicId) + 1);
  }
}
for (const [topicId, appearances] of rotatedTopics) assert.ok(appearances > 0, `${topicId} nunca aparece`);
console.log('Muestreo real: OK (50/50 y rotación de empates entre simulacros).');

let historyCommon = 0;
let historySpecific = 0;
for (const topic of syllabus.topics) {
  const sample = sampleQuestions(realContent, 'historia-tema', topic.id).questions;
  if (topic.id.startsWith('comun-')) historyCommon += sample.length;
  else historySpecific += sample.length;
}
for (const unit of studyPlan.units) {
  const sample = sampleQuestions(realContent, 'historia-unidad', unit.id).questions;
  historyCommon += sample.filter(question => question.topicId.startsWith('comun-')).length;
  historySpecific += sample.filter(question => question.topicId.startsWith('especifico-')).length;
}
const historyCommonRatio = historyCommon / (historyCommon + historySpecific);
assert.ok(historyCommonRatio >= 0.45 && historyCommonRatio <= 0.55, `Historia desequilibrada: ${historyCommonRatio}`);
console.log(`Historia ponderada: OK (${historyCommon}/${historySpecific}, común/específica).`);
