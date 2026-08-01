import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const optionIds = ['A', 'B', 'C', 'D'];

const catalogs = {
  anuario: {
    kind: 'referencia',
    sourceId: 'anuario-cultura-2024',
    file: 'sources/fuente-anuario-estadisticas-2024.html',
    author: 'Ministerio de Cultura · División de Estadística y Estudios',
    edition: 'Anuario de Estadísticas Culturales 2024',
    url: 'https://www.cultura.gob.es/servicios-al-ciudadano/estadisticas/cultura/mc/aec.html'
  },
  derechos: {
    kind: 'referencia',
    sourceId: 'plan-derechos-culturales-2025',
    file: 'sources/fuente-plan-derechos-culturales.html',
    author: 'Ministerio de Cultura',
    edition: 'Plan de Derechos Culturales 2025',
    url: 'https://planderechosculturales.cultura.gob.es/'
  },
  componente24: {
    kind: 'referencia',
    sourceId: 'componente-24',
    file: 'sources/fuente-componente-24.html',
    author: 'Gobierno de España · Plan de Recuperación, Transformación y Resiliencia',
    edition: 'Componente 24: Revalorización de la industria cultural',
    url: 'https://planderecuperacion.gob.es/politicas-y-componentes/componente-24-revalorizacion-de-la-industria-cultural'
  },
  femp: {
    kind: 'referencia',
    sourceId: 'femp-indicadores-politicas-culturales',
    file: 'sources/fuente-femp-indicadores.html',
    author: 'Federación Española de Municipios y Provincias · Ministerio de Cultura',
    edition: 'Sistema de indicadores para la evaluación de las políticas culturales locales',
    url: 'https://www.cultura.gob.es/dam/jcr:d7da8b7a-94a9-4766-ab97-599a2df576b8/evaluacion-politicas-locales-cor.pdf'
  },
  cnecp: {
    kind: 'bibliografia',
    file: 'sources/cncp-technical.html'
  },
  inaem: {
    kind: 'bibliografia',
    file: 'sources/inaem-m1-2022.html',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2022-23830'
  },
  insst: {
    kind: 'bibliografia',
    file: 'sources/m3-bibliography.html'
  }
};

const origin = {
  type: 'generated_reference',
  label: 'M3 · refuerzo pool5 por temas con margen cero · 2026-08-01',
  historical: false
};

const officialVariantPolicy = {
  createdAt: '2026-08-01',
  rule: 'Variante propia con cuatro opciones; la pregunta oficial original conserva su formato histórico.'
};

function stableShift(id) {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % optionIds.length;
}

function rotate(question) {
  const correctText = question.options.find(option => option.id === question.correctOptionId)?.text;
  const shift = stableShift(question.id);
  const rotated = question.options.slice(shift).concat(question.options.slice(0, shift));
  const options = rotated.map((option, index) => ({ ...option, id: optionIds[index] }));
  const correct = options.find(option => option.text === correctText);
  return {
    ...question,
    options,
    correctOptionId: correct.id,
    active: true,
    optionCount: 4,
    createdAt: '2026-08-01'
  };
}

function ref(key, anchorId, reference, extra = {}) {
  return { ...catalogs[key], anchorId, reference, locator: reference, ...extra };
}

function official(reference) {
  return { kind: 'official_exam', reference };
}

