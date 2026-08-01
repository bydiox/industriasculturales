import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const jobs = [
  {
    lawId: 'ley-9-2017-lcsp',
    htmlFile: 'data/laws/ley-9-2017-lcsp.html',
    xmlFile: 'data/imports/official-xml/BOE-A-2017-12902-lcsp.xml',
    articles: ['26', '27', '34', '36', '101', '103', '120', '198', '208', '236']
  },
  {
    lawId: 'rdleg-2-2015-et',
    htmlFile: 'data/laws/rdleg-2-2015-et.html',
    xmlFile: 'data/imports/official-xml/BOE-A-2015-11430-et.xml',
    articles: ['50', '69']
  }
];

const decodeEntities = value => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'");

const cleanText = value => decodeEntities(value)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/\r/g, '')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n\s+/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const escapeHtml = value => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function extractArticles(xml) {
  const matches = [...xml.matchAll(/<p[^>]*class="articulo"[^>]*>[\s\S]*?<\/p>/g)];
  const articles = new Map();
  for (let index = 0; index < matches.length; index += 1) {
    const headerRaw = matches[index][0];
    const header = cleanText(headerRaw);
    const articleMatch = header.match(/^Artículo\s+(\d+)(?:\s+bis)?\./i);
    if (!articleMatch) continue;
    const number = articleMatch[1];
    const start = matches[index].index;
    const end = index + 1 < matches.length ? matches[index + 1].index : xml.length;
    const block = xml.slice(start, end);
    const paragraphs = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
      .map(match => cleanText(match[1]))
      .filter(Boolean);
    articles.set(number, { title: header, paragraphs });
  }
  return articles;
}

const report = {
  generatedAt: '2026-08-01',
  source: 'BOE XML oficial guardado en data/imports/official-xml',
  inserted: [],
  skippedExisting: [],
  missingInXml: []
};

for (const job of jobs) {
  let html = await readFile(join(root, job.htmlFile), 'utf8');
  const xml = await readFile(join(root, job.xmlFile), 'utf8');
  const articles = extractArticles(xml);
  const sections = [];

  for (const article of job.articles) {
    const anchorId = `${job.lawId}-a${article}`;
    if (html.includes(`id="${anchorId}"`) || html.includes(`data-anchor-id="${anchorId}"`)) {
      report.skippedExisting.push({ lawId: job.lawId, article, anchorId });
      continue;
    }
    const extracted = articles.get(article);
    if (!extracted) {
      report.missingInXml.push({ lawId: job.lawId, article, anchorId });
      continue;
    }
    const [title, ...body] = extracted.paragraphs;
    const paragraphs = body.length ? body : extracted.paragraphs.slice(1);
    const content = paragraphs
      .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');
    sections.push(`<section id="${anchorId}" data-anchor-id="${anchorId}" data-ref="Artículo ${article}"><h2>${escapeHtml(title || extracted.title)}</h2>${content}</section>`);
    report.inserted.push({ lawId: job.lawId, article, anchorId });
  }

  if (sections.length) {
    html = html.replace('</article></body></html>', `${sections.join('')}</article></body></html>`);
    await writeFile(join(root, job.htmlFile), html, 'utf8');
  }
}

await writeFile(join(root, 'data/boe-article-extension-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Artículos BOE insertados: ${report.inserted.length}`);
console.log(`Ya existentes: ${report.skippedExisting.length}`);
console.log(`No encontrados en XML: ${report.missingInXml.length}`);
