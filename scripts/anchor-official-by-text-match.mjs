import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');
const reportPath = join(root, 'data/official-anchor-textmatch-audit.json');

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));

for (const question of questions) {
  if (question.sourceReview?.status === 'anchored-by-literal-text-match' && question.officialSource) {
    question.source = question.officialSource;
    delete question.sourceReview;
  }
}

const lawPatterns = [
  { lawId: 'ce-1978', re: /\b(?:constituci[oó]n espa[ñn]ola|constituci[oó]n|CE)\b/i, label: 'Constitución Española' },
  { lawId: 'ley-39-2015', re: /\b(?:ley\s*39\/2015|procedimiento administrativo com[uú]n)\b/i, label: 'Ley 39/2015' },
  { lawId: 'ley-40-2015', re: /\b(?:ley\s*40\/2015|r[eé]gimen jur[ií]dico del sector p[uú]blico)\b/i, label: 'Ley 40/2015' },
  { lawId: 'ley-9-2017-lcsp', re: /\b(?:ley\s*9\/2017|LCSP|contratos del sector p[uú]blico)\b/i, label: 'Ley 9/2017' },
  { lawId: 'rdleg-5-2015', re: /\b(?:real decreto legislativo\s*5\/2015|R\.?D\.?\s*5\/2015|TREBEP|estatuto b[aá]sico del empleado p[uú]blico)\b/i, label: 'TREBEP' },
  { lawId: 'convenio-iv', re: /\b(?:IV\s+Convenio|Convenio colectivo [uú]nico|CUAGE)\b/i, label: 'IV Convenio único AGE' },
  { lawId: 'rdleg-2-2015-et', re: /\b(?:real decreto legislativo\s*2\/2015|estatuto de los trabajadores|texto refundido.*trabajadores)\b/i, label: 'Estatuto de los Trabajadores' },
  { lawId: 'lo-11-1985-lols', re: /\b(?:ley org[aá]nica\s*11\/1985|libertad sindical)\b/i, label: 'Ley Orgánica 11/1985' },
  { lawId: 'ley-53-1984', re: /\b(?:ley\s*53\/1984|incompatibilidades)\b/i, label: 'Ley 53/1984' },
  { lawId: 'ley-50-1997', re: /\b(?:ley\s*50\/1997|Ley del Gobierno)\b/i, label: 'Ley 50/1997' },
  { lawId: 'ley-31-1995', re: /\b(?:ley\s*31\/1995|prevenci[oó]n de riesgos laborales)\b/i, label: 'Ley 31/1995' },
  { lawId: 'rd-486-1997', re: /\b(?:real decreto\s*486\/1997|RD\s*486\/1997)\b/i, label: 'Real Decreto 486/1997' },
  { lawId: 'rd-1215-1997', re: /\b(?:real decreto\s*1215\/1997|RD\s*1215\/1997)\b/i, label: 'Real Decreto 1215/1997' },
  { lawId: 'rd-773-1997', re: /\b(?:real decreto\s*773\/1997|RD\s*773\/1997)\b/i, label: 'Real Decreto 773/1997' },
  { lawId: 'rd-1435-1985', re: /\b(?:real decreto\s*1435\/1985|RD\s*1435\/1985)\b/i, label: 'Real Decreto 1435/1985' },
  { lawId: 'rdleg-1-2013', re: /\b(?:real decreto legislativo\s*1\/2013|derechos de las personas con discapacidad)\b/i, label: 'Real Decreto Legislativo 1/2013' },
  { lawId: 'eu-tfeu-2012', re: /\b(?:TFUE|Tratado de Funcionamiento de la Uni[oó]n Europea)\b/i, label: 'TFUE' },
  { lawId: 'eu-teu-2012', re: /\b(?:TUE|Tratado de la Uni[oó]n Europea)\b/i, label: 'TUE' },
  { lawId: 'lo-3-2007', re: /\b(?:ley org[aá]nica\s*3\/2007|igualdad efectiva de mujeres y hombres)\b/i, label: 'Ley Orgánica 3/2007' },
  { lawId: 'rdl-17-1977', re: /\b(?:real decreto-ley\s*17\/1977|derecho a la huelga|huelga)\b/i, label: 'Real Decreto-ley 17/1977' },
  { lawId: 'rd-364-1995', re: /\b(?:real decreto\s*364\/1995|reglamento general de ingreso)\b/i, label: 'Real Decreto 364/1995' },
  { lawId: 'rd-193-2023', re: /\b(?:real decreto\s*193\/2023|condiciones b[aá]sicas de accesibilidad)\b/i, label: 'Real Decreto 193/2023' }
];

