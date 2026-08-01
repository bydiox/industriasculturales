import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const inputPath = join(root, 'data/imports/reference-gap-questions-2026-08-01/preguntas-referencia-temas-pendientes.json');
const questionsPath = join(root, 'data/questions.json');
const reportPath = join(root, 'data/imports/reference-gap-questions-2026-08-01/import-report.json');

const sourceCatalog = {
  'cdaem-danza-patrimonio': {
    file: 'sources/fuente-cdaem-danza.html',
    author: 'Centro de Documentación de las Artes Escénicas y de la Música (CDAEM)',
    edition: 'fuente institucional consultada el 1 de agosto de 2026',
    url: 'https://www.musicadanza.es/'
  },
  'anuario-cultura-2024': {
    file: 'sources/fuente-anuario-estadisticas-2024.html',
    author: 'Ministerio de Cultura · División de Estadística y Estudios',
    edition: 'Anuario de Estadísticas Culturales 2024',
    url: 'https://www.cultura.gob.es/servicios-al-ciudadano/estadisticas/cultura/mc/aec.html'
  },
  'femp-indicadores-politicas-culturales': {
    file: 'sources/fuente-femp-indicadores.html',
    author: 'Federación Española de Municipios y Provincias · Ministerio de Cultura',
    edition: 'Sistema de indicadores para la evaluación de las políticas culturales locales',
    url: 'https://www.cultura.gob.es/dam/jcr:d7da8b7a-94a9-4766-ab97-599a2df576b8/evaluacion-politicas-locales-cor.pdf'
  },
  'plan-derechos-culturales-2025': {
    file: 'sources/fuente-plan-derechos-culturales.html',
    author: 'Ministerio de Cultura',
    edition: 'Plan de Derechos Culturales 2025',
    url: 'https://planderechosculturales.cultura.gob.es/'
  },
  'componente-24': {
    file: 'sources/fuente-componente-24.html',
    author: 'Gobierno de España · Plan de Recuperación, Transformación y Resiliencia',
    edition: 'Componente 24: Revalorización de la industria cultural',
    url: 'https://planderecuperacion.gob.es/politicas-y-componentes/componente-24-revalorizacion-de-la-industria-cultural'
  },
  'inaem-m1-2022': {
    file: 'sources/inaem-m1-2022.html',
    author: 'Instituto Nacional de las Artes Escénicas y de la Música',
    edition: 'Temarios técnicos INAEM M1 2022',
    url: 'https://www.cultura.gob.es/cultura/artesescenicas.html'
  }
};

const input = JSON.parse(await readFile(inputPath, 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const byId = new Map(questions.map((question, index) => [question.id, index]));
const report = { importedAt: '2026-08-01', added: [], updated: [], errors: [] };

const fail = message => {
  report.errors.push(message);
};

for (const item of input) {
  const catalog = sourceCatalog[item.source?.sourceId];
  if (!catalog) {
    fail(`Fuente no catalogada en ${item.id}: ${item.source?.sourceId || 'sin sourceId'}`);
    continue;
  }
  const sourceFile = join(root, 'data', catalog.file);
  if (!existsSync(sourceFile)) {
    fail(`No existe el HTML de fuente de ${item.id}: ${catalog.file}`);
    continue;
  }
  const sourceHtml = await readFile(sourceFile, 'utf8');
  if (!new RegExp(`(?:id|data-anchor-id)=["']${item.source.anchorId}["']`).test(sourceHtml)) {
    fail(`Ancla inexistente en ${item.id}: ${item.source.anchorId} (${catalog.file})`);
    continue;
  }
  if (item.options?.length !== 4) {
    fail(`Pregunta con formato no vigente en ${item.id}: ${item.options?.length || 0} opciones`);
    continue;
  }
  if (!item.options.some(option => option.id === item.correctOptionId)) {
    fail(`Respuesta correcta inexistente en ${item.id}: ${item.correctOptionId}`);
    continue;
  }

  const normalized = {
    ...item,
    active: true,
    optionCount: 4,
    editorialStatus: 'active-reference',
    createdAt: item.createdAt || '2026-08-01',
    origin: {
      type: 'reference',
      label: 'M3 · paquete de preguntas de referencia · 2026-08-01',
      historical: false,
      elaboracion: item.origin?.elaboracion || 'Elaborada a partir de fuente institucional con ancla verificada'
    },
    source: {
      kind: 'referencia',
      sourceId: item.source.sourceId,
      file: catalog.file,
      anchorId: item.source.anchorId,
      reference: item.source.reference,
      author: catalog.author,
      edition: catalog.edition,
      locator: item.source.reference,
      url: catalog.url
    }
  };

  const existingIndex = byId.get(normalized.id);
  if (existingIndex === undefined) {
    questions.push(normalized);
    byId.set(normalized.id, questions.length - 1);
    report.added.push(normalized.id);
  } else {
    questions[existingIndex] = { ...questions[existingIndex], ...normalized };
    report.updated.push(normalized.id);
  }
}

if (report.errors.length) {
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.error(report.errors.join('\n'));
  process.exit(1);
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Preguntas de referencia importadas: ${report.added.length}; actualizadas: ${report.updated.length}.`);
