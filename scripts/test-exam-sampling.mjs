import assert from 'node:assert/strict';
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
