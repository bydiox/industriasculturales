import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const catalog = {
  anuario: {
    kind: 'referencia',
    sourceId: 'anuario-cultura-2024',
    file: 'sources/fuente-anuario-estadisticas-2024.html',
    author: 'Ministerio de Cultura · División de Estadística y Estudios',
    edition: 'Anuario de Estadísticas Culturales 2024',
    url: 'https://www.cultura.gob.es/servicios-al-ciudadano/estadisticas/cultura/mc/aec.html'
  },
  femp: {
    kind: 'referencia',
    sourceId: 'femp-indicadores-politicas-culturales',
    file: 'sources/fuente-femp-indicadores.html',
    author: 'Federación Española de Municipios y Provincias · Ministerio de Cultura',
    edition: 'Sistema de indicadores para la evaluación de las políticas culturales locales',
    url: 'https://www.cultura.gob.es/dam/jcr:d7da8b7a-94a9-4766-ab97-599a2df576b8/evaluacion-politicas-locales-cor.pdf'
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
  }
};

const origin = {
  type: 'reference',
  label: 'M3 · tercera ampliación desde fuentes de referencia · 2026-08-01',
  historical: false,
  elaboracion: 'Elaborada a partir de fuente institucional con ancla verificada'
};

const optionIds = ['A', 'B', 'C', 'D'];

function source(key, anchorId, reference) {
  return { ...catalog[key], anchorId, reference, locator: reference };
}

function stableShift(id) {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % optionIds.length;
}

function normalise(question) {
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
    origin,
    editorialStatus: 'active-reference',
    createdAt: '2026-08-01'
  };
}

