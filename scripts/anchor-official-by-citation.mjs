import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');
const reportPath = join(root, 'data/official-anchor-audit.json');

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));

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
  { lawId: 'ley-50-1997', re: /\b(?:ley\s*50\/1997)\b/i, label: 'Ley 50/1997' },
  { lawId: 'ley-31-1995', re: /\b(?:ley\s*31\/1995|prevenci[oó]n de riesgos laborales)\b/i, label: 'Ley 31/1995' },
  { lawId: 'rd-486-1997', re: /\b(?:real decreto\s*486\/1997|RD\s*486\/1997)\b/i, label: 'Real Decreto 486/1997' },
  { lawId: 'rd-1215-1997', re: /\b(?:real decreto\s*1215\/1997|RD\s*1215\/1997)\b/i, label: 'Real Decreto 1215/1997' },
  { lawId: 'rd-773-1997', re: /\b(?:real decreto\s*773\/1997|RD\s*773\/1997)\b/i, label: 'Real Decreto 773/1997' },
  { lawId: 'rd-1435-1985', re: /\b(?:real decreto\s*1435\/1985|RD\s*1435\/1985)\b/i, label: 'Real Decreto 1435/1985' },
  { lawId: 'rdleg-1-2013', re: /\b(?:real decreto legislativo\s*1\/2013|derechos de las personas con discapacidad)\b/i, label: 'Real Decreto Legislativo 1/2013' },
  { lawId: 'eu-tfeu-2012', re: /\b(?:TFUE|Tratado de Funcionamiento de la Uni[oó]n Europea)\b/i, label: 'TFUE' },
  { lawId: 'eu-teu-2012', re: /\b(?:TUE|Tratado de la Uni[oó]n Europea)\b/i, label: 'TUE' }
];

const articleRe = /\b(?:art(?:[íi]culo)?|art\.)\s*\.?\s*(\d+)(?:\.\d+)?\s*(bis)?\b/i;

const articleMaps = new Map();
const htmlCache = new Map();

async function getLawHtml(lawId) {
  if (htmlCache.has(lawId)) return htmlCache.get(lawId);
  const law = lawMap.get(lawId);
  if (!law) return null;
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  htmlCache.set(lawId, html);
  return html;
}

async function getArticleMap(lawId) {
  if (articleMaps.has(lawId)) return articleMaps.get(lawId);
  const html = await getLawHtml(lawId);
  const map = new Map();
  if (html) {
    const re = /(?:<article|<section)\s+id="([^"]+)"[^>]*data-ref="Art.culo\s*([^"<]+)"/g;
    let match;
    while ((match = re.exec(html))) {
      const raw = match[2].replace(/\s+/g, ' ').trim().toLowerCase();
      const article = raw.match(/^(\d+)(?:\s*bis)?/);
      if (!article) continue;
      const key = `${article[1]}${raw.includes('bis') ? 'bis' : ''}`;
      if (!map.has(key)) map.set(key, match[1]);
      if (!raw.includes('bis') && !map.has(article[1])) map.set(article[1], match[1]);
    }
    const sectionRe = /<section\s+id="([^"]+)"[^>]*>[\s\S]*?<h[2-4][^>]*>\s*Art(?:í|Ã­|i)culo\s*(\d+)(?:\s*bis)?/gi;
    while ((match = sectionRe.exec(html))) {
      const full = match[0].toLowerCase();
      const key = `${match[2]}${full.includes('bis') ? 'bis' : ''}`;
      if (!map.has(key)) map.set(key, match[1]);
      if (!full.includes('bis') && !map.has(match[2])) map.set(match[2], match[1]);
    }
  }
  articleMaps.set(lawId, map);
  return map;
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

function detectLaw(text) {
  return lawPatterns.find(item => item.re.test(text));
}

function detectArticle(text) {
  const match = text.match(articleRe);
  if (!match) return null;
  return `${match[1]}${match[2] ? 'bis' : ''}`;
}

const report = {
  generatedAt: '2026-08-01',
  rule: 'Solo se anclan preguntas oficiales activas no ancladas cuando el enunciado cita expresamente una norma y un artículo existente en el corpus HTML.',
  current: null,
  anchored: [],
  skipped: {
    alreadyAnchored: 0,
    protectedLegacyMigration: 0,
    noLawCitation: [],
    noArticleCitation: [],
    lawNotImported: [],
    anchorNotImported: []
  }
};