const items = [
  {
    id: 'm3-reinforce-20260801-006-01',
    topicId: 'especifico-06',
    prompt: '¿Qué autor fue conocido como el Fénix de los Ingenios?',
    options: [
      { id: 'A', text: 'Lope de Vega.' },
      { id: 'B', text: 'Calderón de la Barca.' },
      { id: 'C', text: 'Tirso de Molina.' },
      { id: 'D', text: 'Juan Ruiz de Alarcón.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial M1 identifica a Lope de Vega con el sobrenombre de Fénix de los Ingenios.',
    source: official('Cuestionario M1 Maquinaria Escénica para el Espectáculo en Vivo, turno libre, pregunta 35. Ministerio de Cultura y Deporte, 25/11/2023.'),
    origin: { type: 'own_variant', variantOf: 'm1-cultura-maquinaria-2023-35', label: 'Variante propia de refuerzo de m1-cultura-maquinaria-2023-35', basedOn: 'Pregunta oficial M1 Cultura 2023', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-reinforce-20260801-006-02',
    topicId: 'especifico-06',
    prompt: '¿Quién escribió El gran teatro del mundo?',
    options: [
      { id: 'A', text: 'Calderón de la Barca.' },
      { id: 'B', text: 'Lope de Vega.' },
      { id: 'C', text: 'Tirso de Molina.' },
      { id: 'D', text: 'Francisco de Rojas Zorrilla.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial M1 atribuye El gran teatro del mundo a Calderón de la Barca.',
    source: official('Cuestionario M1 Maquinaria Escénica para el Espectáculo en Vivo, turno libre, pregunta 36. Ministerio de Cultura y Deporte, 25/11/2023.'),
    origin: { type: 'own_variant', variantOf: 'm1-cultura-maquinaria-2023-36', label: 'Variante propia de refuerzo de m1-cultura-maquinaria-2023-36', basedOn: 'Pregunta oficial M1 Cultura 2023', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-reinforce-20260801-007-01',
    topicId: 'especifico-07',
    prompt: 'Según la pregunta oficial M3 2021, la tonadilla escénica supuso:',
    options: [
      { id: 'A', text: 'La supervivencia de un género lírico esencialmente español.' },
      { id: 'B', text: 'La llegada a España del modelo italiano de ópera seria.' },
      { id: 'C', text: 'El avance hacia formas contrapuntísticas de cámara.' },
      { id: 'D', text: 'La consolidación del lied romántico para voz y piano.' }
    ],
    correctOptionId: 'A',
    explanation: 'La plantilla oficial de 2021 da como correcta la supervivencia de un género lírico esencialmente español.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 61'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-061', label: 'Variante propia de refuerzo de m3-2021-oficial-061', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-reinforce-20260801-007-02',
    topicId: 'especifico-07',
    prompt: 'Marina, de Emilio Arrieta, se estrenó como zarzuela en 1855 y en 1871 se adaptó para representarse como:',
    options: [
      { id: 'A', text: 'Ópera.' },
      { id: 'B', text: 'Sainete.' },
      { id: 'C', text: 'Revista.' },
      { id: 'D', text: 'Tonadilla.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial M3 2021 indica que Marina fue modificada parcialmente en 1871 para revestir forma de ópera.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 62'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-062', label: 'Variante propia de refuerzo de m3-2021-oficial-062', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-reinforce-20260801-011-01',
    topicId: 'especifico-11',
    prompt: 'Según el Anuario 2024, la Estadística de Museos y Colecciones Museográficas se desarrolla con colaboración de:',
    options: [
      { id: 'A', text: 'Defensa, Patrimonio Nacional y comunidades y ciudades autónomas.' },
      { id: 'B', text: 'INAEM, ICAA, Dirección General del Libro y centros estatales.' },
      { id: 'C', text: 'FEMP, municipios, diputaciones provinciales y cabildos insulares.' },
      { id: 'D', text: 'Entidades de gestión, Registro de Fundaciones y asociaciones.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario cita la colaboración del Ministerio de Defensa, Patrimonio Nacional y las comunidades y ciudades autónomas.',
    source: ref('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-011-02',
    topicId: 'especifico-11',
    prompt: 'Según el Anuario 2024, en 2022 el número medio de visitas por museo abierto fue de:',
    options: [
      { id: 'A', text: '35.221.' },
      { id: 'B', text: '13.817.' },
      { id: 'C', text: '51.600.' },
      { id: 'D', text: '75.100.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario señala 35.221 visitas de media por museo abierto en 2022, frente a 13.817 en 2020.',
    source: ref('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-012-01',
    topicId: 'especifico-12',
    prompt: 'Según IMS437_3, ¿qué fases forman parte de la producción de espectáculos en vivo?',
    options: [
      { id: 'A', text: 'Preproducción, preparación, montaje, ensayos, representación, desmontaje y cierre.' },
      { id: 'B', text: 'Catalogación, conservación, restauración, préstamo, exposición y depósito.' },
      { id: 'C', text: 'Registro, reparto, recaudación, liquidación, distribución y archivo.' },
      { id: 'D', text: 'Diagnóstico, encuesta, segmentación, mediación, publicidad y venta.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS437_3 enumera esas fases como ciclo de producción de espectáculos en vivo y eventos.',
    source: ref('cnecp', 'cncp-ims437-3-contenidos', 'IMS437_3, Asistencia a la producción de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-012-02',
    topicId: 'especifico-12',
    prompt: 'Según IMS437_3, la documentación de producción incluye calendario, tareas, responsables, presupuesto y:',
    options: [
      { id: 'A', text: 'Necesidades técnicas y coordinación de equipos.' },
      { id: 'B', text: 'Derechos morales y entidades de gestión.' },
      { id: 'C', text: 'Legados, catálogos y fondos documentales.' },
      { id: 'D', text: 'Patronaje, medidas y pruebas de vestuario.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente menciona calendario, tareas, responsables, necesidades técnicas, presupuesto y coordinación de equipos.',
    source: ref('cnecp', 'cncp-ims437-3-contenidos', 'IMS437_3, Asistencia a la producción de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-013-01',
    topicId: 'especifico-13',
    prompt: 'Según el Componente 24, las fragilidades estructurales de las industrias culturales las hacen especialmente vulnerables en períodos de:',
    options: [
      { id: 'A', text: 'Crisis.' },
      { id: 'B', text: 'Expansión.' },
      { id: 'C', text: 'Normalidad.' },
      { id: 'D', text: 'Descentralización.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 vincula esas fragilidades con una vulnerabilidad especial en períodos de crisis.',
    source: ref('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  },
  {
    id: 'm3-reinforce-20260801-013-02',
    topicId: 'especifico-13',
    prompt: 'En el Sistema de Indicadores de la FEMP, una de las cuestiones marco de la Agenda 21 es:',
    options: [
      { id: 'A', text: 'Cultura y desarrollo social, económico y territorial.' },
      { id: 'B', text: 'Contratación artística y régimen sancionador.' },
      { id: 'C', text: 'Propiedad industrial y patentes culturales.' },
      { id: 'D', text: 'Archivo administrativo y firma electrónica.' }
    ],
    correctOptionId: 'A',
    explanation: 'La FEMP incluye cultura y desarrollo social, económico y territorial entre las cuestiones marco del sistema de indicadores.',
    source: ref('femp', 'femp-indicadores-politicas-culturales-p10', 'Párrafo 10')
  },
  {
    id: 'm3-reinforce-20260801-014-01',
    topicId: 'especifico-14',
    prompt: 'Según el Anuario 2024, la Estadística de Fundaciones ofrece resultados derivados de:',
    options: [
      { id: 'A', text: 'Las cuentas económicas entregadas anualmente por las fundaciones.' },
      { id: 'B', text: 'Las encuestas de hábitos culturales de la población joven.' },
      { id: 'C', text: 'Las liquidaciones de derechos de autor y derechos conexos.' },
      { id: 'D', text: 'Los catálogos de museos y colecciones museográficas.' }
    ],
    correctOptionId: 'A',
    explanation: 'La estadística ofrece indicadores económicos derivados de las cuentas económicas que las fundaciones entregan con periodicidad anual.',
    source: ref('anuario', 'anuario-cultura-2024-s20-fundaciones-sujetas-al-01', 'Fundaciones sujetas al Protectorado Estatal, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-014-02',
    topicId: 'especifico-14',
    prompt: 'En 2022, según el Anuario 2024, ¿qué porcentaje de fundaciones tratadas tenía Cultura como actividad o finalidad principal?',
    options: [
      { id: 'A', text: '26%.' },
      { id: 'B', text: '17,9%.' },
      { id: 'C', text: '15,8%.' },
      { id: 'D', text: '2,8%.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que el 26% de las fundaciones sujetas al Protectorado Estatal tratadas correspondía a Cultura.',
    source: ref('anuario', 'anuario-cultura-2024-s20-fundaciones-sujetas-al-01', 'Fundaciones sujetas al Protectorado Estatal, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-015-01',
    topicId: 'especifico-15',
    prompt: 'En el Plan de Derechos Culturales, la medida 4 incluye expresamente un plan impulsado por:',
    options: [
      { id: 'A', text: 'El INAEM.' },
      { id: 'B', text: 'El ICAA.' },
      { id: 'C', text: 'La BNE.' },
      { id: 'D', text: 'Patrimonio Nacional.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 4 menciona el Plan de Inclusión en las Artes Escénicas y la Música, impulsado por el INAEM.',
    source: ref('derechos', 'plan-derechos-culturales-2025-medida-004', 'Medida 4: Inclusión y no discriminación en instituciones culturales')
  },
  {
    id: 'm3-reinforce-20260801-015-02',
    topicId: 'especifico-15',
    prompt: 'Según el Plan de Derechos Culturales, los refugios climáticos se vinculan con:',
    options: [
      { id: 'A', text: 'La respuesta cultural ante la crisis climática.' },
      { id: 'B', text: 'La catalogación de bienes patrimoniales.' },
      { id: 'C', text: 'La recaudación de derechos de autor.' },
      { id: 'D', text: 'La formación de elencos artísticos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 85 presenta los refugios climáticos como apuesta estratégica ante la crisis climática actual.',
    source: ref('derechos', 'plan-derechos-culturales-2025-medida-085', 'Medida 85: Espacios culturales como refugios climáticos')
  },
  {
    id: 'm3-reinforce-20260801-018-01',
    topicId: 'especifico-18',
    prompt: 'Tras construir su Sistema de Indicadores, la FEMP señala como actuación pendiente:',
    options: [
      { id: 'A', text: 'Una prueba piloto en localizaciones tipo.' },
      { id: 'B', text: 'Una convocatoria estatal de subvenciones.' },
      { id: 'C', text: 'Un reglamento de propiedad intelectual.' },
      { id: 'D', text: 'Un registro de compañías escénicas.' }
    ],
    correctOptionId: 'A',
    explanation: 'La FEMP indica que queda por realizar una prueba piloto de implementación en localizaciones tipo.',
    source: ref('femp', 'femp-indicadores-politicas-culturales-p13', 'Párrafo 13')
  },
  {
    id: 'm3-reinforce-20260801-018-02',
    topicId: 'especifico-18',
    prompt: 'Según el Plan de Derechos Culturales, el balance social y comunitario permite medir:',
    options: [
      { id: 'A', text: 'El retorno social.' },
      { id: 'B', text: 'El aforo máximo.' },
      { id: 'C', text: 'La vida útil técnica.' },
      { id: 'D', text: 'La plantilla orgánica.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 15 señala que el balance social y comunitario sirve para valorar bien común, cohesión social y retorno social.',
    source: ref('derechos', 'plan-derechos-culturales-2025-medida-015', 'Medida 15: Estudio sobre la aplicación del balance social y comunitario')
  },
  {
    id: 'm3-reinforce-20260801-020-01',
    topicId: 'especifico-20',
    prompt: 'Según la introducción del Anuario 2024, la publicación incorpora información de:',
    options: [
      { id: 'A', text: 'Más de una veintena de fuentes estadísticas.' },
      { id: 'B', text: 'Una única encuesta anual de hogares.' },
      { id: 'C', text: 'Registros de entidades culturales privadas.' },
      { id: 'D', text: 'Datos presupuestarios de organismos públicos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La introducción explica que el Anuario integra información de más de una veintena de fuentes estadísticas.',
    source: ref('anuario', 'anuario-cultura-2024-s00-introducci-n-y-notas-metodol-g-01', 'Introducción y notas metodológicas, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-020-02',
    topicId: 'especifico-20',
    prompt: 'Según el Anuario 2024, la Cuenta Satélite de la Cultura tiene como objetivo estimar:',
    options: [
      { id: 'A', text: 'El impacto de la cultura sobre la economía española.' },
      { id: 'B', text: 'La asistencia diaria a todos los espacios escénicos.' },
      { id: 'C', text: 'La duración media de las giras teatrales.' },
      { id: 'D', text: 'El número de contratos artísticos temporales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La Cuenta Satélite proporciona información económica para estimar el impacto de la cultura en el conjunto de la economía española.',
    source: ref('anuario', 'anuario-cultura-2024-s18-cuenta-01', 'Cuenta Satélite de la Cultura, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-026-01',
    topicId: 'especifico-26',
    prompt: 'En la C24.R1, la adecuación del marco jurídico, fiscal y laboral busca mejorar:',
    options: [
      { id: 'A', text: 'La protección social de los agentes del sector cultural.' },
      { id: 'B', text: 'La inscripción de bienes inmuebles como BIC.' },
      { id: 'C', text: 'La conservación preventiva de colecciones.' },
      { id: 'D', text: 'La certificación técnica de maquinaria.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 vincula la C24.R1 con mejorar la protección social de los agentes del sector y aumentar la inversión privada.',
    source: ref('componente24', 'componente-24-sec-3', 'Detalle sobre cada reforma/inversión del componente')
  },
  {
    id: 'm3-reinforce-20260801-026-02',
    topicId: 'especifico-26',
    prompt: 'Según el Componente 24, el colectivo objetivo de la C24.R1 incluye trabajadores del sector cultural y:',
    options: [
      { id: 'A', text: 'Empresas y personas físicas.' },
      { id: 'B', text: 'Museos y bibliotecas estatales.' },
      { id: 'C', text: 'Comunidades autónomas y diputaciones.' },
      { id: 'D', text: 'Entidades de gestión colectiva.' }
    ],
    correctOptionId: 'A',
    explanation: 'La C24.R1 identifica como colectivo objetivo a trabajadores del sector cultural y a empresas y personas físicas.',
    source: ref('componente24', 'componente-24-sec-3', 'Detalle sobre cada reforma/inversión del componente')
  },
  {
    id: 'm3-reinforce-20260801-028-01',
    topicId: 'especifico-28',
    prompt: 'Según el Componente 24, la C24.R2 incluye culminar la transposición de directivas europeas sobre:',
    options: [
      { id: 'A', text: 'Derechos de autor en el Mercado Único Digital.' },
      { id: 'B', text: 'Contratación pública de espectáculos en vivo.' },
      { id: 'C', text: 'Fundaciones y asociaciones culturales.' },
      { id: 'D', text: 'Patrimonio histórico y archivos estatales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La reforma C24.R2 menciona la transposición de las Directivas 2019/789 y 2019/790 sobre derechos de autor en el Mercado Único Digital.',
    source: ref('componente24', 'componente-24-sec-3', 'Detalle sobre cada reforma/inversión del componente')
  },
  {
    id: 'm3-reinforce-20260801-028-02',
    topicId: 'especifico-28',
    prompt: 'Según el Anuario 2024, en 2023 la recaudación total de las entidades de gestión de derechos de propiedad intelectual fue:',
    options: [
      { id: 'A', text: '537,8 millones de euros.' },
      { id: 'B', text: '277,6 millones de euros.' },
      { id: 'C', text: '71,4 millones de euros.' },
      { id: 'D', text: '17,1 millones de euros.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario cifra en 537,8 millones de euros la recaudación total de las entidades de gestión en 2023.',
    source: ref('anuario', 'anuario-cultura-2024-s05-propiedad-01', 'Propiedad intelectual, párrafo 1')
  },
  {
    id: 'm3-reinforce-20260801-029-01',
    topicId: 'especifico-29',
    prompt: 'Según ART523_3, la construcción de decorados parte de interpretar diseños y:',
    options: [
      { id: 'A', text: 'Planos.' },
      { id: 'B', text: 'Partituras.' },
      { id: 'C', text: 'Figurines.' },
      { id: 'D', text: 'Convocatorias.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART523_3 se refiere a interpretar diseños y planos para construir, montar y adaptar decorados.',
    source: ref('cnecp', 'cncp-art523-3-contenidos', 'ART523_3, Construcción de decorados para la escena', { url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634' })
  },
  {
    id: 'm3-reinforce-20260801-029-02',
    topicId: 'especifico-29',
    prompt: 'Según ART524_3, un practicable se integra en el ámbito de:',
    options: [
      { id: 'A', text: 'La maquinaria escénica.' },
      { id: 'B', text: 'La gestión de públicos.' },
      { id: 'C', text: 'La propiedad intelectual.' },
      { id: 'D', text: 'La mediación cultural.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART524_3 enumera los practicables entre elementos y estructuras de la maquinaria escénica.',
    source: ref('cnecp', 'cncp-art524-3-contenidos', 'ART524_3, Maquinaria escénica para el espectáculo en vivo', { url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634' })
  },
  {
    id: 'm3-reinforce-20260801-032-01',
    topicId: 'especifico-32',
    prompt: 'Según ART524_3, el ciclo de trabajo de los elementos escénicos incluye montaje, desmontaje, almacenamiento y:',
    options: [
      { id: 'A', text: 'Mantenimiento.' },
      { id: 'B', text: 'Mediación.' },
      { id: 'C', text: 'Patrocinio.' },
      { id: 'D', text: 'Catalogación.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART524_3 menciona montaje, desmontaje, almacenamiento y mantenimiento de elementos escénicos.',
    source: ref('cnecp', 'cncp-art524-3-contenidos', 'ART524_3, Maquinaria escénica para el espectáculo en vivo', { url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634' })
  },
  {
    id: 'm3-reinforce-20260801-032-02',
    topicId: 'especifico-32',
    prompt: 'Según el temario M1 de Realización, la utilería teatral se estudia junto a sus tipos, características y:',
    options: [
      { id: 'A', text: 'Mobiliario de escena.' },
      { id: 'B', text: 'Patronaje histórico.' },
      { id: 'C', text: 'Mapping escénico.' },
      { id: 'D', text: 'Gestión de abonos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El temario M1 de Realización incluye conceptos básicos de utilería, tipos y características, y mobiliario de escena.',
    source: ref('inaem', 'inaem-m1-2022-realizacion-de-proyectos-audiovisuales-t7', 'Temario técnico INAEM M1, Realización de Proyectos Audiovisuales y Espectáculos, tema 7')
  },
  {
    id: 'm3-reinforce-20260801-034-01',
    topicId: 'especifico-34',
    prompt: 'Según IMS437_3, adaptar el espectáculo puede referirse a espacios de representación y condiciones de:',
    options: [
      { id: 'A', text: 'Gira.' },
      { id: 'B', text: 'Taquilla.' },
      { id: 'C', text: 'Archivo.' },
      { id: 'D', text: 'Mecenazgo.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS437_3 incluye adaptar el espectáculo a espacios y condiciones de gira dentro de la asistencia a producción.',
    source: ref('cnecp', 'cncp-ims437-3-contenidos', 'IMS437_3, Asistencia a la producción de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-034-02',
    topicId: 'especifico-34',
    prompt: 'Según la actualización de producción y adaptación, los presupuestos aparecen asociados a planificación de fases y:',
    options: [
      { id: 'A', text: 'Cronogramas.' },
      { id: 'B', text: 'Partituras.' },
      { id: 'C', text: 'Figurines.' },
      { id: 'D', text: 'Atriles.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente de producción y adaptación menciona organización, contratación, planificación de fases, cronogramas y presupuestos.',
    source: ref('cnecp', 'cncp-pci477-produccion', 'Producción y adaptación de espacios escénicos, actualización 2019', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2019-6893' })
  },
  {
    id: 'm3-reinforce-20260801-035-01',
    topicId: 'especifico-35',
    prompt: 'Según el temario M1 de sastrería, la interpretación de figurines se relaciona con desgloses y comunicación con:',
    options: [
      { id: 'A', text: 'El figurinista.' },
      { id: 'B', text: 'El maquinista.' },
      { id: 'C', text: 'El iluminador.' },
      { id: 'D', text: 'El taquillero.' }
    ],
    correctOptionId: 'A',
    explanation: 'El tema 4 de Gestión de Sastrería menciona interpretación de figurines, desgloses y comunicación con el figurinista.',
    source: ref('inaem', 'inaem-m1-2022-gestion-de-sastreria-del-espectaculo-e-t4', 'Temario técnico INAEM M1, Gestión de Sastrería del Espectáculo en Vivo, tema 4')
  },
  {
    id: 'm3-reinforce-20260801-035-02',
    topicId: 'especifico-35',
    prompt: 'Según el temario M1 de peluquería, las pelucas y postizos se estudian junto con materiales, productos, útiles y:',
    options: [
      { id: 'A', text: 'Técnicas de manipulación y limpieza.' },
      { id: 'B', text: 'Sistemas de elevación y tiro.' },
      { id: 'C', text: 'Cronogramas de producción.' },
      { id: 'D', text: 'Protocolos de contratación.' }
    ],
    correctOptionId: 'A',
    explanation: 'El tema 7 de Estilismo y Dirección de Peluquería incluye pelucas y postizos, materiales, productos, útiles y técnicas de manipulación y limpieza.',
    source: ref('inaem', 'inaem-m1-2022-estilismo-y-direccion-de-peluqueria-t7', 'Temario técnico INAEM M1, Estilismo y Dirección de Peluquería, tema 7')
  },
  {
    id: 'm3-reinforce-20260801-036-01',
    topicId: 'especifico-36',
    prompt: 'Según IMS442_3, la dirección de escenario incluye seguimiento de:',
    options: [
      { id: 'A', text: 'Las órdenes de escena.' },
      { id: 'B', text: 'Las cuentas anuales.' },
      { id: 'C', text: 'Las fichas de préstamo.' },
      { id: 'D', text: 'Las ayudas fiscales.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS442_3 describe la regiduría como interpretación del proyecto, preparación del espacio, organización de equipos y seguimiento de las órdenes de escena.',
    source: ref('cnecp', 'cncp-ims442-3-contenidos', 'IMS442_3, Regiduría de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-036-02',
    topicId: 'especifico-36',
    prompt: 'Según el temario M1 de asistencia a dirección técnica, la regiduría se estudia con libreto, partitura, planificación y:',
    options: [
      { id: 'A', text: 'Organización del trabajo.' },
      { id: 'B', text: 'Cuentas justificativas.' },
      { id: 'C', text: 'Derechos de explotación.' },
      { id: 'D', text: 'Indicadores de consumo.' }
    ],
    correctOptionId: 'A',
    explanation: 'El tema 7 de asistencia a dirección técnica incluye conceptos de regiduría, libreto, partitura, planificación y organización del trabajo.',
    source: ref('inaem', 'inaem-m1-2022-asistencia-a-la-direccion-tecnica-de-e-t7', 'Temario técnico INAEM M1, Asistencia a la Dirección Técnica de Espectáculos en Vivo y Eventos, tema 7')
  },
  {
    id: 'm3-reinforce-20260801-037-01',
    topicId: 'especifico-37',
    prompt: 'Según IMS442_3, la regiduría adapta su trabajo a teatros, espacios no convencionales y:',
    options: [
      { id: 'A', text: 'Gira.' },
      { id: 'B', text: 'Mecenazgo.' },
      { id: 'C', text: 'Archivo.' },
      { id: 'D', text: 'Taquilla.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS442_3 incluye la adaptación del trabajo de regiduría a teatros, espacios no convencionales y gira.',
    source: ref('cnecp', 'cncp-ims442-3-contenidos', 'IMS442_3, Regiduría de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-037-02',
    topicId: 'especifico-37',
    prompt: 'Según el temario M1 de Realización, el regidor en ensayos se vincula con planificación de ensayos, tipos de ensayos y:',
    options: [
      { id: 'A', text: 'Funciones del regidor durante los ensayos.' },
      { id: 'B', text: 'Liquidación de derechos de propiedad intelectual.' },
      { id: 'C', text: 'Catalogación de fondos documentales.' },
      { id: 'D', text: 'Determinación de incentivos fiscales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El tema 10 de Realización trata el regidor en ensayos, planificación, tipos de ensayos y funciones durante los ensayos.',
    source: ref('inaem', 'inaem-m1-2022-realizacion-de-proyectos-audiovisuales-t10', 'Temario técnico INAEM M1, Realización de Proyectos Audiovisuales y Espectáculos, tema 10')
  },
  {
    id: 'm3-reinforce-20260801-038-01',
    topicId: 'especifico-38',
    prompt: 'Según IMS437_3, la asistencia a producción coordina recursos artísticos, técnicos y:',
    options: [
      { id: 'A', text: 'Humanos.' },
      { id: 'B', text: 'Registrales.' },
      { id: 'C', text: 'Museísticos.' },
      { id: 'D', text: 'Editoriales.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS437_3 habla de planificar la producción y coordinar recursos artísticos, técnicos y humanos.',
    source: ref('cnecp', 'cncp-ims437-3-contenidos', 'IMS437_3, Asistencia a la producción de espectáculos en vivo y eventos', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972' })
  },
  {
    id: 'm3-reinforce-20260801-038-02',
    topicId: 'especifico-38',
    prompt: 'Según el temario M1 de asistencia a dirección técnica, la coordinación de giras incluye planificación de:',
    options: [
      { id: 'A', text: 'Carga y descarga.' },
      { id: 'B', text: 'ISBN y depósito legal.' },
      { id: 'C', text: 'Cuentas fundacionales.' },
      { id: 'D', text: 'Fondos museográficos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El tema 5 menciona coordinación de ensayos, montajes, funciones y giras, así como planificación de la carga y descarga.',
    source: ref('inaem', 'inaem-m1-2022-asistencia-a-la-direccion-tecnica-de-e-t5', 'Temario técnico INAEM M1, Asistencia a la Dirección Técnica de Espectáculos en Vivo y Eventos, tema 5')
  },
  {
    id: 'm3-reinforce-20260801-040-01',
    topicId: 'especifico-40',
    prompt: 'Según la actualización técnica de 2024, el vídeo aplicado a escena incorpora mapping, warping, proyección y:',
    options: [
      { id: 'A', text: 'Vídeo-dramaturgia.' },
      { id: 'B', text: 'Patronaje.' },
      { id: 'C', text: 'Mecenazgo.' },
      { id: 'D', text: 'Catalogación.' }
    ],
    correctOptionId: 'A',
    explanation: 'La actualización de 2024 incluye preparación de contenidos, línea de tiempo, efectos, mapping, warping, proyección y vídeo-dramaturgia.',
    source: ref('cnecp', 'cncp-video-escena-2024', 'Tecnología de vídeo y contenidos para la escena, actualización 2024', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2024-20759' })
  },
  {
    id: 'm3-reinforce-20260801-040-02',
    topicId: 'especifico-40',
    prompt: 'Según la actualización técnica de 2024, entre los protocolos y controles de vídeo escénico pueden figurar MIDI, OSC, Ethernet y:',
    options: [
      { id: 'A', text: 'SMPTE.' },
      { id: 'B', text: 'BIC.' },
      { id: 'C', text: 'ISBN.' },
      { id: 'D', text: 'DAFO.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente cita MIDI, OSC, Ethernet y SMPTE cuando forman parte del sistema de vídeo escénico.',
    source: ref('cnecp', 'cncp-video-escena-2024', 'Tecnología de vídeo y contenidos para la escena, actualización 2024', { url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2024-20759' })
  },
  {
    id: 'm3-reinforce-20260801-042-01',
    topicId: 'especifico-42',
    prompt: 'Según la NTP 355 del INSST, la respuesta fisiológica de estrés es una respuesta del organismo ante una demanda que altera su:',
    options: [
      { id: 'A', text: 'Equilibrio.' },
      { id: 'B', text: 'Contrato.' },
      { id: 'C', text: 'Aforo.' },
      { id: 'D', text: 'Presupuesto.' }
    ],
    correctOptionId: 'A',
    explanation: 'La NTP 355 presenta el estrés como respuesta general del organismo ante demandas o alteraciones de su equilibrio.',
    source: ref('insst', 'ntp-0355-fisiologia', 'NTP 355, Fisiología del estrés', { url: 'https://www.insst.es/materias/riesgos/riesgos-psicosociales/estres-laboral' })
  },
  {
    id: 'm3-reinforce-20260801-042-02',
    topicId: 'especifico-42',
    prompt: 'Según la NTP 318, el estrés laboral no depende solo del estímulo externo, sino también de:',
    options: [
      { id: 'A', text: 'La percepción y los recursos de la persona.' },
      { id: 'B', text: 'La titularidad pública del equipamiento.' },
      { id: 'C', text: 'La modalidad de exhibición escénica.' },
      { id: 'D', text: 'La duración artística del espectáculo.' }
    ],
    correctOptionId: 'A',
    explanation: 'La NTP 318 explica el estrés como interacción entre estresores, percepción y características o recursos personales.',
    source: ref('insst', 'ntp-0318-proceso', 'NTP 318, El estrés: proceso de generación en el ámbito laboral', { url: 'https://www.insst.es/documents/94886/326827/ntp_318.pdf/2c36529c-e315-4b60-9b6d-33cb81a8bfd0' })
  }
].map(item => rotate({ ...item, origin: item.origin || origin }));

const itemIds = new Set(items.map(question => question.id));
const retained = questions.filter(question => !itemIds.has(question.id));
const replaced = questions.length - retained.length;
retained.push(...items);

await writeFile(questionsPath, `${JSON.stringify(retained, null, 2)}\n`, 'utf8');
console.log(`Añadidas/actualizadas ${items.length} preguntas de refuerzo pool5 (${replaced} reemplazadas).`);
