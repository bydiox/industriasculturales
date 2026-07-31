import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const migrated = questions.filter((question) => question.optionMigration?.source === 'm1-pool5-surgical');
const sourceQuestions = questions.filter((question) => question.id.startsWith('m1-cultura-') && question.options?.length === 3 && !question.optionMigration);
const stop = new Set('para por del las los una uno unos unas que qué es son se de la el en y o a al un como según con sobre desde entre durante cuando cuál cuáles quién quiénes cómo donde dónde qué esta este estos estas sus más menos para'.split(' '));
const tokens = (text) => new Set((text.toLocaleLowerCase('es-ES').match(/[a-záéíóúüñ0-9]+/gu) || []).filter((token) => token.length > 3 && !stop.has(token)));
const overlap = (a, b) => {
  const left = tokens(a); const right = tokens(b);
  let score = 0; for (const token of left) if (right.has(token)) score += 1;
  return score;
};
const forbidden = /^(?:ninguna respuesta|a y b son correctas|todas las anteriores)$/iu;
const shape = (text) => {
  if (/^\s*\d+(?:[.,]\d+)?\s*%?\s*$/u.test(text)) return 'numeric';
  if (/^\s*(?:sí|no|ambas)\b/iu.test(text)) return 'binary';
  if (/\b(?:departamento|director|equipo|secci[oó]n)\b/iu.test(text)) return 'role';
  if (text.length > 100) return 'definition-long';
  if (text.length > 55) return 'definition';
  return 'term';
};

for (const question of migrated) {
  const existing = new Set(question.options.filter((option) => option.id !== 'd').map((option) => option.text.trim().toLocaleLowerCase('es-ES')));
  const existingOptionText = question.options.filter((option) => option.id !== 'd').map((option) => option.text).join(' ');
  const pool = sourceQuestions.filter((candidate) => candidate.id !== question.id && (
    candidate.topicId === question.topicId || (question.topicId.startsWith('comun-') && candidate.topicId.startsWith('comun-'))
  ));
  const lengths = question.options.filter((option) => option.id !== 'd').map((option) => option.text.length).sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)];
  const shapes = question.options.filter((option) => option.id !== 'd').map((option) => shape(option.text));
  const dominantShape = shapes.sort((a, b) => shapes.filter((item) => item === b).length - shapes.filter((item) => item === a).length)[0];
  const candidates = pool.flatMap((candidate) => candidate.options.map((option) => ({ candidate, option })))
    .filter(({ option }) => !forbidden.test(option.text.trim()) && !existing.has(option.text.trim().toLocaleLowerCase('es-ES')))
    .map(({ candidate, option }) => ({
      candidate,
      option,
      score: overlap(question.prompt, candidate.prompt) * 50
        + overlap(question.prompt, option.text) * 200
        + overlap(existingOptionText, option.text) * 100
        + (shape(option.text) === dominantShape ? 80 : 0)
        - Math.abs(option.text.length - median)
    }))
    .sort((a, b) => b.score - a.score || a.option.text.localeCompare(b.option.text, 'es'));
  if (!candidates.length) continue;
  const chosen = candidates[0];
  const distractor = question.options.find((option) => option.id === 'd');
  distractor.text = chosen.option.text.trim();
  question.optionMigration.distractorSourceQuestionId = chosen.candidate.id;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Refinados ${migrated.length} distractores editoriales M1 con similitud temática.`);
