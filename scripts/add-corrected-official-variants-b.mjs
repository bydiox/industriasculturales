import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifest = JSON.parse(await readFile(join(root, 'data/laws/laws-manifest.json'), 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const byId = new Map(questions.map(question => [question.id, question]));

const legal = (lawId, anchorId, reference) => {
  const law = lawMap.get(lawId);
  if (!law) throw new Error(`Ley no importada: ${lawId}`);
  return { lawId, anchorId, reference, url: law.officialUrl };
};

const corrected = [
  {
    baseId: 'm1-cultura-comun-2023-02',
    correctOptionId: 'B',
    fourth: 'En el Título III.',
    source: legal('ce-1978', 'ce-1978-a11', 'Constitución Española, artículo 11'),
    note: 'La nacionalidad se regula en el Título I; la clave importada del JSON señalaba otra opción.'
  },
  {
    baseId: 'm1-cultura-comun-2023-03',
    correctOptionId: 'A',
    fourth: 'El derecho a la protección de la salud.',
    source: legal('ce-1978', 'ce-1978-a20', 'Constitución Española, artículo 20.1.b'),
    note: 'La producción y creación científica forma parte del artículo 20, dentro de la Sección 1.ª.'
  },
  {
    baseId: 'm1-cultura-comun-2023-04',
    correctOptionId: 'B',
    fourth: 'Los colegios profesionales.',
    source: legal('ce-1978', 'ce-1978-a7', 'Constitución Española, artículo 7'),
    note: 'El artículo 7 CE cita sindicatos de trabajadores y asociaciones empresariales.'
  },
  {
    baseId: 'm1-cultura-comun-2023-06',
    correctOptionId: 'B',
    fourth: 'Precisarán declaración responsable posterior ante la autoridad.',
    source: legal('ce-1978', 'ce-1978-a21', 'Constitución Española, artículo 21.2'),
    note: 'Las reuniones en lugares de tránsito público y manifestaciones requieren comunicación previa, no autorización previa.'
  }
];

const variants = [];

for (const item of corrected) {
  const base = byId.get(item.baseId);
  if (!base) throw new Error(`No existe la pregunta base: ${item.baseId}`);
  if (byId.has(`${item.baseId}-B`)) continue;
  const law = lawMap.get(item.source.lawId);
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  if (!html.includes(`id="${item.source.anchorId}"`) && !html.includes(`data-anchor-id="${item.source.anchorId}"`)) {
    throw new Error(`Ancla inexistente: ${item.source.lawId}#${item.source.anchorId}`);
  }
  const optionTexts = new Set(base.options.map(option => option.text.trim().toLowerCase()));
  if (optionTexts.has(item.fourth.trim().toLowerCase())) throw new Error(`Cuarto distractor duplicado en ${item.baseId}`);
  variants.push({
    ...base,
    id: `${item.baseId}-B`,
    options: [...base.options, { id: 'D', text: item.fourth }],
    correctOptionId: item.correctOptionId,
    optionCount: 4,
    source: item.source,
    origin: {
      type: 'own_variant',
      variantOf: item.baseId,
      label: `Variante propia B corregida de ${item.baseId}`,
      basedOn: base.origin?.label || 'Pregunta oficial histórica',
      historical: false
    },
    explanation: `${item.note} Fuente de estudio: ${item.source.reference}.`,
    active: true,
    variantPolicy: {
      createdAt: '2026-08-01',
      rule: 'Variante propia corregida desde pregunta oficial con clave importada sospechosa; el original histórico no se modifica.'
    }
  });
}

questions.push(...variants);
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Creadas ${variants.length} variantes B corregidas.`);