const items = [
  {
    id: 'ref-extra3-11-01',
    topicId: 'especifico-11',
    prompt: 'Según el Anuario 2024, la Estadística de Museos y Colecciones Museográficas tiene periodicidad:',
    options: [
      { id: 'A', text: 'Bienal.' },
      { id: 'B', text: 'Mensual.' },
      { id: 'C', text: 'Trimestral.' },
      { id: 'D', text: 'Quinquenal.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que la Estadística de Museos y Colecciones Museográficas es una operación estadística de periodicidad bienal.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'ref-extra3-11-02',
    topicId: 'especifico-11',
    prompt: 'En 2022, según el Anuario 2024, las instituciones museísticas investigadas recibieron:',
    options: [
      { id: 'A', text: '51,6 millones de visitantes.' },
      { id: 'B', text: '17,6 millones de visitantes.' },
      { id: 'C', text: '35,2 millones de visitantes.' },
      { id: 'D', text: '75,1 millones de visitantes.' }
    ],
    correctOptionId: 'A',
    explanation: 'La estadística estima que las 1.522 instituciones investigadas recibieron 51,6 millones de visitantes en 2022.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'ref-extra3-11-03',
    topicId: 'especifico-11',
    prompt: 'Según el Anuario 2024, en 2022 la mayor parte de las instituciones museísticas investigadas eran de titularidad:',
    options: [
      { id: 'A', text: 'Pública.' },
      { id: 'B', text: 'Privada.' },
      { id: 'C', text: 'Mixta.' },
      { id: 'D', text: 'Sin clasificar.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario señala que el 75,1% de las instituciones investigadas eran de titularidad pública.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'ref-extra3-13-01',
    topicId: 'especifico-13',
    prompt: 'Según el Componente 24, antes de la pandemia la industria cultural representaba en España:',
    options: [
      { id: 'A', text: 'El 3,2% del PIB.' },
      { id: 'B', text: 'El 0,8% del PIB.' },
      { id: 'C', text: 'El 6,5% del PIB.' },
      { id: 'D', text: 'El 10,4% del PIB.' }
    ],
    correctOptionId: 'A',
    explanation: 'La descripción general del Componente 24 sitúa el peso de la industria cultural antes de la COVID-19 en el 3,2% del PIB.',
    source: source('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  },
  {
    id: 'ref-extra3-13-02',
    topicId: 'especifico-13',
    prompt: 'Según el Componente 24, la cultura actúa como factor de desarrollo y sostenibilidad:',
    options: [
      { id: 'A', text: 'Territorial.' },
      { id: 'B', text: 'Institucional.' },
      { id: 'C', text: 'Presupuestaria.' },
      { id: 'D', text: 'Empresarial.' }
    ],
    correctOptionId: 'A',
    explanation: 'El texto del Componente 24 vincula la cultura con el desarrollo y la sostenibilidad territorial.',
    source: source('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  },
  {
    id: 'ref-extra3-13-03',
    topicId: 'especifico-13',
    prompt: 'En la Agenda 21 de la cultura citada por la FEMP, las políticas culturales locales se relacionan con:',
    options: [
      { id: 'A', text: 'Derechos humanos, diversidad cultural y democracia participativa.' },
      { id: 'B', text: 'Turismo cultural, patrocinio privado y contratación artística.' },
      { id: 'C', text: 'Promoción exterior, economía creativa y propiedad intelectual.' },
      { id: 'D', text: 'Financiación cultural, cooperación territorial y evaluación contable.' }
    ],
    correctOptionId: 'A',
    explanation: 'La FEMP cita la Agenda 21 de la cultura como documento vinculado a derechos humanos, diversidad cultural, sostenibilidad, democracia participativa y paz.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p02', 'Párrafo 2')
  },
  {
    id: 'ref-extra3-14-01',
    topicId: 'especifico-14',
    prompt: 'Según el Anuario 2024, la Estadística de Fundaciones sujetas al Protectorado Estatal pertenece al:',
    options: [
      { id: 'A', text: 'Plan Estadístico Nacional.' },
      { id: 'B', text: 'Plan de Derechos Culturales.' },
      { id: 'C', text: 'Programa Europa Creativa.' },
      { id: 'D', text: 'Sistema de Indicadores Locales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario presenta esta estadística como una operación perteneciente al Plan Estadístico Nacional.',
    source: source('anuario', 'anuario-cultura-2024-s20-fundaciones-sujetas-al-01', 'Fundaciones sujetas al Protectorado Estatal, párrafo 1')
  },
  {
    id: 'ref-extra3-14-02',
    topicId: 'especifico-14',
    prompt: 'En 2022, según el Anuario 2024, las fundaciones sujetas al Protectorado Estatal inscritas fueron:',
    options: [
      { id: 'A', text: '4.878.' },
      { id: 'B', text: '2.536.' },
      { id: 'C', text: '17.617.' },
      { id: 'D', text: '13.748.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que en 2022 había 4.878 fundaciones sujetas al Protectorado Estatal inscritas en el Registro de Fundaciones.',
    source: source('anuario', 'anuario-cultura-2024-s20-fundaciones-sujetas-al-01', 'Fundaciones sujetas al Protectorado Estatal, párrafo 1')
  },
  {
    id: 'ref-extra3-15-01',
    topicId: 'especifico-15',
    prompt: 'En el Plan de Derechos Culturales, la medida sobre inclusión en instituciones culturales busca identificar:',
    options: [
      { id: 'A', text: 'Barreras y situaciones de exclusión o discriminación.' },
      { id: 'B', text: 'Programaciones, precios públicos y campañas de abono.' },
      { id: 'C', text: 'Catálogos, préstamos temporales y seguros de obras.' },
      { id: 'D', text: 'Subvenciones, convenios y contratos de patrocinio.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 4 plantea protocolos para identificar barreras, prevenir la exclusión y promover entornos accesibles y libres de discriminación.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-004', 'Medida 4: Inclusión y no discriminación en instituciones culturales')
  },
  {
    id: 'ref-extra3-15-02',
    topicId: 'especifico-15',
    prompt: 'Según el Plan de Derechos Culturales, la cesión de materiales culturales se vincula con:',
    options: [
      { id: 'A', text: 'Sostenibilidad y circularidad.' },
      { id: 'B', text: 'Accesibilidad y mediación.' },
      { id: 'C', text: 'Innovación y digitalización.' },
      { id: 'D', text: 'Programación y públicos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 84 relaciona la cesión de materiales con la prolongación de su ciclo de vida y con políticas culturales sostenibles.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-084', 'Medida 84: Protocolo para la cesión de uso de materiales culturales')
  },
  {
    id: 'ref-extra3-18-01',
    topicId: 'especifico-18',
    prompt: 'Según la FEMP, la Agenda 21 de la cultura propone evaluar el impacto cultural de iniciativas que impliquen cambios significativos en:',
    options: [
      { id: 'A', text: 'La vida cultural de las ciudades.' },
      { id: 'B', text: 'La programación cultural de los centros.' },
      { id: 'C', text: 'El gasto cultural de los hogares.' },
      { id: 'D', text: 'El empleo cultural del territorio.' }
    ],
    correctOptionId: 'A',
    explanation: 'El artículo 25 de la Agenda 21, citado por la FEMP, alude a formas de evaluación del impacto cultural en la vida cultural de las ciudades.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p03', 'Párrafo 3')
  },
  {
    id: 'ref-extra3-18-02',
    topicId: 'especifico-18',
    prompt: 'En el Sistema de Indicadores de la FEMP, las respuestas de autoevaluación deben apoyarse en:',
    options: [
      { id: 'A', text: 'Evidencias documentales.' },
      { id: 'B', text: 'Encuestas ciudadanas.' },
      { id: 'C', text: 'Informes presupuestarios.' },
      { id: 'D', text: 'Indicadores cuantitativos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento indica que las respuestas cualitativas del sistema de autoevaluación deben estar respaldadas por evidencias documentales.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p13', 'Párrafo 13')
  },
  {
    id: 'ref-extra3-18-03',
    topicId: 'especifico-18',
    prompt: 'Según el Plan de Derechos Culturales, el balance social y comunitario permite evaluar:',
    options: [
      { id: 'A', text: 'El impacto de una organización, proyecto o política más allá de lo económico.' },
      { id: 'B', text: 'La ejecución presupuestaria anual de un equipamiento cultural.' },
      { id: 'C', text: 'La asistencia de público y ocupación media de una temporada.' },
      { id: 'D', text: 'La valoración económica de patrocinios y aportaciones privadas.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 15 define el balance social y comunitario como herramienta para valorar impacto, bien común, cohesión social y retorno social.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-015', 'Medida 15: Estudio sobre la aplicación del balance social y comunitario')
  },
  {
    id: 'ref-extra3-20-01',
    topicId: 'especifico-20',
    prompt: 'Según el Anuario 2024, sus indicadores proceden principalmente de operaciones incluidas en el:',
    options: [
      { id: 'A', text: 'Plan Estadístico Nacional.' },
      { id: 'B', text: 'Registro Mercantil Central.' },
      { id: 'C', text: 'Catálogo Colectivo de Patrimonio.' },
      { id: 'D', text: 'Inventario General de Contratos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La introducción explica que el Anuario concentra indicadores procedentes de operaciones estadísticas incluidas en el Plan Estadístico Nacional.',
    source: source('anuario', 'anuario-cultura-2024-s00-introducci-n-y-notas-metodol-g-01', 'Introducción y notas metodológicas, párrafo 1')
  },
  {
    id: 'ref-extra3-26-01',
    topicId: 'especifico-26',
    prompt: 'En el Componente 24, la reforma C24.R1 se refiere al Estatuto del Artista y al fomento de:',
    options: [
      { id: 'A', text: 'La inversión, el mecenazgo cultural y la participación.' },
      { id: 'B', text: 'La fiscalización previa y la contabilidad nacional.' },
      { id: 'C', text: 'La propiedad industrial y las marcas comerciales.' },
      { id: 'D', text: 'La cooperación judicial y la ejecución hipotecaria.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 identifica la C24.R1 como desarrollo del Estatuto del Artista y fomento de la inversión, el mecenazgo cultural y la participación.',
    source: source('componente24', 'componente-24-sec-3', 'Detalle de la reforma C24.R1')
  },
  {
    id: 'ref-extra3-26-02',
    topicId: 'especifico-26',
    prompt: 'Según el Componente 24, mejorar el mecenazgo y los incentivos fiscales busca favorecer:',
    options: [
      { id: 'A', text: 'La recuperación, resiliencia y competitividad del sector cultural.' },
      { id: 'B', text: 'La financiación ordinaria de los servicios culturales municipales.' },
      { id: 'C', text: 'La centralización estatal de las actividades culturales privadas.' },
      { id: 'D', text: 'La sustitución de subvenciones por ingresos de taquilla.' }
    ],
    correctOptionId: 'A',
    explanation: 'El texto considera el mecenazgo y los incentivos fiscales elementos clave para la recuperación, resiliencia y competitividad internacional del sector cultural.',
    source: source('componente24', 'componente-24-sec-3', 'Detalle de la reforma C24.R1')
  },
  {
    id: 'ref-extra3-26-03',
    topicId: 'especifico-26',
    prompt: 'Según el Componente 24, una dificultad del sector cultural para recuperarse es encontrar:',
    options: [
      { id: 'A', text: 'Vías de financiación tradicional y captación de recursos privados.' },
      { id: 'B', text: 'Espacios de exhibición suficientes y circuitos estables.' },
      { id: 'C', text: 'Operaciones estadísticas periódicas y comparables.' },
      { id: 'D', text: 'Archivos documentales completos y digitalizados.' }
    ],
    correctOptionId: 'A',
    explanation: 'La C24.R1 señala la dificultad de muchas empresas culturales para encontrar financiación tradicional y captar recursos privados.',
    source: source('componente24', 'componente-24-sec-3', 'Detalle de la reforma C24.R1')
  },
  {
    id: 'ref-extra3-28-01',
    topicId: 'especifico-28',
    prompt: 'Según el Anuario 2024, los datos de derechos de propiedad intelectual gestionados por entidades de gestión son una operación del:',
    options: [
      { id: 'A', text: 'Plan Estadístico Nacional.' },
      { id: 'B', text: 'Registro de Fundaciones.' },
      { id: 'C', text: 'Inventario de Patrimonio Inmaterial.' },
      { id: 'D', text: 'Catálogo Nacional de Cualificaciones.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario identifica esta explotación estadística de derechos de propiedad intelectual como operación perteneciente al Plan Estadístico Nacional.',
    source: source('anuario', 'anuario-cultura-2024-s05-propiedad-01', 'Propiedad intelectual, párrafo 1')
  },
  {
    id: 'ref-extra3-28-02',
    topicId: 'especifico-28',
    prompt: 'Según el Componente 24, la reforma C24.R2 se centra en reforzar:',
    options: [
      { id: 'A', text: 'Los derechos de autor y derechos conexos.' },
      { id: 'B', text: 'Las patentes y marcas culturales.' },
      { id: 'C', text: 'Las ayudas y becas de creación.' },
      { id: 'D', text: 'Los museos y archivos estatales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 denomina la C24.R2 como plan de refuerzo de los derechos de autor y derechos conexos.',
    source: source('componente24', 'componente-24-sec-3', 'Detalle de la reforma C24.R2')
  },
  {
    id: 'ref-extra3-40-01',
    topicId: 'especifico-40',
    prompt: 'Según el Componente 24, la contribución del componente a la transición digital se eleva al:',
    options: [
      { id: 'A', text: '29,5%.' },
      { id: 'B', text: '3,2%.' },
      { id: 'C', text: '43,4%.' },
      { id: 'D', text: '87,2%.' }
    ],
    correctOptionId: 'A',
    explanation: 'El apartado sobre transición digital del Componente 24 fija esa contribución en el 29,5%.',
    source: source('componente24', 'componente-24-sec-7', 'Contribución del componente a la transición digital')
  }
].map(normalise);

const itemIds = new Set(items.map(question => question.id));
const retained = questions.filter(question => !itemIds.has(question.id));
const replaced = questions.length - retained.length;
const toAdd = items;

retained.push(...toAdd);

await writeFile(questionsPath, `${JSON.stringify(retained, null, 2)}\n`, 'utf8');
console.log(`Añadidas/actualizadas ${toAdd.length} preguntas de tercera ampliación desde fuentes de referencia (${replaced} reemplazadas).`);
