import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = join(root, 'data/historical-exams/m1-cultura-2023');
const files = (await readdir(dir)).filter((file) => file.startsWith('preguntas-m1-cultura-') && file.endsWith('.json'));
let normalized = 0;

for (const file of files) {
  const path = join(dir, file);
  const questions = JSON.parse(await readFile(path, 'utf8'));
  for (const question of questions) {
    if (question.id === 'm1-cultura-comun-2023-01' && question.prompt.length > 500) {
      question.prompt = '¿Qué día entró en vigor la Constitución Española de 1978 (en adelante CE)?';
    }
    for (const option of question.options || []) {
      option.text = option.text
        .replace(/\s+[A-Z]{2} - \d+(?: RESERVA)?$/u, '')
        .trim();
    }
    question.active = true;
    question.optionCount = 3;
    question.source = { ...question.source, kind: 'official_exam' };
    question.origin = {
      ...question.origin,
      historical: true,
      type: 'official_exam',
      label: question.origin.especialidad?.includes('(parte común')
        ? 'M1 Cultura · Parte común · Ministerio de Cultura y Deporte · 2023'
        : `M1 Cultura · ${question.origin.especialidad || 'Parte específica'} · 2023`,
      questionNumber: question.origin.numeroOriginal
    };
    normalized += 1;
  }
  await writeFile(path, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
}

const questionsPath = join(root, 'data/questions.json');
const bank = JSON.parse(await readFile(questionsPath, 'utf8'));
for (const question of bank.filter((item) => item.id.startsWith('m1-cultura-'))) {
  for (const option of question.options || []) option.text = option.text.replace(/\s+[A-Z]{2} - \d+(?: RESERVA)?$/u, '').trim();
}
await writeFile(questionsPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');

console.log(`Normalizadas ${normalized} preguntas oficiales M1 Cultura (2023).`);
