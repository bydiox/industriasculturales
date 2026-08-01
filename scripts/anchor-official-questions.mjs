import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));

const source = (lawId, anchorId, reference) => {
  const law = lawMap.get(lawId);
  if (!law) throw new Error(`Ley no importada: ${lawId}`);
  return { lawId, anchorId, reference, url: law.officialUrl };
};

const anchors = {
  // M3 Igualdad 2023: parte común anclable.
  'm3-oficial-igualdad-2023-05': source('ce-1978', 'ce-1978-a9', 'Constitución Española, artículo 9.2'),
  'm3-oficial-igualdad-2023-06': source('ce-1978', 'ce-1978-a62', 'Constitución Española, artículo 62.j'),
  'm3-oficial-igualdad-2023-07': source('ce-1978', 'ce-1978-a59', 'Constitución Española, artículo 59.2'),
  'm3-oficial-igualdad-2023-08': source('ce-1978', 'ce-1978-a75', 'Constitución Española, artículo 75.2 y 75.3'),
  'm3-oficial-igualdad-2023-09': source('ce-1978', 'ce-1978-a97', 'Constitución Española, artículo 97'),
  'm3-oficial-igualdad-2023-10': source('ce-1978', 'ce-1978-a108', 'Constitución Española, artículo 108'),
  'm3-oficial-igualdad-2023-11': source('ce-1978', 'ce-1978-a141', 'Constitución Española, artículo 141.1'),
  'm3-oficial-igualdad-2023-17': source('ley-39-2015', 'ley-39-2015-a47', 'Ley 39/2015, artículo 47.1'),
  'm3-oficial-igualdad-2023-20': source('rdleg-5-2015', 'rdleg-5-2015-a14', 'TREBEP, artículo 14.g'),
  'm3-oficial-igualdad-2023-21': source('rd-364-1995', 'rd-364-1995-a9', 'Real Decreto 364/1995, artículo 9.1'),
  'm3-oficial-igualdad-2023-22': source('rdleg-5-2015', 'rdleg-5-2015-a59', 'TREBEP, artículo 59.1'),
  'm3-oficial-igualdad-2023-23': source('convenio-iv', 'convenio-iv-a1-8', 'IV Convenio único AGE, artículo 16.2'),
  'm3-oficial-igualdad-2023-24': source('rdleg-5-2015', 'rdleg-5-2015-a55', 'TREBEP, artículo 55.1'),
  'm3-oficial-igualdad-2023-34': source('ce-1978', 'ce-1978-a16', 'Constitución Española, artículo 16.1'),
  'm3-oficial-igualdad-2023-35': source('ce-1978', 'ce-1978-a1', 'Constitución Española, artículo 1.1'),
  'm3-oficial-igualdad-2023-71': source('ce-1978', 'ce-1978-a59', 'Constitución Española, artículo 59.5'),
  'm3-oficial-igualdad-2023-72': source('ce-1978', 'ce-1978-a68', 'Constitución Española, artículo 68.2'),
  'm3-oficial-igualdad-2023-73': source('ce-1978', 'ce-1978-a82', 'Constitución Española, artículo 82.2'),
  'm3-oficial-igualdad-2023-01': source('lo-3-2007', 'lo-3-2007-a51', 'Ley Orgánica 3/2007, artículo 51.b'),
  'm3-oficial-igualdad-2023-27': source('ce-1978', 'ce-1978-a134', 'Constitución Española, artículo 134.1'),
  'm3-oficial-igualdad-2023-28': source('ce-1978', 'ce-1978-a134', 'Constitución Española, artículo 134.3'),
  'm3-oficial-igualdad-2023-29': source('ley-31-1995', 'ley-31-1995-a36', 'Ley 31/1995, artículo 36.2.f'),
  'm3-oficial-igualdad-2023-30': source('lo-3-2007', 'lo-3-2007-a46', 'Ley Orgánica 3/2007, artículo 46.1'),

  // M3 Cultura 2023: parte común y bloques jurídicos específicos.
  'm3-cultura-comun-2023-01': source('ley-39-2015', 'ley-39-2015-a129', 'Ley 39/2015, artículo 129.1'),
  'm3-cultura-comun-2023-02': source('ley-39-2015', 'ley-39-2015-a115', 'Ley 39/2015, artículo 115.1.d'),
  'm3-cultura-comun-2023-03': source('ley-39-2015', 'ley-39-2015-a47', 'Ley 39/2015, artículo 47.1.c'),
  'm3-cultura-comun-2023-04': source('ley-9-2017-lcsp', 'ley-9-2017-lcsp-a25', 'Ley 9/2017, artículo 25.1.a.1.º'),
  'm3-cultura-comun-2023-07': source('ley-39-2015', 'ley-39-2015-a132', 'Ley 39/2015, artículo 132.1'),
  'm3-cultura-comun-2023-08': source('ley-40-2015', 'ley-40-2015-a141', 'Ley 40/2015, artículo 141.1.c'),
  'm3-cultura-comun-2023-09': source('ley-39-2015', 'ley-39-2015-a30', 'Ley 39/2015, artículo 30.2 y 30.6'),
  'm3-cultura-comun-2023-11': source('rdleg-5-2015', 'rdleg-5-2015-a12', 'TREBEP, artículo 12'),
  'm3-cultura-comun-2023-12': source('convenio-iv', 'convenio-iv-a4-2', 'IV Convenio único AGE, artículo 40.1.c'),
  'm3-cultura-comun-2023-13': source('convenio-iv', 'convenio-iv-a3-4', 'IV Convenio único AGE, artículo 32.3'),
  'm3-cultura-comun-2023-14': source('convenio-iv', 'convenio-iv-a1-16', 'IV Convenio único AGE, artículo 120.2'),
  'm3-cultura-comun-2023-16': source('ce-1978', 'ce-1978-a1', 'Constitución Española, artículo 1.3'),
  'm3-cultura-comun-2023-17': source('ce-1978', 'ce-1978-a28', 'Constitución Española, artículo 28.2'),
  'm3-cultura-comun-2023-18': source('convenio-iv', 'convenio-iv-a3-4', 'IV Convenio único AGE, artículo 32.1'),
  'm3-cultura-comun-2023-19': source('ce-1978', 'ce-1978-a71', 'Constitución Española, artículo 71.1'),
  'm3-cultura-comun-2023-20': source('ce-1978', 'ce-1978-a56', 'Constitución Española, artículo 56.3'),
  'm3-cultura-comun-2023-21': source('ce-1978', 'ce-1978-a62', 'Constitución Española, artículo 62.c'),
  'm3-cultura-comun-2023-22': source('ce-1978', 'ce-1978-a58', 'Constitución Española, artículo 58'),
  'm3-cultura-comun-2023-24': source('ce-1978', 'ce-1978-a72', 'Constitución Española, artículo 72.1'),
  'm3-cultura-comun-2023-25': source('ce-1978', 'ce-1978-a134', 'Constitución Española, artículo 134.1'),
  'm3-cultura-comun-2023-26': source('ley-47-2003', 'ley-47-2003-a73', 'Ley 47/2003, artículo 73.2'),
  'm3-cultura-comun-2023-27': source('ce-1978', 'ce-1978-a135', 'Constitución Española, artículo 135.3'),
  'm3-cultura-comun-2023-28': source('ley-47-2003', 'ley-47-2003-a140', 'Ley 47/2003, artículo 140.2'),
  'm3-cultura-comun-2023-29': source('ley-31-1995', 'ley-31-1995-a1', 'Ley 31/1995, artículo 1'),
  'm3-cultura-comun-2023-32': source('ce-1978', 'ce-1978-a1', 'Constitución Española, artículo 1.1'),
  'm3-cultura-comun-2023-33': source('ce-1978', 'ce-1978-a134', 'Constitución Española, artículo 134.6'),
  'm3-cultura-comun-2023-34': source('ce-1978', 'ce-1978-a149', 'Constitución Española, artículo 149.1.28.ª'),
  'm3-cultura-comun-2023-35': source('convenio-iv', 'convenio-iv-a3-4', 'IV Convenio único AGE, artículo 32.2'),
  'm3-cultura-comun-2023-r1': source('lo-3-2007', 'lo-3-2007-a51', 'Ley Orgánica 3/2007, artículo 51'),
  'm3-cultura-comun-2023-r2': source('ce-1978', 'ce-1978-a81', 'Constitución Española, artículo 81.2'),
  'm3-cultura-comun-2023-r3': source('eu-tfeu-2012', 'eu-tfeu-2012-a291', 'Tratado de Funcionamiento de la Unión Europea, artículo 291'),

  // M1 Cultura 2023: parte común reutilizable en M3 cuando la respuesta importada es fiable.
  'm1-cultura-comun-2023-01': source('ce-1978', 'ce-1978-df', 'Constitución Española, disposición final'),
  'm1-cultura-comun-2023-05': source('ce-1978', 'ce-1978-a54', 'Constitución Española, artículo 54'),
  'm1-cultura-comun-2023-07': source('rdleg-5-2015', 'rdleg-5-2015-a9', 'TREBEP, artículo 9.2'),
  'm1-cultura-comun-2023-08': source('rdleg-5-2015', 'rdleg-5-2015-a14', 'TREBEP, artículo 14'),
  'm1-cultura-comun-2023-09': source('rdleg-5-2015', 'rdleg-5-2015-a11', 'TREBEP, artículo 11.1'),
  'm1-cultura-comun-2023-10': source('lo-3-2007', 'lo-3-2007-a64', 'Ley Orgánica 3/2007, artículo 64'),
  'm1-cultura-comun-2023-11': source('lo-3-2007', 'lo-3-2007-a6', 'Ley Orgánica 3/2007, artículo 6.1'),
  'm1-cultura-comun-2023-18': source('ce-1978', 'ce-1978-a108', 'Constitución Española, artículo 108'),
  'm1-cultura-comun-2023-19': source('ce-1978', 'ce-1978-a113', 'Constitución Española, artículo 113.2'),
  'm1-cultura-comun-2023-20': source('ley-40-2015', 'ley-40-2015-a67', 'Ley 40/2015, artículo 67.2'),
  'm1-cultura-comun-2023-21': source('ley-50-1997', 'ley-50-1997-a2', 'Ley 50/1997, artículo 2.2.c'),
  'm1-cultura-comun-2023-22': source('ley-50-1997', 'ley-50-1997-a5', 'Ley 50/1997, artículo 5.1.f'),
  'm1-cultura-comun-2023-30': source('rdleg-1-2013', 'rdleg-1-2013-a42', 'Real Decreto Legislativo 1/2013, artículo 42.1'),

  // PRL importada desde cuestionarios M1, solo cuando la norma está en corpus.
  'm1-cultura-sonido-2023-92': source('rd-486-1997', 'rd-486-1997-aniv', 'Real Decreto 486/1997, anexo IV'),
  'm1-cultura-sonido-2023-94': source('ley-31-1995', 'ley-31-1995-a32bis', 'Ley 31/1995, artículo 32 bis'),
  'm1-cultura-realizacion-2023-89': source('rd-773-1997', 'rd-773-1997-a4', 'Real Decreto 773/1997, artículo 4'),
  'm1-cultura-iluminacion-2023-53': source('rd-1215-1997', 'rd-1215-1997-anii', 'Real Decreto 1215/1997, anexo II, apartado 1.6'),
  'm1-cultura-produccion-2023-51': source('rd-1435-1985', 'rd-1435-1985-a1', 'Real Decreto 1435/1985, artículo 1'),
  'm1-cultura-produccion-2023-56': source('ley-9-2017-lcsp', 'ley-9-2017-lcsp', 'Ley 9/2017, de 8 de noviembre'),
  'm1-cultura-produccion-2023-89': source('ley-31-1995', 'ley-31-1995-a1', 'Ley 31/1995, artículo 1'),
};

