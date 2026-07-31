import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const laws = new Map(manifest.laws.map((law) => [law.lawId, law]));
const cue = /\b(según|conforme a|de acuerdo con|en virtud de|a tenor de)\b/i;

function articleFor(title) {
  if (/^(Real Decreto|Tratado|Instrumento|Reglamento|Convenio)/i.test(title)) return `Según el ${title}`;
  return `Según la ${title}`;
}

function sourcePrefix(question) {
  const source = question.source;
  if (!source) return null;
  if (source.kind === 'bibliografia' || source.kind === 'referencia') {
    return source.reference ? `Según ${source.reference}` : null;
  }
  if (source.kind === 'institutional') {
    const law = source.lawId ? laws.get(source.lawId) : null;
    return law ? `Según la información institucional sobre ${law.title}` : 'Según la información institucional indicada';
  }
  const law = source.lawId ? laws.get(source.lawId) : null;
  if (!law) return source.reference ? `Según ${source.reference}` : null;
  return articleFor(law.title);
}

let prefixed = 0;
for (const question of questions) {
  if (question.origin?.type === 'official_exam' || cue.test(question.prompt)) continue;
  const prefix = sourcePrefix(question);
  if (!prefix) continue;
  question.prompt = `${prefix}, ${question.prompt}`;
  prefixed += 1;
}
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Añadida procedencia en el enunciado de ${prefixed} preguntas propias.`);
