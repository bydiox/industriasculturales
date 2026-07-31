import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const updates = {
  'm3-contract-001': {
    prompt: 'Conforme al artículo 1 de la Ley 9/2017, ¿qué principios rigen la contratación pública?',
    options: [
      { id: 'a', text: 'Libertad de acceso, publicidad, transparencia e igualdad de trato.' },
      { id: 'b', text: 'Publicidad, concurrencia, jerarquía normativa y desconcentración.' },
      { id: 'c', text: 'Igualdad de trato, eficacia, descentralización y coordinación.' },
      { id: 'd', text: 'Transparencia, libre concurrencia, autotutela y ejecutividad.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 1 de la Ley 9/2017 vincula la contratación pública a la libertad de acceso, la publicidad, la transparencia y la igualdad de trato, junto con la no discriminación, la integridad y la eficiencia.'
  },
  'm3-eu-007': {
    prompt: '¿Qué actos jurídicos pueden adoptar las instituciones de la Unión conforme al artículo 288 TFUE?',
    options: [
      { id: 'a', text: 'Reglamentos, directivas, decisiones, recomendaciones y dictámenes.' },
      { id: 'b', text: 'Reglamentos, directivas, decisiones, resoluciones y dictámenes.' },
      { id: 'c', text: 'Reglamentos, directivas, recomendaciones, dictámenes y tratados.' },
      { id: 'd', text: 'Reglamentos, directivas, decisiones, recomendaciones y conclusiones.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 288 TFUE enumera cinco actos jurídicos: reglamentos, directivas, decisiones, recomendaciones y dictámenes. Los tratados pertenecen al derecho originario y resoluciones o conclusiones no forman parte de esa enumeración.'
  },
  'm3-admin-009': {
    prompt: '¿Cuál es el plazo máximo general del procedimiento administrativo cuando la norma reguladora no fija el plazo de resolución, conforme al artículo 21.3 de la Ley 39/2015?',
    options: [
      { id: 'a', text: 'Tres meses desde la iniciación.' },
      { id: 'b', text: 'Un mes desde la iniciación.' },
      { id: 'c', text: 'Seis meses desde la iniciación.' },
      { id: 'd', text: 'Dos meses desde la iniciación.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 21.3 de la Ley 39/2015 fija en tres meses el plazo máximo para resolver y notificar cuando las normas reguladoras del procedimiento no establecen otro plazo.'
  },
  'm3-emp-031': {
    prompt: 'Conforme al artículo 64.1 del IV Convenio Único, ¿a cuántas horas anuales equivale la jornada general máxima?',
    options: [
      { id: 'a', text: '1.642 horas anuales.' },
      { id: 'b', text: '1.645 horas anuales.' },
      { id: 'c', text: '1.650 horas anuales.' },
      { id: 'd', text: '1.635 horas anuales.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 64.1 del IV Convenio Único establece una jornada máxima general de 37,5 horas semanales de promedio en cómputo anual, equivalente a 1.642 horas anuales.'
  },
  'm3-contract-006': {
    prompt: 'Conforme al artículo 116 de la Ley 9/2017, ¿qué debe justificar el expediente de contratación?',
    options: [
      { id: 'a', text: 'La necesidad del contrato y la documentación exigida legalmente.' },
      { id: 'b', text: 'La solvencia del contratista, aunque no se motive la necesidad.' },
      { id: 'c', text: 'La existencia de crédito, aunque no se describa la prestación.' },
      { id: 'd', text: 'La identidad del adjudicatario antes de iniciar la licitación.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 116 exige que el expediente se inicie por el órgano de contratación y que se motive la necesidad del contrato, incorporando la documentación legalmente requerida.'
  },
  'm3-contract-009': {
    prompt: 'Conforme al artículo 150 de la Ley 9/2017, ¿qué actuación procede después de clasificar las ofertas?',
    options: [
      { id: 'a', text: 'Requerir al licitador mejor clasificado la documentación previa a la adjudicación.' },
      { id: 'b', text: 'Requerir al segundo clasificado antes de comprobar la documentación del primero.' },
      { id: 'c', text: 'Adjudicar directamente al mejor clasificado sin documentación adicional.' },
      { id: 'd', text: 'Solicitar simultáneamente la documentación a todos los licitadores.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 150 ordena las proposiciones por orden decreciente y prevé requerir al licitador mejor clasificado la documentación previa a la adjudicación.'
  },
  'm3-contract-010': {
    prompt: 'Conforme al artículo 190 de la Ley 9/2017, ¿qué prerrogativa corresponde al órgano de contratación?',
    options: [
      { id: 'a', text: 'Interpretar el contrato, resolver dudas y modificarlo por interés público dentro de los límites legales.' },
      { id: 'b', text: 'Modificar el contrato sin límites ni procedimiento cuando lo exija el interés público.' },
      { id: 'c', text: 'Delegar siempre en el contratista la interpretación y la resolución del contrato.' },
      { id: 'd', text: 'Suspender unilateralmente el contrato sin audiencia ni resolución motivada.' }
    ],
    correctOptionId: 'a',
    explanation: 'El artículo 190 reconoce, dentro de los límites legales, prerrogativas como interpretar los contratos, resolver las dudas que ofrezca su cumplimiento, modificarlos por razones de interés público y acordar su resolución.'
  }
};

for (const [id, update] of Object.entries(updates)) {
  const question = questions.find((candidate) => candidate.id === id);
  if (!question) throw new Error(`No se encontró la pregunta ${id}`);
  question.prompt = update.prompt;
  question.options = update.options;
  question.correctOptionId = update.correctOptionId;
  question.explanation = update.explanation;
  question.editorialReview = {
    version: 1,
    reviewedAt: '2026-07-31',
    focus: 'distractores plausibles y dato jurídico concreto'
  };
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Revisadas ${Object.keys(updates).length} preguntas editoriales.`);