const missingLawPatterns = [
  { lawId: 'codigo-civil', re: /\b(?:c[oó]digo civil)\b/i, label: 'Código Civil' },
  { lawId: 'ley-7-1985', re: /\b(?:ley\s*7\/1985|bases del r[eé]gimen local)\b/i, label: 'Ley 7/1985' },
  { lawId: 'ley-19-2013', re: /\b(?:ley\s*19\/2013|transparencia, acceso a la informaci[oó]n p[uú]blica y buen gobierno)\b/i, label: 'Ley 19/2013' },
  { lawId: 'rd-203-2021', re: /\b(?:real decreto\s*203\/2021|reglamento de actuaci[oó]n y funcionamiento.*medios electr[oó]nicos)\b/i, label: 'Real Decreto 203/2021' },
  { lawId: 'lo-4-2001', re: /\b(?:ley org[aá]nica\s*4\/2001|derecho de petici[oó]n)\b/i, label: 'Ley Orgánica 4/2001' },
  { lawId: 'ley-27-2022', re: /\b(?:ley\s*27\/2022|evaluaci[oó]n de pol[ií]ticas p[uú]blicas)\b/i, label: 'Ley 27/2022' },
  { lawId: 'ley-2-2023', re: /\b(?:ley\s*2\/2023|protecci[oó]n de las personas que informen|lucha contra la corrupci[oó]n)\b/i, label: 'Ley 2/2023' },
  { lawId: 'rd-2271-2004', re: /\b(?:real decreto\s*2271\/2004|acceso al empleo p[uú]blico.*personas con discapacidad)\b/i, label: 'Real Decreto 2271/2004' }
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[«»"“”.,;:()¿?¡!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function activeOfficial(question) {
  return question.origin?.type === 'official_exam'
    && (question.active === true || (question.active !== false && question.origin?.historical !== true));
}

function alreadyAnchored(question) {
  return Boolean(question.source?.lawId || ['bibliografia', 'referencia', 'institutional', 'amending-norm'].includes(question.source?.kind));
}

function protectedLegacyMigration(question) {
  return false;
}

function detectCandidates(text) {
  return lawPatterns.filter(item => item.re.test(text));
}

function detectMissingCandidates(text) {
  return missingLawPatterns.filter(item => item.re.test(text));
}

const articleCache = new Map();
async function getArticles(lawId) {
  if (articleCache.has(lawId)) return articleCache.get(lawId);
  const law = lawMap.get(lawId);
  if (!law) return [];
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  const articles = [];
  const re = /<article\s+id="([^"]+)"[^>]*data-ref="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g;
  let match;
  while ((match = re.exec(html))) {
    const [, anchorId, dataRef, body] = match;
    articles.push({
      anchorId,
      dataRef: dataRef.replace(/\s+/g, ' ').trim(),
      text: normalize(body)
    });
  }
  articleCache.set(lawId, articles);
  return articles;
}

function correctOption(question) {
  const id = question.correctOptionId;
  return question.options?.find(option => option.id === id) || null;
}

function tooShortForTextMatch(text) {
  return normalize(text).split(' ').length < 8;
}

const report = {
  generatedAt: '2026-08-01',
  rule: 'Solo se anclan preguntas oficiales activas no ancladas si citan una única norma importada y la respuesta correcta aparece literalmente en un único bloque HTML de esa norma.',
  anchored: [],
  skipped: {
    protectedLegacyMigration: 0,
    alreadyAnchored: 0,
    noImportedLawCitation: [],
    missingLawCitation: [],
    ambiguousLawCitation: [],
    noCorrectOption: [],
    correctOptionTooShort: [],
    noLiteralMatch: [],
    multipleLiteralMatches: []
  }
};

