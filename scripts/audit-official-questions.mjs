import fs from 'node:fs';

const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const isOfficial = (question) => question.origin?.type === 'official_exam';
const isOfficialVariant = (question) => question.officialSource?.kind === 'official_exam' || question.officialSource?.type === 'official_exam';
const activeInCurrentBank = (question) => question.active === true || (question.active !== false && question.origin?.historical !== true);
const active = questions.filter(activeInCurrentBank);
const activeOfficial = active.filter(isOfficial);
const activeOfficialVariants = active.filter((question) => !isOfficial(question) && isOfficialVariant(question));

function bucket(question) {
  const id = question.id || '';
  if (id.startsWith('m1c-2025-')) return 'M1 Cultura 2025 · parte común';
  if (id.startsWith('m1e-2025-')) return 'M1 Cultura 2025 · parte específica';
  if (id.startsWith('m1-cultura-')) return 'M1 Cultura 2023';
  if (id.startsWith('m3-cultura-2025')) return 'M3 Cultura 2025 · parte común';
  if (id.startsWith('inap-')) return 'INAP';
  if (id.startsWith('m3-2021')) return 'M3 2021 histórico';
  if (id.startsWith('m3-oficial')) return 'M3 Igualdad · variante';
  return 'Otros';
}

function hasAnswerKey(question) {
  const source = question.source || {};
  const officialSource = question.officialSource || {};
  return Boolean(source.answerKeyFile || source.answerKeyUrl || officialSource.answerKeyFile || officialSource.answerKeyUrl);
}

function hasReview(question) {
  return Boolean(question.editorialReview || question.review);
}

function isReserve(question) {
  const number = String(question.origin?.questionNumber ?? question.origin?.numeroOriginal ?? '').toLowerCase();
  return number.includes('reserva') || number.includes('reserve') || /-r\d+$/.test(question.id);
}

function optionIssue(question) {
  const options = Array.isArray(question.options) ? question.options : [];
  const labels = options.map((option) => String(option.text ?? option.label ?? '').trim().toLocaleLowerCase());
  const duplicates = labels.filter((label, index) => label && labels.indexOf(label) !== index);
  const correct = options.filter((option) => option.id === question.correctOptionId).length;
  if (options.length !== 4) return `opciones=${options.length}`;
  if (duplicates.length) return 'opciones duplicadas';
  if (correct !== 1) return `correcta=${correct}`;
  return null;
}

const byBucket = new Map();
for (const question of activeOfficial) {
  const key = bucket(question);
  const current = byBucket.get(key) || { total: 0, answerKey: 0, review: 0, reserve: 0, optionIssues: [] };
  current.total += 1;
  if (hasAnswerKey(question)) current.answerKey += 1;
  if (hasReview(question)) current.review += 1;
  if (isReserve(question)) current.reserve += 1;
  const issue = optionIssue(question);
  if (issue) current.optionIssues.push({ id: question.id, issue });
  byBucket.set(key, current);
}

const promptGroups = new Map();
for (const question of activeOfficial) {
  const prompt = String(question.prompt || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
  if (!prompt) continue;
  const ids = promptGroups.get(prompt) || [];
  ids.push(question.id);
  promptGroups.set(prompt, ids);
}
const duplicatePrompts = [...promptGroups.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([prompt, ids]) => ({ prompt, ids }));

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    questions: questions.length,
    active: active.length,
    activeOfficial: activeOfficial.length,
    inactiveOfficial: questions.filter((question) => isOfficial(question) && question.active === false).length,
    activeOfficialVariants: activeOfficialVariants.length,
  },
  activeOfficial: {
    optionIssues: activeOfficial.flatMap((question) => {
      const issue = optionIssue(question);
      return issue ? [{ id: question.id, issue }] : [];
    }),
    withoutAnswerKeyEvidence: activeOfficial.filter((question) => !hasAnswerKey(question)).map((question) => question.id),
    withoutEditorialReview: activeOfficial.filter((question) => !hasReview(question)).map((question) => question.id),
    reserves: activeOfficial.filter(isReserve).map((question) => question.id),
    duplicatePrompts,
  },
  byBucket: Object.fromEntries(byBucket),
  activeOfficialVariants: {
    count: activeOfficialVariants.length,
    ids: activeOfficialVariants.map((question) => question.id),
  },
};

console.log(JSON.stringify(report, null, 2));
