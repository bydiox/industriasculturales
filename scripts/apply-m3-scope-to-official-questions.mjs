import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const readJson = file => readFile(join(root, file), 'utf8').then(JSON.parse);
const writeJson = (file, data) => writeFile(join(root, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
const today = '2026-08-01';

const textOf = question => [
  question.prompt,
  question.explanation,
  ...(question.options || []).map(option => option.text),
  question.source?.reference,
  question.officialSource?.reference
].filter(Boolean).join('\n');

const makeReview = (status, note, extra = {}) => ({
  status,
  reviewedAt: today,
  reviewer: 'codex-editorial-scope',
  note,
  ...extra
});

const outOfScopePatterns = [
  {
    key: 'rd-203-2021',
    regex: /Real Decreto\s*203\/2021|área personalizada|Carpeta Ciudadana|actuaci[oó]n y funcionamiento del sector p[uú]blico por medios electr[oó]nicos/i,
    reason: 'Administración electrónica no forma parte del temario M3 actual; era núcleo del proyecto P03.'
  },
  {
    key: 'ley-19-2013',
    regex: /Ley\s*19\/2013|transparencia,\s*acceso a la informaci[oó]n p[uú]blica|buen gobierno/i,
    reason: 'Transparencia y buen gobierno no aparece como bloque propio en el temario M3; procede dejarlo fuera del banco activo.'
  },
  {
    key: 'ley-2-2023',
    regex: /Ley\s*2\/2023|personas que informen sobre infracciones|lucha contra la corrupci[oó]n|canal interno de informaci[oó]n/i,
    reason: 'Protección de informantes y lucha contra la corrupción no está delimitada en el temario M3.'
  },
  {
    key: 'ley-27-2022',
    regex: /Ley\s*27\/2022|institucionalizaci[oó]n de la evaluaci[oó]n de las pol[ií]ticas p[uú]blicas/i,
    reason: 'La evaluación de políticas públicas AGE no está como norma de estudio en M3; los temas de planificación se tratarán como referencia profesional verificable.'
  },
  {
    key: 'lo-4-2001',
    regex: /Ley Org[aá]nica\s*4\/2001|derecho de petici[oó]n/i,
    reason: 'El derecho de petición puede aparecer en Constitución, pero el desarrollo de la LO 4/2001 queda fuera del nivel explícito del temario M3.'
  },
  {
    key: 'ley-7-1985',
    regex: /Ley\s*7\/1985|Reguladora de las Bases del R[eé]gimen Local|Diputaci[oó]n provincial|municipios con/i,
    reason: 'Régimen local detallado no está delimitado en el temario M3; la organización territorial se estudia desde Constitución y marco general.'
  }
];

const externalReferencePatterns = [
  {
    key: 'codigo-civil-art-1',
    regex: /C[oó]digo Civil|art[ií]culo\s+1\s+del\s+C[oó]digo Civil/i,
    reference: {
      kind: 'normativa-apoyo',
      title: 'Código Civil, artículo 1',
      reason: 'Sirve como apoyo clásico para fuentes del Derecho en el tema común 8, pero no se convierte en una unidad de legislación de estudio.',
      corpusPolicy: 'referencia-externa-no-unidad-de-ley'
    }
  },
  {
    key: 'rd-2271-2004',
    regex: /Real Decreto\s*2271\/2004|personas con discapacidad al empleo p[uú]blico|pruebas selectivas.*discapacidad/i,
    reference: {
      kind: 'normativa-apoyo',
      title: 'Real Decreto 2271/2004, acceso al empleo público de personas con discapacidad',
      reason: 'Apoya el tema común 12 sobre empleo público y discapacidad, pero no se añade como ley de lectura obligatoria salvo que decidamos ampliar el corpus.',
      corpusPolicy: 'referencia-externa-no-unidad-de-ley'
    }
  }
];

const corpusExtensionById = {
  'm3-cultura-2025-comun-07': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 26', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'm3-cultura-2025-comun-08': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 36', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-advo-2024-37': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 198', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-003': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 103', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-052': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 34', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-054': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 236', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-055': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 27', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-egoa-2019-002': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 101', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-egoa-2019-049': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 208', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-egoa-2019-050': { lawId: 'ley-9-2017-lcsp', reference: 'Ley 9/2017, artículo 120', reason: 'LCSP sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'm3-cultura-2025-comun-36': { lawId: 'rdleg-2-2015-et', reference: 'Texto Refundido del Estatuto de los Trabajadores, artículo 50', reason: 'Estatuto de los Trabajadores sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'm3-cultura-2025-comun-37': { lawId: 'rdleg-2-2015-et', reference: 'Texto Refundido del Estatuto de los Trabajadores, artículo 69', reason: 'Estatuto de los Trabajadores sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-004': { lawId: 'tfue-2016', reference: 'TFUE, artículo 234', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-023': { lawId: 'tue-2016', reference: 'TUE, artículo 20', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2024-031': { lawId: 'tfue-2016', reference: 'TFUE, artículo 45', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2022-016': { lawId: 'tue-2016', reference: 'TUE, artículo 50', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2022-018': { lawId: 'tfue-2016', reference: 'TFUE, artículo 285', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-gace-2022-022': { lawId: 'tfue-2016', reference: 'TFUE, artículo 312', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-egoa-2019-018': { lawId: 'tue-2016', reference: 'TUE, artículo 15', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-etgoa-2024-022': { lawId: 'tfue-2016', reference: 'TFUE, artículo 4', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-etgoa-2024-023': { lawId: 'tue-2016', reference: 'TUE, artículo 49', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' },
  'inap-etgoa-2024-030': { lawId: 'tfue-2016', reference: 'TFUE, artículo 59', reason: 'Unión Europea sí entra; la pregunta queda activa pero requiere ampliar/normalizar esa ancla concreta.' }
};

const questions = await readJson('data/questions.json');
const report = {
  generatedAt: today,
  policy: 'Preguntas oficiales: solo se mantienen activas como banco M3 si el contenido entra claramente en la convocatoria. Las normas de apoyo se conservan como referencia externa; el ruido se mueve a histórico/inactivo.',
  deactivatedOutOfScope: [],
  keptAsExternalReference: [],
  requiresCorpusExtension: [],
  preservedNeedsAnswerReview: [],
  unchanged: 0
};

for (const question of questions) {
  const isOfficial = question.source?.kind === 'official_exam' || question.officialSource?.kind === 'official_exam' || question.origin?.type === 'official_exam';
  if (!isOfficial) {
    report.unchanged += 1;
    continue;
  }

  if (question.sourceReview?.status === 'needs-answer-review-before-anchoring') {
    report.preservedNeedsAnswerReview.push(question.id);
    continue;
  }

  const body = textOf(question);
  const outOfScope = outOfScopePatterns.find(item => item.regex.test(body));
  if (outOfScope) {
    question.active = false;
    question.editorialStatus = 'out-of-scope-m3';
    question.origin = {
      ...(question.origin || {}),
      type: question.origin?.type || 'official_exam',
      historical: true
    };
    question.sourceReview = makeReview('out-of-scope-for-m3', outOfScope.reason, {
      matchedPolicy: outOfScope.key,
      action: 'deactivated-kept-as-historical'
    });
    report.deactivatedOutOfScope.push({ id: question.id, topicId: question.topicId, matchedPolicy: outOfScope.key, reason: outOfScope.reason });
    continue;
  }

  const extension = corpusExtensionById[question.id];
  if (extension && !question.source?.lawId) {
    question.sourceReview = makeReview('requires-corpus-extension-before-law-anchor', extension.reason, {
      suggestedLawId: extension.lawId,
      suggestedReference: extension.reference,
      action: 'kept-active-official-source-until-anchor-exists'
    });
    report.requiresCorpusExtension.push({ id: question.id, topicId: question.topicId, ...extension });
    continue;
  }

  const external = externalReferencePatterns.find(item => item.regex.test(body));
  if (external && !question.source?.lawId) {
    question.externalReference = external.reference;
    question.sourceReview = makeReview('external-reference-kept-out-of-law-corpus', external.reference.reason, {
      matchedPolicy: external.key,
      action: 'kept-active-as-official-question-with-external-reference'
    });
    report.keptAsExternalReference.push({ id: question.id, topicId: question.topicId, matchedPolicy: external.key, title: external.reference.title });
    continue;
  }

  report.unchanged += 1;
}

await writeJson('data/questions.json', questions);
await writeJson('data/m3-official-scope-review.json', report);

console.log(`Preguntas oficiales desactivadas por fuera de temario: ${report.deactivatedOutOfScope.length}`);
console.log(`Preguntas oficiales conservadas como referencia externa: ${report.keptAsExternalReference.length}`);
console.log(`Preguntas oficiales pendientes de ampliar corpus/ancla: ${report.requiresCorpusExtension.length}`);
console.log(`Preguntas preservadas para revisión de respuesta: ${report.preservedNeedsAnswerReview.length}`);
