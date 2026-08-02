import { readFile, writeFile } from 'node:fs/promises';

const questionsUrl = new URL('../data/questions.json', import.meta.url);
const questions = JSON.parse(await readFile(questionsUrl, 'utf8'));
const question = {
  id: 'm3-ref-especifico-39-qlab-01',
  topicId: 'especifico-39',
  prompt: '¿Para qué se utilizan QLab y otras herramientas equivalentes en un espectáculo?',
  options: [
    { id: 'a', text: 'Para organizar y lanzar cues de audio, vídeo o control escénico.' },
    { id: 'b', text: 'Para calcular las nóminas y las cotizaciones de la compañía.' },
    { id: 'c', text: 'Para confeccionar digitalmente el vestuario de cada personaje.' },
    { id: 'd', text: 'Para sustituir el cálculo estructural de decorados y practicables.' }
  ],
  correctOptionId: 'a',
  explanation: 'QLab es una herramienta de control de espectáculo: permite ordenar y lanzar cues o pies de audio, vídeo y otras acciones. Las nóminas, la confección de vestuario y el cálculo estructural corresponden a otros programas y procesos.',
  source: {
    kind: 'referencia',
    reference: 'Software y tecnología cultural · ficha de estudio, apartado «Software aplicado a escena»',
    locator: 'Apartado «Software aplicado a escena»',
    file: 'sources/fuente-tecnologia-B.html',
    anchorId: 'escena'
  },
  active: true,
  editorialReview: {
    status: 'reviewed-for-current-m3-bank',
    reviewedAt: '2026-08-02',
    reviewer: 'codex',
    note: 'Pregunta definicional de nivel M3, con cuatro distractores homogéneos y fuente local.'
  }
};

if (!questions.some(item => item.id === question.id)) questions.push(question);
await writeFile(questionsUrl, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log('Refuerzo pool5 de específico-39 incorporado.');
