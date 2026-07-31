import assert from 'node:assert/strict';
import { examScore, penaltyFraction } from '../src/scoring.js';

const penalty = penaltyFraction('one_third_of_correct_answer');
assert.equal(penalty, 1 / 3);
assert.equal(examScore({ correct: 25, wrong: 75, expectedQuestions: 100, maximumPoints: 40, penaltyFraction: penalty }), 0);
assert.equal(examScore({ correct: 50, wrong: 0, expectedQuestions: 100, maximumPoints: 40, penaltyFraction: penalty }), 20);
console.log('Puntuación del examen: OK (4 opciones, penalización de un tercio, máximo 40 y aprobado en 20).');
