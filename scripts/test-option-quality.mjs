import assert from 'node:assert/strict';
import { optionProblems } from '../src/option-quality.js';

const valid = { correctOptionId: 'c', options: [{ id: 'a', text: 'Uno' }, { id: 'b', text: 'Dos' }, { id: 'c', text: 'Tres' }, { id: 'd', text: 'Cuatro' }] };
assert.deepEqual(optionProblems(valid), []);
assert.deepEqual(optionProblems({ ...valid, options: [...valid.options.slice(0, 3), { id: 'd', text: 'Tres' }] }), ['textos de opciones duplicados']);
assert.deepEqual(optionProblems({ ...valid, options: [{ id: 'a', text: 'Uno' }, { id: 'a', text: 'Dos' }, { id: 'c', text: 'Tres' }, { id: 'd', text: 'Cuatro' }] }), ['IDs de opciones duplicados']);
console.log('Calidad de opciones: OK (duplicados detectados).');
