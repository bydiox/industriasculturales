import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');

const decode = value => value
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/gi, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/\s+/g, ' ')
  .trim();

const normalize = value => value.toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

function sourceBlock(html, anchorId) {
  const escaped = anchorId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const opening = new RegExp(`<([a-z0-9]+)[^>]*(?:id|data-anchor-id)=["']${escaped}["'][^>]*>`, 'i').exec(html);
  if (!opening) return '';
  const tag = opening[1];
  const end = html.indexOf(`</${tag}>`, opening.index + opening[0].length);
  return html.slice(opening.index + opening[0].length, end < 0 ? html.length : end);
}

function candidateParagraphs(html) {
  return [...html.matchAll(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)]
    .map(match => decode(match[1]))
    .flatMap(item => item.split(/(?<=[.;:!?])\s+/))
    .map(item => item.replace(/^[-–—•\d.\s]+/, '').replace(/[;:]+$/, '.').trim())
    .filter(item => item.length >= 28 && item.length <= 160)
    .filter(item => !/^(?:fuente oficial|texto oficial|referencia del|orden [A-Z]|real decreto|ley \d|BOE-|https?:|id=)/i.test(item))
    .filter(item => !/https?:\/\/|BOE-A-\d{4}/i.test(item));
}

function distance(a, b) {
  return Math.abs(a.length - b);
}

const stopWords = new Set('el la los las un una unos unas de del al en por para con sin y o que según conforme como se su sus es son a lo lo que qué cuál cuál cuando dónde quien quién debe deben tiene tienen entre sobre este esta estos estas'.split(' '));
function tokens(value) {
  return new Set(normalize(value).split(/[^a-z0-9áéíóúüñ]+/).filter(token => token.length > 3 && !stopWords.has(token)));
}
function overlap(a, b) {
  const left = tokens(a); const right = tokens(b);
  return [...left].filter(token => right.has(token)).length;
}
function containsOptionTokens(candidate, option) {
  const optionTokens = tokens(option);
  const candidateTokens = tokens(candidate);
  return optionTokens.size >= 3 && [...optionTokens].every(token => candidateTokens.has(token));
}

const [questions, manifest] = await Promise.all([
  readFile(questionsPath, 'utf8').then(JSON.parse),
  readFile(manifestPath, 'utf8').then(JSON.parse)
]);
const lawById = new Map(manifest.laws.map(law => [law.lawId, law]));
const htmlCache = new Map();
const corpusBySource = new Map();
for (const question of questions) {
  const key = question.source?.lawId || question.source?.file || question.source?.kind;
  if (!key) continue;
  const items = corpusBySource.get(key) || [];
  items.push(...(question.options || []).map(option => option.text));
  corpusBySource.set(key, items);
}

async function getSourceHtml(question) {
  const law = question.source?.lawId ? lawById.get(question.source.lawId) : null;
  const relative = law ? join('data/laws', law.file) : question.source?.file ? join('data', question.source.file) : null;
  if (!relative) return '';
  if (!htmlCache.has(relative)) htmlCache.set(relative, await readFile(join(root, relative), 'utf8'));
  return htmlCache.get(relative);
}

async function sourceCandidates(question) {
  const html = await getSourceHtml(question);
  if (!html) return [];
  const local = sourceBlock(html, question.source?.anchorId || '');
  const key = question.source?.lawId || question.source?.file || question.source?.kind;
  return [...(corpusBySource.get(key) || []), ...candidateParagraphs(local), ...candidateParagraphs(html)];
}

const migrated = [];
const overrides = {
  'm3-centro-049': 'Un archivo general del Ministerio de Cultura, sin espacios de creación.',
  'm3-centro-050': 'Una sede administrativa del INAEM, sin espacios de residencia.',
  'm3-centro-051': 'Un auditorio principal y un archivo administrativo, sin salas de ensayo.',
  'm3-centro-055': 'La página histórica de centros del INAEM, aunque no esté actualizada.',
  'm3-corpus-006': 'Que cuenten con instrucciones del fabricante y documentación preventiva comprensible.',
  'm3-pool-006': 'Preparar convocatorias, partes y documentación de ensayo y función.',
  'm3-pool-012': 'Solo el repertorio y el calendario, sin información sobre equipos técnicos.',
  'm3-pool-015': 'Configuración de vídeo sin pruebas ni copias de respaldo.',
  'm3-pool-016': 'Preparación de contenidos sin coordinación con las órdenes de escena.'
};
const updated = [];
for (const question of questions) {
  const isOwnActiveThree = question.active !== false
    && question.origin?.historical !== true
    && question.origin?.type !== 'official_exam'
    && question.options?.length === 3;
  if (!isOwnActiveThree) {
    updated.push(question);
    continue;
  }
  const existing = new Set(question.options.map(option => normalize(option.text)));
  const targetLength = question.options.reduce((sum, option) => sum + option.text.length, 0) / question.options.length;
  const context = `${question.prompt} ${question.options.map(option => option.text).join(' ')}`;
  const candidates = (await sourceCandidates(question))
    .map(text => text.replace(/\s+/g, ' ').trim())
    .filter(text => !existing.has(normalize(text)))
    .filter(text => !question.options.some(option => containsOptionTokens(text, option.text)))
    .filter(text => overlap(text, question.options.find(option => option.id === question.correctOptionId)?.text || '') < Math.max(2, tokens(question.options.find(option => option.id === question.correctOptionId)?.text || '').size * 0.55))
    .filter(text => text.length >= 24 && text.length <= 180)
    .sort((a, b) => {
      const scoreA = overlap(a, context) * 4 - distance(a, targetLength) / 2;
      const scoreB = overlap(b, context) * 4 - distance(b, targetLength) / 2;
      return scoreB - scoreA;
    });
  const fallback = question.source?.lawId
    ? `Otra previsión de la norma citada, aplicable al ámbito regulado`
    : `Otro contenido de la fuente citada, referido al ámbito profesional`;
  const text = overrides[question.id] || candidates[0] || fallback;
  const option = { id: 'd', text };
  const next = {
    ...question,
    options: [...question.options, option],
    optionMigration: {
      ...(question.optionMigration || {}),
      source: 'own-three-to-four-source-derived',
      migratedAt: '2026-08-01',
      addedOptionId: 'd',
      addedOptionSource: question.source?.lawId ? 'law-html' : 'reference-html',
      addedOptionReference: question.source?.reference || null,
      addedOptionAnchorId: question.source?.anchorId || null
    }
  };
  updated.push(next);
  migrated.push({ id: question.id, added: text, source: next.optionMigration.addedOptionSource });
}

await writeFile(questionsPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
console.log(`Migradas ${migrated.length} preguntas propias de tres a cuatro opciones.`);
for (const item of migrated) console.log(`${item.id}\t${item.source}\t${item.added}`);
