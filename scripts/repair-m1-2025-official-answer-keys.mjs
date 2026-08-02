import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const reviewedAt = '2026-08-02';

const sources = [
  {
    matches: value => value.includes('Maquinaria Escénica'),
    date: '2025-02-18',
    displayDate: '18/02/2025',
    answers: ['ACCDCDDDBA', 'CDCDBAADBD', 'CACDCCBBBC', 'CCBCCADAAC'].join(''),
    file: 'imports/m1-para-m3-final/plantillas-oficiales/plantilla-m1-tl-maquinaria-escenica.pdf',
    url: 'https://www.cultura.gob.es/dam/jcr:d33c6fec-0f5c-489a-8598-fdd9367d3624/plantilla-m1-tl-maquinaria-escenica.pdf'
  },
  {
    matches: value => value.includes('Guía, Información'),
    date: '2025-02-18',
    displayDate: '18/02/2025',
    answers: ['ACDDBCDDAB', 'ABADAABBCA', 'BCABBDACAA', 'BDCBDCBCCB'].join(''),
    file: 'imports/m1-para-m3-final/plantillas-oficiales/plantilla-m1-tl-guia.pdf',
    url: 'https://www.cultura.gob.es/dam/jcr:7653baf3-9839-4006-86ef-4487d99fffe9/plantilla-m1-tl-guia--inf--y-asist--turistica.pdf'
  },
  {
    matches: value => value.includes('Iluminación, Captación'),
    date: '2025-02-19',
    displayDate: '19/02/2025',
    answers: ['BABCDDACAB', 'BBCBDCCDAB', 'ADACBBBDCA', 'BAADABBBBA'].join(''),
    file: 'imports/m1-para-m3-final/plantillas-oficiales/plantilla-m1-tl-imagen.pdf',
    url: 'https://www.cultura.gob.es/dam/jcr:6fe2bfd7-1941-4fea-b11a-208b82f30341/plantilla-m1-tl-imagen.pdf'
  }
];

for (const source of sources) {
  if (source.answers.length !== 40) throw new Error(`La plantilla ${source.file} no contiene 40 claves: ${source.answers.length}`);
}

let reviewed = 0;
let corrected = 0;
let reactivated = 0;

for (const question of questions.filter(item => item.id.startsWith('m1c-2025-'))) {
  const specialty = question.origin?.especialidad || question.origin?.label || '';
  const source = sources.find(item => item.matches(specialty));
  const number = Number(question.origin?.numeroOriginal ?? question.origin?.questionNumber);
  if (!source || !Number.isInteger(number) || number < 1 || number > 40) {
    throw new Error(`No se puede localizar la plantilla oficial de ${question.id}`);
  }

  const officialAnswer = source.answers[number - 1];
  if (!question.options.some(option => option.id.toUpperCase() === officialAnswer)) {
    throw new Error(`La opción oficial ${officialAnswer} no existe en ${question.id}`);
  }
  if (question.correctOptionId.toUpperCase() !== officialAnswer) corrected += 1;
  question.correctOptionId = question.options.find(option => option.id.toUpperCase() === officialAnswer).id;

  question.origin.date = source.date;
  question.source.reference = question.source.reference
    .replace(/\d{2}\/\d{2}\/2025/g, source.displayDate)
    .replace(/pregunta\s+\d+/i, `pregunta ${number}`);
  question.source.answerKeyFile = source.file;
  question.source.answerKeyUrl = source.url;
  question.source.answerKeyQuestion = number;
  question.source.answerKeyOption = officialAnswer;

  question.explanation = `Pregunta oficial del Ministerio de Cultura. La plantilla publicada por el tribunal señala la opción ${officialAnswer} para la pregunta ${number}. Consulta «Ver fuente» para repasar el precepto o material asociado cuando esté disponible.`;
  question.editorialReview = {
    status: 'official-answer-key-verified',
    reviewedAt,
    reviewer: 'codex',
    note: 'Clave contrastada por especialidad y número de pregunta contra la plantilla oficial del tribunal.'
  };

  if (question.editorialStatus === 'pending-current-law-and-anchor-review') {
    question.active = true;
    delete question.editorialStatus;
    delete question.sourceReview;
    reactivated += 1;
  }
  reviewed += 1;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Preguntas oficiales M1 2025 revisadas: ${reviewed}`);
console.log(`Claves corregidas contra las plantillas oficiales: ${corrected}`);
console.log(`Preguntas oficiales reactivadas: ${reactivated}`);
