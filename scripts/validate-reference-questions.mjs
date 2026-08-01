import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questions = JSON.parse(await readFile(join(root, 'data/questions.json'), 'utf8'));
const fail = message => { console.error(`ERROR: ${message}`); process.exitCode = 1; };
const warn = message => console.warn(`AVISO: ${message}`);
const opinionPattern = /\b(qué haría|que haría|mejor pol[ií]tica|mejor pr[aá]ctica|convendr[ií]a|recomendar[ií]a|deber[ií]a|primer paso|c[oó]mo debe|qu[eé] indicadores convendr[ií]a)\b/i;

for (const question of questions) {
  if (question.source?.kind !== 'referencia') continue;
  if (!question.source.reference?.trim()) fail(`Referencia sin nombre: ${question.id}`);
  if (!question.source.author && !question.source.edition && !question.source.locator && !question.source.url) {
    fail(`Referencia no localizable: ${question.id}`);
  }
  const isDraft = question.active === false || question.editorialStatus?.startsWith('draft');
  if (!isDraft && question.options?.length !== 4) fail(`Una pregunta activa de referencia debe tener cuatro opciones: ${question.id}`);
  if (opinionPattern.test(question.prompt || '')) fail(`Enunciado de criterio/opinión en referencia: ${question.id}`);
  const lengths = (question.options || []).map(option => option.text.length);
  if (lengths.length === 3 && Math.max(...lengths) - Math.min(...lengths) > 80) {
    warn(`Distractores con longitudes muy desiguales: ${question.id}`);
  }
}

if (!process.exitCode) console.log('Preguntas de referencia: control editorial OK.');