for (const question of questions) {
  if (!activeOfficial(question)) continue;
  if (protectedLegacyMigration(question)) {
    report.skipped.protectedLegacyMigration += 1;
    continue;
  }
  if (alreadyAnchored(question)) {
    report.skipped.alreadyAnchored += 1;
    continue;
  }

  const text = [question.prompt, ...(question.options || []).map(option => option.text)].join(' ');
  const importedCandidates = detectCandidates(text);
  const missingCandidates = detectMissingCandidates(text);
  if (importedCandidates.length === 0) {
    const bucket = missingCandidates.length ? report.skipped.missingLawCitation : report.skipped.noImportedLawCitation;
    bucket.push({
      id: question.id,
      topicId: question.topicId,
      missingLawIds: missingCandidates.map(item => item.lawId),
      prompt: question.prompt
    });
    continue;
  }
  if (importedCandidates.length > 1) {
    report.skipped.ambiguousLawCitation.push({
      id: question.id,
      topicId: question.topicId,
      lawIds: importedCandidates.map(item => item.lawId),
      prompt: question.prompt
    });
    continue;
  }

  const option = correctOption(question);
  if (!option) {
    report.skipped.noCorrectOption.push({ id: question.id, topicId: question.topicId, prompt: question.prompt });
    continue;
  }
  const needle = normalize(option.text);
  if (tooShortForTextMatch(option.text)) {
    report.skipped.correctOptionTooShort.push({ id: question.id, topicId: question.topicId, lawId: importedCandidates[0].lawId, prompt: question.prompt, correct: option.text });
    continue;
  }

  const lawMatch = importedCandidates[0];
  const matches = (await getArticles(lawMatch.lawId)).filter(article => article.text.includes(needle));
  if (matches.length === 0) {
    report.skipped.noLiteralMatch.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, prompt: question.prompt, correct: option.text });
    continue;
  }
  if (matches.length > 1) {
    report.skipped.multipleLiteralMatches.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, prompt: question.prompt, matches: matches.map(item => item.anchorId) });
    continue;
  }

  const law = lawMap.get(lawMatch.lawId);
  const article = matches[0];
  if (question.source?.kind === 'official_exam') question.officialSource = question.source;
  else if (question.source && !question.officialSource) question.previousSource = question.source;
  question.source = {
    lawId: lawMatch.lawId,
    anchorId: article.anchorId,
    reference: `${lawMatch.label}, ${article.dataRef}`,
    url: law.officialUrl
  };
  if (lawMatch.lawId === 'rd-1435-1985') question.temporalContext = 'vigente-hasta-2027-05-24';
  question.sourceReview = {
    status: 'anchored-by-literal-text-match',
    reviewedAt: '2026-08-01',
    note: 'Anclaje automático conservador: la pregunta cita una única norma importada y la respuesta correcta aparece literalmente en un único bloque de esa norma; la procedencia oficial se conserva en origin/officialSource.'
  };
  report.anchored.push({
    id: question.id,
    topicId: question.topicId,
    lawId: lawMatch.lawId,
    anchorId: article.anchorId,
    reference: question.source.reference
  });
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Ancladas por coincidencia literal: ${report.anchored.length}`);
console.log(`Ya estaban ancladas: ${report.skipped.alreadyAnchored}`);
console.log(`Migraciones M1 protegidas: ${report.skipped.protectedLegacyMigration}`);
console.log(`Sin cita de norma importada: ${report.skipped.noImportedLawCitation.length}`);
console.log(`Citan norma no importada: ${report.skipped.missingLawCitation.length}`);
console.log(`Cita ambigua de varias normas: ${report.skipped.ambiguousLawCitation.length}`);
console.log(`Respuesta demasiado corta: ${report.skipped.correctOptionTooShort.length}`);
console.log(`Sin coincidencia literal: ${report.skipped.noLiteralMatch.length}`);
console.log(`Coincidencia múltiple: ${report.skipped.multipleLiteralMatches.length}`);
