import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const lawsDir = join(root, 'data', 'laws');
const manifestPath = join(lawsDir, 'laws-manifest.json');
const scopesPath = join(root, 'data', 'law-scopes.json');
const questionsPath = join(root, 'data', 'questions.json');

const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const htmlEscape = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function studyFileName(file) {
  const extension = extname(file) || '.html';
  return `${basename(file, extension)}-B${extension}`;
}

function findElementBlocks(html) {
  const blocks = [];
  const stack = [];
  const tokenPattern = /<\/?(section|article)\b[^>]*>/gi;
  let match;
  while ((match = tokenPattern.exec(html))) {
    const [tagText, tagName] = match;
    const isClosing = tagText.startsWith('</');
    if (!isClosing) {
      const id = tagText.match(/\sid=["']([^"']+)["']/i)?.[1] || null;
      stack.push({ tagName: tagName.toLowerCase(), id, start: match.index });
      continue;
    }
    for (let index = stack.length - 1; index >= 0; index -= 1) {
      if (stack[index].tagName === tagName.toLowerCase()) {
        const block = stack.splice(index, 1)[0];
        blocks.push({
          ...block,
          end: tokenPattern.lastIndex,
          html: html.slice(block.start, tokenPattern.lastIndex)
        });
        break;
      }
    }
  }
  return blocks.sort((a, b) => a.start - b.start || b.end - a.end);
}

function findAnchorPositions(html, anchorIds) {
  return anchorIds
    .map(anchorId => {
      const pattern = new RegExp(`(?:id|data-anchor-id)=["']${anchorId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
      const match = pattern.exec(html);
      return match ? { anchorId, index: match.index } : null;
    })
    .filter(Boolean);
}

function chooseBlocksForAnchors(html, anchorIds) {
  const blocks = findElementBlocks(html);
  const anchors = findAnchorPositions(html, anchorIds);
  const selected = [];
  const missing = anchorIds.filter(anchorId => !anchors.some(anchor => anchor.anchorId === anchorId));

  for (const anchor of anchors) {
    const direct = blocks.find(block => block.id === anchor.anchorId);
    if (direct) {
      selected.push(direct);
      continue;
    }
    const containers = blocks
      .filter(block => block.start <= anchor.index && anchor.index < block.end)
      .sort((a, b) => (a.end - a.start) - (b.end - b.start));
    if (containers[0]) selected.push(containers[0]);
  }

  const unique = [...new Map(selected.map(block => [`${block.start}:${block.end}`, block])).values()]
    .sort((a, b) => a.start - b.start);

  return {
    blocks: unique.filter(block => !unique.some(other => other !== block && other.start <= block.start && block.end <= other.end)),
    missing
  };
}

function extractHeader(html, law) {
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0];
  if (header) return header;
  return `<header><h1>${htmlEscape(law.title)}</h1><p>${htmlEscape(law.legalReference || '')}</p></header>`;
}

function extractMainAttrs(html, law) {
  const attrs = html.match(/<main\b([^>]*)>/i)?.[1] || '';
  if (/\bdata-study-version=/.test(attrs)) return attrs;
  return `${attrs} data-study-version="B"`.trim();
}

function buildStudyHtml({ sourceHtml, law, scope, blocks }) {
  const title = `${law.title} — versión de estudio`;
  const header = extractHeader(sourceHtml, law);
  const mainAttrs = extractMainAttrs(sourceHtml, law);
  const note = `<section class="study-cut-notice" data-ref="Delimitación de estudio">
<h2>Versión de estudio</h2>
<p>Este archivo recorta la fuente original para mostrar solo los apartados marcados como estudiables en esta app.</p>
${scope.note ? `<p>${htmlEscape(scope.note)}</p>` : ''}
<p>La norma o fuente completa se conserva aparte para consulta.</p>
</section>`;
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>${htmlEscape(title)}</title></head>
<body>
  <main ${mainAttrs}>
${header}
${note}
${blocks.map(block => block.html).join('\n')}
  </main>
</body>
</html>
`;
}

const manifest = await readJson(manifestPath);
const scopes = await readJson(scopesPath);
const questions = await readJson(questionsPath);
const lawById = new Map(manifest.laws.map(law => [law.lawId, law]));
const activeAnchorsByLaw = new Map();
for (const question of questions) {
  const active = question.active === true || (question.active !== false && question.origin?.historical !== true);
  if (!active || !question.source?.lawId || !question.source?.anchorId) continue;
  const anchorIds = activeAnchorsByLaw.get(question.source.lawId) || new Set();
  anchorIds.add(question.source.anchorId);
  activeAnchorsByLaw.set(question.source.lawId, anchorIds);
}
const report = [];

const candidateLawIds = new Set([
  ...Object.entries(scopes.laws || {})
    .filter(([, scope]) => scope.mode === 'selected' && Array.isArray(scope.anchorIds) && scope.anchorIds.length)
    .map(([lawId]) => lawId),
  ...activeAnchorsByLaw.keys()
]);

for (const lawId of [...candidateLawIds].sort()) {
  const scope = scopes.laws?.[lawId];
  const explicitAnchorIds = scope?.mode === 'selected' && Array.isArray(scope.anchorIds) ? scope.anchorIds : [];
  const activeAnchorIds = [...(activeAnchorsByLaw.get(lawId) || [])];
  const anchorIds = [...new Set([...explicitAnchorIds, ...activeAnchorIds])];
  if (!anchorIds.length) continue;
  const law = lawById.get(lawId);
  if (!law) throw new Error(`No existe en el manifiesto: ${lawId}`);
  const fullFile = law.fullFile || law.file;
  const sourceHtml = await readFile(join(lawsDir, fullFile), 'utf8');
  const { blocks, missing } = chooseBlocksForAnchors(sourceHtml, anchorIds);
  if (missing.length) throw new Error(`${lawId}: anclas no encontradas: ${missing.join(', ')}`);
  if (!blocks.length) throw new Error(`${lawId}: no se pudo construir ningún bloque de estudio`);
  const targetFile = studyFileName(fullFile);
  const effectiveScope = scope || {
    note: 'Recorte generado a partir de las anclas de preguntas activas del banco de estudio.'
  };
  await writeFile(join(lawsDir, targetFile), buildStudyHtml({ sourceHtml, law, scope: effectiveScope, blocks }), 'utf8');
  law.fullFile = fullFile;
  law.studyFile = targetFile;
  law.studyScope = explicitAnchorIds.length ? 'selected' : 'active-question-anchors';
  report.push({ lawId, fullFile, studyFile: targetFile, anchors: anchorIds.length, blocks: blocks.length });
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.table(report);
console.log(`Generadas ${report.length} versiones -B de estudio.`);