for (const question of questions) {
  if (!activeOfficial(question)) continue;
  if (protectedLegacyMigration(question)) {
    if (question.source?.lawId && question.officialSource) {
      question.source = question.officialSource;
      delete question.sourceReview;
    }
    report.skipped.protectedLegacyMigration += 1;
    continue;
  }
  if (alreadyAnchored(question)) {
    report.skipped.alreadyAnchored += 1;
    continue;
  }

  const text = [question.prompt, ...(question.options || []).map(option => option.text)].join(' ');
  const lawMatch = detectLaw(text);
  if (!lawMatch) {
    report.skipped.noLawCitation.push({ id: question.id, topicId: question.topicId, prompt: question.prompt });
    continue;
  }
  if (!lawMap.has(lawMatch.lawId)) {
    report.skipped.lawNotImported.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, prompt: question.prompt });
    continue;
  }
  const article = detectArticle(text);
  if (!article) {
    report.skipped.noArticleCitation.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, prompt: question.prompt });
    continue;
  }
  const articleMap = await getArticleMap(lawMatch.lawId);
  const anchorId = articleMap.get(article);
  if (!anchorId) {
    report.skipped.anchorNotImported.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, article, prompt: question.prompt });
    continue;
  }

  if (question.source?.kind === 'official_exam') question.officialSource = question.source;
  else if (question.source && !question.officialSource) question.previousSource = question.source;
  const law = lawMap.get(lawMatch.lawId);
  question.source = {
    lawId: lawMatch.lawId,
    anchorId,
    reference: `${lawMatch.label}, artículo ${article.replace('bis', ' bis')}`,
    url: law.officialUrl
  };
  if (lawMatch.lawId === 'rd-1435-1985') question.temporalContext = 'vigente-hasta-2027-05-24';
  question.sourceReview = {
    status: 'anchored-by-explicit-citation',
    reviewedAt: '2026-08-01',
    note: 'Anclaje automático conservador: norma y artículo aparecen citados en el enunciado u opciones; la procedencia oficial se conserva en origin/officialSource.'
  };
  report.anchored.push({ id: question.id, topicId: question.topicId, lawId: lawMatch.lawId, anchorId, article });
}

const activeOfficialQuestions = questions.filter(activeOfficial);
const anchoredByCitation = activeOfficialQuestions
  .filter(question => question.sourceReview?.status === 'anchored-by-explicit-citation')
  .map(question => ({
    id: question.id,
    topicId: question.topicId,
    lawId: question.source?.lawId,
    anchorId: question.source?.anchorId,
    reference: question.source?.reference
  }));

const anchoredOfficial = activeOfficialQuestions.filter(alreadyAnchored);
const examOnlyOfficial = activeOfficialQuestions.filter(question => !alreadyAnchored(question));
const unanchoredByTopic = Object.entries(examOnlyOfficial.reduce((acc, question) => {
  acc[question.topicId] = (acc[question.topicId] || 0) + 1;
  return acc;
}, {}))
  .sort((a, b) => b[1] - a[1])
  .map(([topicId, count]) => ({ topicId, count }));

const unanchoredByOriginTopic = Object.entries(examOnlyOfficial.reduce((acc, question) => {
  const originLabel = question.origin?.examId || question.origin?.source || question.origin?.label || 'sin-examen';
  const key = `${originLabel} || ${question.topicId}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {}))
  .sort((a, b) => b[1] - a[1])
  .map(([key, count]) => {
    const [origin, topicId] = key.split(' || ');
    return { origin, topicId, count };
  });

report.current = {
  activeOfficial: activeOfficialQuestions.length,
  anchoredOfficial: anchoredOfficial.length,
  examOnlyOfficial: examOnlyOfficial.length,
  anchoredByExplicitCitation: anchoredByCitation.length,
  anchoredByExplicitCitationQuestions: anchoredByCitation,
  unanchoredByTopic,
  unanchoredByOriginTopic,
  note: 'examOnlyOfficial conserva preguntas oficiales útiles pero no ancladas al corpus; anchoredByExplicitCitation identifica las oficiales que ahora apuntan a una norma y ancla concreta.'
};

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Ancladas por cita expresa: ${report.anchored.length}`);
console.log(`Oficiales activas: ${report.current.activeOfficial}`);
console.log(`Oficiales ancladas ahora: ${report.current.anchoredOfficial}`);
console.log(`Oficiales solo con examen de origen: ${report.current.examOnlyOfficial}`);
console.log(`Ancladas por cita expresa acumuladas: ${report.current.anchoredByExplicitCitation}`);
console.log(`Ya estaban ancladas: ${report.skipped.alreadyAnchored}`);
console.log(`Migraciones M1 protegidas: ${report.skipped.protectedLegacyMigration}`);
console.log(`Sin cita de norma: ${report.skipped.noLawCitation.length}`);
console.log(`Sin cita de artículo: ${report.skipped.noArticleCitation.length}`);
console.log(`Norma no importada: ${report.skipped.lawNotImported.length}`);
console.log(`Artículo no importado: ${report.skipped.anchorNotImported.length}`);