const restoreOfficialOnly = [
  // Preguntas revisadas durante el barrido: no conviene anclarlas a RD 1215/1997.
  // 90 trata de modelos de unidades de producción pública; 91 sería señalización (RD 485/1997),
  // norma que no está importada en el corpus.
  'm1-cultura-realizacion-2023-90',
  'm1-cultura-realizacion-2023-91'
];

const questionById = new Map(questions.map(question => [question.id, question]));
const missingQuestions = Object.keys(anchors).filter(id => !questionById.has(id));
if (missingQuestions.length) throw new Error(`Preguntas no encontradas: ${missingQuestions.join(', ')}`);

for (const [id, legalSource] of Object.entries(anchors)) {
  const question = questionById.get(id);
  const law = lawMap.get(legalSource.lawId);
  const html = await readFile(join(root, 'data/laws', law.file), 'utf8');
  if (!html.includes(`id="${legalSource.anchorId}"`) && !html.includes(`data-anchor-id="${legalSource.anchorId}"`)) {
    throw new Error(`Ancla inexistente para ${id}: ${legalSource.lawId}#${legalSource.anchorId}`);
  }
  if (question.source?.kind === 'official_exam') {
    question.officialSource = question.source;
  } else if (question.source && !question.officialSource) {
    question.previousSource = question.source;
  }
  question.source = legalSource;
  if (legalSource.lawId === 'rd-1435-1985') {
    question.temporalContext = 'vigente-hasta-2027-05-24';
  }
  question.sourceReview = {
    status: 'anchored-from-official-question',
    reviewedAt: '2026-08-01',
    note: 'La procedencia oficial se conserva en origin; source apunta a la norma para habilitar Ver ley y revisión jurídica.'
  };
}

for (const id of restoreOfficialOnly) {
  const question = questionById.get(id);
  if (!question) continue;
  if (question.officialSource) {
    question.source = question.officialSource;
    delete question.officialSource;
  }
  delete question.sourceReview;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Ancladas ${Object.keys(anchors).length} preguntas oficiales con fuente jurídica verificable.`);
if (restoreOfficialOnly.length) console.log(`Restauradas ${restoreOfficialOnly.length} preguntas a fuente oficial sin ancla jurídica.`);
