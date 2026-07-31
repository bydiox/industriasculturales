import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = JSON.parse(await readFile(join(root, 'data/sources/cncp-technical.json'), 'utf8'));
const html = await readFile(join(root, 'data/sources/cncp-technical.html'), 'utf8');
const fail = message => { console.error(`ERROR: ${message}`); process.exitCode = 1; };
const ids = [...html.matchAll(/(?:id|data-anchor-id)="([^"]+)"/g)].map(match => match[1]);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) fail('Hay anclas duplicadas en cncp-technical.html');
const seenSourceIds = new Set();
for (const source of manifest.sources || []) {
  if (!source.sourceId || seenSourceIds.has(source.sourceId)) fail(`sourceId duplicado o vacío: ${source.sourceId || '(vacío)'}`);
  seenSourceIds.add(source.sourceId);
  if (!source.reference || !source.officialUrl || !source.topics?.length || !source.anchors?.length) fail(`Fuente CNCP incompleta: ${source.sourceId}`);
  for (const anchor of source.anchors || []) if (!uniqueIds.has(anchor)) fail(`Ancla CNCP inexistente: ${anchor} (${source.sourceId})`);
}
if (!manifest.editorialNote.includes('No son legislación')) fail('Falta la advertencia de carácter no normativo');
if (!process.exitCode) console.log(`Bibliografía CNCP válida: ${manifest.sources.length} fuentes y ${uniqueIds.size} anclas.`);
