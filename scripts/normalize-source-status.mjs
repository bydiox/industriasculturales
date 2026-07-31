import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, 'data/laws/laws-manifest.json');
const questionsPath = join(root, 'data/questions.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const byId = new Map(manifest.laws.map(law => [law.lawId, law]));
const historicalOcne = byId.get('rd-2084-1978-ocne');
if (historicalOcne) {
  historicalOcne.active = false;
  historicalOcne.historical = true;
  historicalOcne.status = 'historical-reference-not-for-active-exams';
  historicalOcne.note = 'Norma histórica de la OCNE, desplazada por la creación del INAEM y sustituida para el estudio vigente por el Real Decreto 1245/2002.';
}

for (const lawId of ['cultura-magalia-2025', 'cultura-inaem-centros-2026']) {
  const law = byId.get(lawId);
  if (!law) continue;
  law.entryType = 'institutional';
  law.sourceType = 'institutional-context';
  law.legalStatus = 'not-normative';
  law.anchorPolicy = 'document-section';
  law.note = 'Fuente institucional informativa; no contiene articulado y no debe usarse como sustituto de una norma jurídica.';
}

const amendingInaem = byId.get('rd-1028-2025');
if (amendingInaem) {
  amendingInaem.entryType = 'amending-norm';
  amendingInaem.scope = 'reforma-organizativa-2025';
  amendingInaem.note = 'Norma modificativa: sus cambios se leen junto con los textos consolidados que modifica.';
}

const treatyUrls = {
  'eu-teu-2012': 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A12016M%2FTXT',
  'eu-tfeu-2012': 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A12016E%2FTXT'
};
for (const [lawId, url] of Object.entries(treatyUrls)) {
  const law = byId.get(lawId);
  if (!law) continue;
  law.officialUrl = url;
  law.versionDate = '20160607';
  law.legalReference = `${law.legalReference.split(' versión consolidada')[0]} versión consolidada publicada en el DOUE C 202 de 7 de junio de 2016.`;
}

for (const question of questions) {
  const lawId = question.source?.lawId;
  if (lawId === 'rd-2084-1978-ocne') {
    question.origin = {
      type: 'historical_source',
      label: 'Norma histórica de la OCNE · no vigente para el estudio actual',
      historical: true,
      syllabusWarning: 'Se conserva solo para contexto histórico. Para la organización vigente debe estudiarse el INAEM y el Real Decreto 1245/2002.'
    };
  }
  if (lawId === 'cultura-magalia-2025' || lawId === 'cultura-inaem-centros-2026') {
    question.source.kind = 'institutional';
    question.source.reference = `${question.source.reference} (fuente institucional informativa, no precepto legal)`;
  }
  if (lawId === 'rd-1028-2025') question.source.kind = 'amending-norm';
  if (lawId === 'res-jonde-2023-becas' && ['m3-centro-033', 'm3-centro-034'].includes(question.id)) {
    question.source.kind = 'contextual';
    question.source.note = 'Fuente contextual sobre becas; no debe desplazar las preguntas nucleares sobre misión, organización y modelo de gestión de la JONDE.';
    if (question.origin?.type === 'contextual_source') delete question.origin;
  }
  if (lawId === 'eu-teu-2012' || lawId === 'eu-tfeu-2012') {
    question.source.url = treatyUrls[lawId];
    question.source.version = 'DOUE C 202 de 7 de junio de 2016';
  }
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log('Estados de fuentes normalizados.');
