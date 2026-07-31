import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const readJson = (file) => readFile(join(root, file), 'utf8').then(JSON.parse);
const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};

const [mapping, syllabus, html] = await Promise.all([
  readJson('data/sources/inaem-m1-2022-mapping.json'),
  readJson('data/syllabus.json'),
  readFile(join(root, 'data/sources/inaem-m1-2022.html'), 'utf8')
]);

if (mapping.sourceId !== 'inaem-m1-2022') fail('sourceId inesperado en el mapa INAEM M1.');
if (mapping.kind !== 'referencia') fail('El mapa INAEM M1 debe conservar kind=referencia.');
if (!mapping.officialUrl?.includes('BOE-A-2022-23830')) fail('Falta la URL oficial BOE-A-2022-23830.');
if (!mapping.file?.endsWith('inaem-m1-2022.html')) fail('El mapa no apunta al HTML importado.');

const topicIds = new Set((syllabus.topics || []).map((topic) => topic.id));
const anchors = [...html.matchAll(/(?:\sid|data-anchor-id)="([^"]+)"/g)].map((match) => match[1]);
const anchorSet = new Set(anchors);
if (anchorSet.size !== anchors.length) fail('Hay anclas duplicadas en inaem-m1-2022.html.');

let entries = 0;
for (const [topicId, links] of Object.entries(mapping.byTopic || {})) {
  if (!topicIds.has(topicId)) fail(`topicId inexistente en el mapa INAEM M1: ${topicId}`);
  const seen = new Set();
  for (const link of links || []) {
    entries += 1;
    if (!link.anchorId || !anchorSet.has(link.anchorId)) fail(`Ancla INAEM inexistente: ${link.anchorId || '(vacía)'}`);
    if (seen.has(link.anchorId)) fail(`Ancla repetida dentro de ${topicId}: ${link.anchorId}`);
    seen.add(link.anchorId);
    if (!['exacta', 'fuerte', 'parcial'].includes(link.match)) fail(`Grado de correspondencia no reconocido: ${link.match}`);
    if (!link.especialidad || !Number.isInteger(link.tema) || !link.titulo?.trim()) fail(`Entrada incompleta en ${topicId}: ${link.anchorId}`);
  }
}

if (!process.exitCode) console.log(`Referencia INAEM M1 válida: ${Object.keys(mapping.byTopic || {}).length} temas M3, ${entries} correspondencias y ${anchors.length} anclas.`);
