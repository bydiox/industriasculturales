import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const origin = {
  type: 'generated_reference',
  label: 'M3 · banco propio de referencia · cierre simulacro pool3',
  historical: false
};

const ref = ({ reference, author, edition, locator, url }) => ({
  kind: 'referencia',
  reference,
  author,
  edition,
  locator,
  url
});

const sources = {
  britannicaTheatre: ref({
    reference: 'Encyclopaedia Britannica, “theatre”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Historia y formas teatrales',
    url: 'https://www.britannica.com/art/theatre-art'
  }),
  britannicaDrama: ref({
    reference: 'Encyclopaedia Britannica, “drama”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Géneros y estructura dramática',
    url: 'https://www.britannica.com/art/drama-literature'
  }),
  britannicaMusic: ref({
    reference: 'Encyclopaedia Britannica, “Western music”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Historia de la música occidental',
    url: 'https://www.britannica.com/art/Western-music'
  }),
  britannicaOpera: ref({
    reference: 'Encyclopaedia Britannica, “opera”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Definición y elementos de la ópera',
    url: 'https://www.britannica.com/art/opera-music'
  }),
  britannicaBallet: ref({
    reference: 'Encyclopaedia Britannica, “ballet”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Vocabulario básico del ballet',
    url: 'https://www.britannica.com/art/ballet'
  }),
  britannicaModernDance: ref({
    reference: 'Encyclopaedia Britannica, “modern dance”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Definición e historia de la danza moderna',
    url: 'https://www.britannica.com/art/modern-dance'
  }),
  britannicaCircus: ref({
    reference: 'Encyclopaedia Britannica, “circus”',
    author: 'Encyclopaedia Britannica',
    edition: 'entrada en línea',
    locator: 'Artes circenses y números de circo',
    url: 'https://www.britannica.com/art/circus-theatrical-entertainment'
  }),
  tateWhiteCube: ref({
    reference: 'Tate, “Art Terms: White Cube”',
    author: 'Tate',
    edition: 'entrada en línea',
    locator: 'Definición de white cube',
    url: 'https://www.tate.org.uk/art/art-terms/w/white-cube'
  }),
  tateInstallation: ref({
    reference: 'Tate, “Art Terms: Installation Art”',
    author: 'Tate',
    edition: 'entrada en línea',
    locator: 'Definición de instalación artística',
    url: 'https://www.tate.org.uk/art/art-terms/i/installation-art'
  }),
  sothebysMarket: ref({
    reference: 'Sotheby’s Institute of Art, “Primary and Secondary Art Markets”',
    author: 'Sotheby’s Institute of Art',
    edition: 'recurso en línea',
    locator: 'Distinción entre mercado primario y secundario',
    url: 'https://www.sothebysinstitute.com/'
  }),
  unescoCreative: ref({
    reference: 'UNESCO, Creative Economy Report',
    author: 'UNESCO',
    edition: 'informe de referencia',
    locator: 'Economía creativa, cultura y desarrollo',
    url: 'https://unesdoc.unesco.org/'
  }),
  unescoFcs: ref({
    reference: 'UNESCO Institute for Statistics, 2009 UNESCO Framework for Cultural Statistics',
    author: 'UNESCO Institute for Statistics',
    edition: '2009',
    locator: 'Ciclo cultural y participación cultural',
    url: 'https://uis.unesco.org/sites/default/files/documents/unesco-framework-for-cultural-statistics-2009-en_0.pdf'
  }),
  dafo: ref({
    reference: 'Ministerio de Industria, Comercio y Turismo, “Herramienta DAFO”',
    author: 'Ministerio de Industria, Comercio y Turismo',
    edition: 'recurso en línea',
    locator: 'Definición de DAFO',
    url: 'https://dafo.ipyme.org/'
  }),
  betterRegulation: ref({
    reference: 'European Commission, Better Regulation Toolbox',
    author: 'European Commission',
    edition: '2021',
    locator: 'Intervention logic: outputs, results and impacts',
    url: 'https://commission.europa.eu/law/law-making-process/planning-and-proposing-law/better-regulation_en'
  }),
  socialValue: ref({
    reference: 'Social Value International, “A Guide to Social Return on Investment”',
    author: 'Social Value International',
    edition: '2012',
    locator: 'Concepto de SROI',
    url: 'https://www.socialvalueint.org/'
  }),
  audience: ref({
    reference: 'European Commission, Study on Audience Development',
    author: 'European Commission',
    edition: '2017',
    locator: 'Definición de audience development',
    url: 'https://op.europa.eu/en/publication-detail/-/publication/cc36509d-19c6-11e7-808e-01aa75ed71a1'
  }),
  encuestaHabitos: ref({
    reference: 'Ministerio de Cultura, Encuesta de Hábitos y Prácticas Culturales en España',
    author: 'Ministerio de Cultura',
    edition: 'operación estadística oficial',
    locator: 'Descripción de la operación estadística',
    url: 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/ehc.html'
  }),
  cuentaSatelite: ref({
    reference: 'Ministerio de Cultura, Cuenta Satélite de la Cultura en España',
    author: 'Ministerio de Cultura',
    edition: 'metodología oficial',
    locator: 'Descripción metodológica',
    url: 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/culturabase/cuenta-satelite/metodologia-cuenta.html'
  }),
  kotlerScheff: ref({
    reference: 'Philip Kotler y Joanne Scheff, Standing Room Only: Strategies for Marketing the Performing Arts',
    author: 'Philip Kotler; Joanne Scheff',
    edition: 'Harvard Business School Press, 1997',
    locator: 'Segmentación, posicionamiento, precios y públicos',
    url: 'https://archive.org/details/standingroomonly00kotl'
  }),
  peso: ref({
    reference: 'Gini Dietrich, Spin Sucks: Communication and Reputation Management in the Digital Age',
    author: 'Gini Dietrich',
    edition: 'Que Publishing, 2014',
    locator: 'PESO model: paid, earned, shared, owned media',
    url: 'https://spinsucks.com/'
  }),
  mediation: ref({
    reference: 'Institute for Art Education, Time for Cultural Mediation',
    author: 'Institute for Art Education, Zurich University of the Arts',
    edition: '2012',
    locator: 'Concepto de mediación cultural',
    url: 'https://www.kultur-vermittlung.ch/time-for-cultural-mediation/'
  }),
  getz: ref({
    reference: 'Donald Getz, Event Studies: Theory, Research and Policy for Planned Events',
    author: 'Donald Getz',
    edition: 'Routledge, 2.ª ed., 2012',
    locator: 'Festivals and planned events',
    url: 'https://www.routledge.com/Event-Studies/Getz/p/book/9780080966037'
  }),
  tateCurator: ref({
    reference: 'Tate, “Art Terms: Curator”',
    author: 'Tate',
    edition: 'entrada en línea',
    locator: 'Definición de curator',
    url: 'https://www.tate.org.uk/art/art-terms/c/curator'
  }),
  inaemPlatea: ref({
    reference: 'INAEM, Programa Platea',
    author: 'Instituto Nacional de las Artes Escénicas y de la Música',
    edition: 'programa institucional',
    locator: 'Circulación de espectáculos por espacios escénicos',
    url: 'https://www.cultura.gob.es/cultura/artesescenicas/platea.html'
  }),
  costume: ref({
    reference: 'Tiranti, The Handbook of Costume Terms',
    author: 'Costume and theatre terminology reference',
    edition: 'manual de terminología escénica',
    locator: 'Vocabulario básico de vestuario escénico',
    url: 'https://archive.org/'
  }),
  makeup: ref({
    reference: 'Richard Corson, Stage Makeup',
    author: 'Richard Corson',
    edition: 'manual de referencia',
    locator: 'Caracterización y maquillaje escénico',
    url: 'https://archive.org/'
  })
};

const optionIds = ['A', 'B', 'C', 'D'];

function stableShift(id) {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % optionIds.length;
}

function withBalancedOptionOrder(question) {
  const correctText = question.options.find(option => option.id === question.correctOptionId)?.text;
  const shift = stableShift(question.id);
  const rotated = question.options.slice(shift).concat(question.options.slice(0, shift));
  const options = rotated.map((option, index) => ({ ...option, id: optionIds[index] }));
  const correctIndex = options.findIndex(option => option.text === correctText);
  return { ...question, options, correctOptionId: optionIds[correctIndex] };
}

const questionsToAdd = [
  {
    id: 'm3-ref-examgap-es18-001',
    topicId: 'especifico-18',
    prompt: 'En planificación estratégica, ¿qué dimensiones recoge una matriz DAFO?',
    options: [
      { id: 'A', text: 'Debilidades, amenazas, fortalezas y oportunidades.' },
      { id: 'B', text: 'Diagnóstico, alcance, financiación y organigrama.' },
      { id: 'C', text: 'Demanda, audiencia, fondos y operación.' },
      { id: 'D', text: 'Diseño, activación, formato y objetivos.' }
    ],
    correctOptionId: 'A',
    explanation: 'DAFO ordena factores internos y externos: debilidades y fortalezas en el plano interno; amenazas y oportunidades en el externo.',
    source: sources.dafo
  },
  {
    id: 'm3-ref-examgap-es18-002',
    topicId: 'especifico-18',
    prompt: 'En un plan estratégico, ¿qué expresa la misión de una organización cultural?',
    options: [
      { id: 'A', text: 'La razón de ser y el propósito actual de la entidad.' },
      { id: 'B', text: 'La imagen futura deseada hacia la que se orienta.' },
      { id: 'C', text: 'La magnitud usada para medir avance o resultado.' },
      { id: 'D', text: 'La relación de recursos disponibles para ejecutarlo.' }
    ],
    correctOptionId: 'A',
    explanation: 'La misión formula para qué existe la organización y qué papel cumple; no equivale al presupuesto, al inventario ni a la programación cerrada.',
    source: sources.betterRegulation
  },
  {
    id: 'm3-ref-examgap-es18-003',
    topicId: 'especifico-18',
    prompt: 'En planificación, ¿qué diferencia un objetivo de un indicador?',
    options: [
      { id: 'A', text: 'El objetivo fija un resultado buscado; el indicador mide su avance.' },
      { id: 'B', text: 'El objetivo mide el dato; el indicador define el cambio buscado.' },
      { id: 'C', text: 'El objetivo equivale a la visión; el indicador equivale a la misión.' },
      { id: 'D', text: 'El objetivo es el recurso asignado; el indicador es la actividad.' }
    ],
    correctOptionId: 'A',
    explanation: 'El objetivo describe el cambio o resultado perseguido; el indicador es la variable que permite observar si se avanza hacia él.',
    source: sources.betterRegulation
  },
  {
    id: 'm3-ref-examgap-es18-004',
    topicId: 'especifico-18',
    prompt: 'En la lógica de intervención, ¿qué identifica mejor una realización u output?',
    options: [
      { id: 'A', text: 'Un producto o servicio entregado por la intervención.' },
      { id: 'B', text: 'Un cambio producido en los destinatarios de la intervención.' },
      { id: 'C', text: 'Un efecto de largo alcance asociado a la política.' },
      { id: 'D', text: 'Un recurso económico o humano destinado al proyecto.' }
    ],
    correctOptionId: 'A',
    explanation: 'Las realizaciones u outputs son bienes, servicios o actividades entregadas; los resultados e impactos describen cambios posteriores.',
    source: sources.betterRegulation
  },
  {
    id: 'm3-ref-examgap-es06-001',
    topicId: 'especifico-06',
    prompt: 'En historia del teatro, ¿qué identifica mejor una tragedia clásica?',
    options: [
      { id: 'A', text: 'Una acción grave con conflicto y desenlace funesto.' },
      { id: 'B', text: 'Una pieza breve cómica entre actos principales.' },
      { id: 'C', text: 'Una comedia de enredo con final reconciliador.' },
      { id: 'D', text: 'Una pieza alegórica de tema religioso o moral.' }
    ],
    correctOptionId: 'A',
    explanation: 'La tragedia se asocia a una acción seria, conflicto elevado y desenlace doloroso o funesto, a diferencia de formas cómicas o musicales.',
    source: sources.britannicaDrama
  },
  {
    id: 'm3-ref-examgap-es06-002',
    topicId: 'especifico-06',
    prompt: 'En el teatro español del Siglo de Oro, ¿qué designa una comedia nueva?',
    options: [
      { id: 'A', text: 'Una forma dramática que mezcla registros trágicos y cómicos.' },
      { id: 'B', text: 'Una tragedia ajustada a las unidades clásicas estrictas.' },
      { id: 'C', text: 'Una pieza breve costumbrista de un solo cuadro.' },
      { id: 'D', text: 'Un melodrama musical sin alternancia de registros.' }
    ],
    correctOptionId: 'A',
    explanation: 'La comedia nueva se asocia al teatro barroco español y a la mezcla de tonos, acciones y registros frente a reglas clasicistas rígidas.',
    source: sources.britannicaTheatre
  },
  {
    id: 'm3-ref-examgap-es06-003',
    topicId: 'especifico-06',
    prompt: 'En teatro, ¿qué caracteriza a un entremés?',
    options: [
      { id: 'A', text: 'Una pieza breve, normalmente cómica, representada entre partes.' },
      { id: 'B', text: 'Una tragedia extensa organizada en cinco jornadas.' },
      { id: 'C', text: 'Una loa solemne que abre una representación oficial.' },
      { id: 'D', text: 'Un auto alegórico centrado en doctrina religiosa.' }
    ],
    correctOptionId: 'A',
    explanation: 'El entremés es una pieza corta de carácter cómico, tradicionalmente vinculada a la representación entre partes de una obra mayor.',
    source: sources.britannicaDrama
  },
  {
    id: 'm3-ref-examgap-es07-001',
    topicId: 'especifico-07',
    prompt: 'En música escénica, ¿qué rasgo distingue a la ópera?',
    options: [
      { id: 'A', text: 'La acción dramática se desarrolla principalmente mediante canto.' },
      { id: 'B', text: 'La acción alterna diálogo hablado y números musicales populares.' },
      { id: 'C', text: 'La obra se interpreta como canción de cámara para voz y piano.' },
      { id: 'D', text: 'La pieza presenta música sacra sin representación escénica.' }
    ],
    correctOptionId: 'A',
    explanation: 'La ópera combina drama, música, voces, orquesta y escena; su acción se articula esencialmente a través del canto.',
    source: sources.britannicaOpera
  },
  {
    id: 'm3-ref-examgap-es07-002',
    topicId: 'especifico-07',
    prompt: 'En historia de la música, ¿qué identifica mejor un lied?',
    options: [
      { id: 'A', text: 'Una canción artística, normalmente alemana, para voz y piano.' },
      { id: 'B', text: 'Un aria operística integrada en una acción escénica.' },
      { id: 'C', text: 'Una romanza de zarzuela con diálogo hablado.' },
      { id: 'D', text: 'Una canción popular transmitida de forma anónima.' }
    ],
    correctOptionId: 'A',
    explanation: 'El lied se asocia a la canción artística alemana, especialmente del Romanticismo, con voz y acompañamiento de piano.',
    source: sources.britannicaMusic
  },
  {
    id: 'm3-ref-examgap-es07-003',
    topicId: 'especifico-07',
    prompt: 'En música española, ¿qué combina habitualmente la zarzuela?',
    options: [
      { id: 'A', text: 'Números musicales, partes cantadas y diálogo hablado.' },
      { id: 'B', text: 'Canto continuo sin diálogo hablado entre números.' },
      { id: 'C', text: 'Canciones de cámara sin acción dramática.' },
      { id: 'D', text: 'Música sacra interpretada sin puesta en escena.' }
    ],
    correctOptionId: 'A',
    explanation: 'La zarzuela es un género lírico escénico que alterna música, canto y diálogo hablado.',
    source: sources.britannicaMusic
  },
  {
    id: 'm3-ref-examgap-es13-001',
    topicId: 'especifico-13',
    prompt: 'En políticas culturales, ¿qué expresa el concepto de economía creativa?',
    options: [
      { id: 'A', text: 'Actividades basadas en creatividad, conocimiento y producción cultural.' },
      { id: 'B', text: 'Actividades culturales limitadas al patrimonio inmueble protegido.' },
      { id: 'C', text: 'Actividades financiadas solo por administración pública directa.' },
      { id: 'D', text: 'Actividades recreativas excluidas de producción simbólica.' }
    ],
    correctOptionId: 'A',
    explanation: 'La economía creativa agrupa actividades donde la creatividad, el conocimiento, los contenidos y los bienes o servicios culturales generan valor.',
    source: sources.unescoCreative
  },
  {
    id: 'm3-ref-examgap-es13-002',
    topicId: 'especifico-13',
    prompt: 'En gobernanza cultural, ¿qué idea aparece de forma central?',
    options: [
      { id: 'A', text: 'La coordinación entre instituciones, profesionales y sociedad civil.' },
      { id: 'B', text: 'La concentración de decisiones culturales en un único proveedor.' },
      { id: 'C', text: 'La gestión cultural reducida al calendario de pagos.' },
      { id: 'D', text: 'La sustitución de planificación por programación aislada.' }
    ],
    correctOptionId: 'A',
    explanation: 'La gobernanza cultural se relaciona con la forma en que distintos actores participan, coordinan decisiones y comparten responsabilidades.',
    source: sources.unescoCreative
  },
  {
    id: 'm3-ref-examgap-es13-003',
    topicId: 'especifico-13',
    prompt: 'En fomento cultural, ¿qué distingue una ayuda pública de una contratación?',
    options: [
      { id: 'A', text: 'La ayuda financia una actividad de interés; la contratación adquiere una prestación.' },
      { id: 'B', text: 'La ayuda adquiere una prestación concreta; la contratación fomenta una actividad.' },
      { id: 'C', text: 'La ayuda adjudica una obra pública; la contratación concede una subvención.' },
      { id: 'D', text: 'La ayuda define el precio de taquilla; la contratación mide los públicos.' }
    ],
    correctOptionId: 'A',
    explanation: 'En términos de gestión, una ayuda impulsa o financia una actividad; una contratación pública responde a la adquisición de una obra, servicio o suministro.',
    source: sources.unescoCreative
  },
  {
    id: 'm3-ref-examgap-es25-001',
    topicId: 'especifico-25',
    prompt: '¿Qué rasgo se asocia habitualmente a un festival frente a una temporada estable?',
    options: [
      { id: 'A', text: 'La concentración temporal de actividades en torno a un eje.' },
      { id: 'B', text: 'La programación continuada durante todo un curso escénico.' },
      { id: 'C', text: 'La oferta regular de una sede con repertorio estable.' },
      { id: 'D', text: 'La actividad permanente de una compañía residente.' }
    ],
    correctOptionId: 'A',
    explanation: 'Un festival suele concentrar actividades en un periodo limitado y con una identidad o eje de programación reconocible.',
    source: sources.getz
  },
  {
    id: 'm3-ref-examgap-es25-002',
    topicId: 'especifico-25',
    prompt: 'En programación artística, ¿qué tarea se asocia al comisariado?',
    options: [
      { id: 'A', text: 'Seleccionar obras y articularlas en un discurso expositivo.' },
      { id: 'B', text: 'Ordenar fechas de sala sin construir una línea discursiva.' },
      { id: 'C', text: 'Diseñar únicamente la campaña gráfica de temporada.' },
      { id: 'D', text: 'Cerrar necesidades técnicas y presupuestos de gira.' }
    ],
    correctOptionId: 'A',
    explanation: 'El comisariado implica seleccionar, ordenar e interpretar obras o propuestas dentro de un marco discursivo.',
    source: sources.tateCurator
  },
  {
    id: 'm3-ref-examgap-es25-003',
    topicId: 'especifico-25',
    prompt: 'En artes escénicas, ¿qué es un circuito de programación?',
    options: [
      { id: 'A', text: 'Una red que facilita la circulación de espectáculos entre espacios.' },
      { id: 'B', text: 'Una programación concentrada en pocos días bajo una marca.' },
      { id: 'C', text: 'Una temporada regular de una única sede escénica.' },
      { id: 'D', text: 'Una muestra puntual sin itinerancia entre sedes.' }
    ],
    correctOptionId: 'A',
    explanation: 'Un circuito articula varios espacios, programadores o instituciones para favorecer la circulación y exhibición de espectáculos.',
    source: sources.inaemPlatea
  },
  {
    id: 'm3-ref-examgap-es10-001',
    topicId: 'especifico-10',
    prompt: 'En el mercado del arte, ¿qué se entiende por mercado primario?',
    options: [
      { id: 'A', text: 'La primera venta de una obra por artista, estudio o galería.' },
      { id: 'B', text: 'La reventa de obras ya adquiridas por coleccionistas.' },
      { id: 'C', text: 'La venta en subasta de obras procedentes de colecciones.' },
      { id: 'D', text: 'La compraventa posterior entre galerías y coleccionistas.' }
    ],
    correctOptionId: 'A',
    explanation: 'El mercado primario se refiere a la primera comercialización de una obra; el secundario corresponde a reventas posteriores.',
    source: sources.sothebysMarket
  },
  {
    id: 'm3-ref-examgap-es10-002',
    topicId: 'especifico-10',
    prompt: '¿A qué alude la expresión white cube en la exhibición de artes visuales?',
    options: [
      { id: 'A', text: 'A un espacio expositivo neutro, blanco y descontextualizado.' },
      { id: 'B', text: 'A un almacén técnico para conservación preventiva.' },
      { id: 'C', text: 'A una feria comercial dedicada a galerías privadas.' },
      { id: 'D', text: 'A un soporte cúbico utilizado para escultura pública.' }
    ],
    correctOptionId: 'A',
    explanation: 'White cube designa el modelo de galería blanca, limpia y aparentemente neutral que aísla la obra de otros contextos visuales.',
    source: sources.tateWhiteCube
  },
  {
    id: 'm3-ref-examgap-es10-003',
    topicId: 'especifico-10',
    prompt: '¿Qué caracteriza a una instalación artística?',
    options: [
      { id: 'A', text: 'La configuración de una obra en relación con un espacio.' },
      { id: 'B', text: 'La exhibición de una obra aislada sin relación espacial.' },
      { id: 'C', text: 'La reproducción seriada de una imagen original.' },
      { id: 'D', text: 'La ordenación documental de una colección.' }
    ],
    correctOptionId: 'A',
    explanation: 'La instalación se define por la relación entre obra, espacio y experiencia del espectador, más que por un objeto aislado.',
    source: sources.tateInstallation
  },
  {
    id: 'm3-ref-examgap-es19-001',
    topicId: 'especifico-19',
    prompt: '¿Qué expresa el retorno social de la inversión, conocido como SROI?',
    options: [
      { id: 'A', text: 'La relación entre valor social generado e inversión realizada.' },
      { id: 'B', text: 'El número bruto de entradas vendidas en taquilla.' },
      { id: 'C', text: 'El coste contable de producción por localidad ofertada.' },
      { id: 'D', text: 'La diferencia entre ingresos propios y subvención pública.' }
    ],
    correctOptionId: 'A',
    explanation: 'El SROI traduce a una relación el valor social generado por una intervención respecto a los recursos invertidos.',
    source: sources.socialValue
  },
  {
    id: 'm3-ref-examgap-es19-002',
    topicId: 'especifico-19',
    prompt: 'En evaluación de proyectos, ¿qué diferencia un resultado de una realización?',
    options: [
      { id: 'A', text: 'El resultado describe cambios; la realización, entregables.' },
      { id: 'B', text: 'La realización describe recursos asignados al proyecto.' },
      { id: 'C', text: 'El resultado enumera actividades ejecutadas por el gestor.' },
      { id: 'D', text: 'La realización mide efectos sociales posteriores al cierre.' }
    ],
    correctOptionId: 'A',
    explanation: 'En la cadena de resultados, las realizaciones son productos o servicios entregados; los resultados son cambios o efectos derivados.',
    source: sources.betterRegulation
  },
  {
    id: 'm3-ref-examgap-es19-003',
    topicId: 'especifico-19',
    prompt: 'En evaluación de políticas culturales, ¿qué identifica un impacto?',
    options: [
      { id: 'A', text: 'Un efecto de mayor alcance asociado a la intervención.' },
      { id: 'B', text: 'Un producto entregado de forma inmediata por la actividad.' },
      { id: 'C', text: 'Un recurso asignado antes de comenzar el proyecto.' },
      { id: 'D', text: 'Un indicador usado para observar la ejecución.' }
    ],
    correctOptionId: 'A',
    explanation: 'El impacto se sitúa más allá del producto inmediato y apunta a efectos más amplios o duraderos atribuibles a la intervención.',
    source: sources.betterRegulation
  },
  {
    id: 'm3-ref-examgap-es27-001',
    topicId: 'especifico-27',
    prompt: '¿Qué finalidad tiene la Cuenta Satélite de la Cultura en España?',
    options: [
      { id: 'A', text: 'Estimar el peso económico de la cultura en la contabilidad nacional.' },
      { id: 'B', text: 'Registrar las entradas vendidas por cada espacio escénico.' },
      { id: 'C', text: 'Clasificar expedientes de contratación por procedimiento.' },
      { id: 'D', text: 'Inventariar solo bienes inmuebles declarados protegidos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La Cuenta Satélite de la Cultura es una operación estadística de síntesis orientada a estimar la contribución económica del sector cultural.',
    source: sources.cuentaSatelite
  },
  {
    id: 'm3-ref-examgap-es27-002',
    topicId: 'especifico-27',
    prompt: 'En economía de la cultura, ¿qué describe la cadena de valor cultural?',
    options: [
      { id: 'A', text: 'Las fases de creación, producción, distribución, exhibición y consumo.' },
      { id: 'B', text: 'Las categorías de titularidad pública, privada y mixta.' },
      { id: 'C', text: 'Las fases de archivo, depósito, préstamo e inventario.' },
      { id: 'D', text: 'Las etapas de ingreso, gasto, pago y contabilidad.' }
    ],
    correctOptionId: 'A',
    explanation: 'La cadena de valor cultural ordena las fases por las que un bien o servicio cultural se crea, produce, distribuye, exhibe y llega al público.',
    source: sources.unescoFcs
  },
  {
    id: 'm3-ref-examgap-es27-003',
    topicId: 'especifico-27',
    prompt: 'En estadísticas culturales, ¿qué mide el empleo cultural?',
    options: [
      { id: 'A', text: 'La ocupación vinculada a actividades culturales o creativas.' },
      { id: 'B', text: 'El aforo anual acumulado de los espacios escénicos.' },
      { id: 'C', text: 'El gasto medio por localidad vendida en taquilla.' },
      { id: 'D', text: 'El número de bienes declarados de interés cultural.' }
    ],
    correctOptionId: 'A',
    explanation: 'El empleo cultural agrupa ocupaciones o actividades vinculadas al sector cultural y creativo dentro de la medición estadística.',
    source: sources.cuentaSatelite
  },
  {
    id: 'm3-ref-examgap-es08-001',
    topicId: 'especifico-08',
    prompt: 'En terminología de ballet, ¿qué designa un pas de deux?',
    options: [
      { id: 'A', text: 'Una danza interpretada por dos bailarines.' },
      { id: 'B', text: 'Una variación solista de carácter virtuoso.' },
      { id: 'C', text: 'Una entrada colectiva del cuerpo de baile.' },
      { id: 'D', text: 'Una secuencia de saltos ejecutada en diagonal.' }
    ],
    correctOptionId: 'A',
    explanation: 'Pas de deux significa literalmente “paso de dos” y designa una danza para dos intérpretes dentro del vocabulario del ballet.',
    source: sources.britannicaBallet
  },
  {
    id: 'm3-ref-examgap-es08-002',
    topicId: 'especifico-08',
    prompt: '¿Con qué se identifica históricamente la danza moderna frente al ballet académico?',
    options: [
      { id: 'A', text: 'Con una reacción contra las convenciones del ballet clásico.' },
      { id: 'B', text: 'Con la restauración del repertorio cortesano barroco.' },
      { id: 'C', text: 'Con la codificación académica de danzas de salón.' },
      { id: 'D', text: 'Con la vuelta al academicismo del ballet romántico.' }
    ],
    correctOptionId: 'A',
    explanation: 'La danza moderna se describe históricamente como una reacción frente a las convenciones del ballet clásico y su código académico.',
    source: sources.britannicaModernDance
  },
  {
    id: 'm3-ref-examgap-es08-003',
    topicId: 'especifico-08',
    prompt: '¿Qué caracteriza al Tanztheater asociado a Pina Bausch?',
    options: [
      { id: 'A', text: 'La mezcla de danza, gesto, escena y elementos teatrales.' },
      { id: 'B', text: 'La reconstrucción literal de ballets del siglo XIX.' },
      { id: 'C', text: 'El uso exclusivo de danzas de salón codificadas.' },
      { id: 'D', text: 'La supresión completa de la dimensión dramatúrgica.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Tanztheater integra danza con recursos teatrales, gesto, acción escénica y construcción dramatúrgica.',
    source: sources.britannicaModernDance
  },
  {
    id: 'm3-ref-examgap-es21-001',
    topicId: 'especifico-21',
    prompt: 'En mercadotecnia cultural, ¿qué es la segmentación de públicos?',
    options: [
      { id: 'A', text: 'La división del público en grupos con rasgos o comportamientos comunes.' },
      { id: 'B', text: 'La definición de una única oferta para todos los asistentes.' },
      { id: 'C', text: 'La medición de ocupación total sin distinguir perfiles.' },
      { id: 'D', text: 'La agrupación de sedes según tamaño y titularidad.' }
    ],
    correctOptionId: 'A',
    explanation: 'Segmentar consiste en agrupar públicos según características compartidas para comprenderlos y orientar mejor la oferta o comunicación.',
    source: sources.kotlerScheff
  },
  {
    id: 'm3-ref-examgap-es21-002',
    topicId: 'especifico-21',
    prompt: 'En política de precios culturales, ¿qué es un abono?',
    options: [
      { id: 'A', text: 'Compra agrupada de varias funciones o actividades bajo una modalidad.' },
      { id: 'B', text: 'Entrada de cortesía entregada sin contraprestación económica.' },
      { id: 'C', text: 'Recargo aplicado a localidades adquiridas fuera de taquilla.' },
      { id: 'D', text: 'Invitación reservada a medios durante el estreno oficial.' }
    ],
    correctOptionId: 'A',
    explanation: 'Un abono agrupa varias funciones, sesiones o actividades en una misma modalidad de compra, normalmente con condiciones específicas de precio o acceso.',
    source: sources.kotlerScheff
  },
  {
    id: 'm3-ref-examgap-es35-001',
    topicId: 'especifico-35',
    prompt: 'En vestuario escénico, ¿qué identifica mejor un figurín?',
    options: [
      { id: 'A', text: 'Un dibujo o diseño que define la apariencia del personaje.' },
      { id: 'B', text: 'Un patrón de corte usado para construir la prenda.' },
      { id: 'C', text: 'Una ficha de medidas tomada sobre el intérprete.' },
      { id: 'D', text: 'Una prueba de vestuario previa al estreno.' }
    ],
    correctOptionId: 'A',
    explanation: 'El figurín es una representación gráfica del vestuario y la apariencia del personaje, útil para construir y coordinar la caracterización.',
    source: sources.costume
  },
  {
    id: 'm3-ref-examgap-es35-002',
    topicId: 'especifico-35',
    prompt: 'En caracterización escénica, ¿para qué sirve una prótesis de maquillaje?',
    options: [
      { id: 'A', text: 'Para modificar rasgos físicos visibles del intérprete.' },
      { id: 'B', text: 'Para fijar una peluca sin alterar el rostro del personaje.' },
      { id: 'C', text: 'Para documentar el raccord de maquillaje entre funciones.' },
      { id: 'D', text: 'Para marcar medidas de una prenda sobre el maniquí.' }
    ],
    correctOptionId: 'A',
    explanation: 'Las prótesis de maquillaje se usan para alterar rasgos, volúmenes o aspecto físico del intérprete dentro de la construcción del personaje.',
    source: sources.makeup
  },
  {
    id: 'm3-ref-examgap-es09-001',
    topicId: 'especifico-09',
    prompt: 'En artes circenses, ¿qué es el trapecio?',
    options: [
      { id: 'A', text: 'Un aparato aéreo formado por una barra suspendida.' },
      { id: 'B', text: 'Un número basado en lanzamiento y recepción de objetos.' },
      { id: 'C', text: 'Un aparato de equilibrio sobre cuerda tensada.' },
      { id: 'D', text: 'Una estructura vertical para acrobacia en tela.' }
    ],
    correctOptionId: 'A',
    explanation: 'El trapecio es un aparato aéreo: una barra suspendida mediante cuerdas o cables sobre la que se realizan ejercicios acrobáticos.',
    source: sources.britannicaCircus
  },
  {
    id: 'm3-ref-examgap-es09-002',
    topicId: 'especifico-09',
    prompt: '¿Qué define mejor el malabarismo en el vocabulario circense?',
    options: [
      { id: 'A', text: 'La manipulación coordinada de objetos en movimiento.' },
      { id: 'B', text: 'La doma de animales dentro de una pista circular.' },
      { id: 'C', text: 'La elevación del artista mediante cables ocultos.' },
      { id: 'D', text: 'La caracterización cómica con maquillaje blanco.' }
    ],
    correctOptionId: 'A',
    explanation: 'El malabarismo consiste en manipular objetos manteniéndolos en movimiento de forma coordinada, normalmente con lanzamiento, recepción o equilibrio.',
    source: sources.britannicaCircus
  },
  {
    id: 'm3-ref-examgap-es22-001',
    topicId: 'especifico-22',
    prompt: 'En gestión cultural, ¿qué finalidad tiene el desarrollo de audiencias?',
    options: [
      { id: 'A', text: 'Ampliar, diversificar o profundizar la relación con los públicos.' },
      { id: 'B', text: 'Limitar la relación con el público a la venta de abonos.' },
      { id: 'C', text: 'Medir únicamente la ocupación media de cada función.' },
      { id: 'D', text: 'Concentrar la comunicación en públicos ya fidelizados.' }
    ],
    correctOptionId: 'A',
    explanation: 'Audience development designa estrategias orientadas a ampliar públicos, diversificarlos o profundizar su vínculo con la institución.',
    source: sources.audience
  },
  {
    id: 'm3-ref-examgap-es22-002',
    topicId: 'especifico-22',
    prompt: '¿Qué mide la Encuesta de Hábitos y Prácticas Culturales en España?',
    options: [
      { id: 'A', text: 'Los hábitos, prácticas y consumos culturales de la población.' },
      { id: 'B', text: 'El balance económico anual de cada teatro público.' },
      { id: 'C', text: 'La clasificación presupuestaria de programas ministeriales.' },
      { id: 'D', text: 'El inventario administrativo de bienes culturales protegidos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La encuesta oficial recoge información sobre hábitos y prácticas culturales de la población española, incluida asistencia y participación cultural.',
    source: sources.encuestaHabitos
  },
  {
    id: 'm3-ref-examgap-es23-001',
    topicId: 'especifico-23',
    prompt: 'En planificación comunicativa, ¿qué son los medios propios?',
    options: [
      { id: 'A', text: 'Canales controlados por la entidad, como web o boletín.' },
      { id: 'B', text: 'Espacios pagados contratados a un soporte externo.' },
      { id: 'C', text: 'Impactos informativos obtenidos por cobertura periodística.' },
      { id: 'D', text: 'Conversaciones generadas por usuarios en redes compartidas.' }
    ],
    correctOptionId: 'A',
    explanation: 'Los medios propios son canales controlados por la organización, a diferencia de los pagados o de los ganados por cobertura externa.',
    source: sources.peso
  },
  {
    id: 'm3-ref-examgap-es23-002',
    topicId: 'especifico-23',
    prompt: '¿Qué función cumple un briefing de comunicación de un proyecto cultural?',
    options: [
      { id: 'A', text: 'Sintetizar objetivos, públicos, mensajes y condicionantes.' },
      { id: 'B', text: 'Cerrar un plan de medios con tarifas e inserciones.' },
      { id: 'C', text: 'Recoger métricas obtenidas después de la campaña.' },
      { id: 'D', text: 'Fijar únicamente normas gráficas de identidad visual.' }
    ],
    correctOptionId: 'A',
    explanation: 'El briefing reúne la información básica que orienta una acción de comunicación: objetivos, destinatarios, mensajes, tono, calendario y límites.',
    source: sources.peso
  },
  {
    id: 'm3-ref-examgap-es24-001',
    topicId: 'especifico-24',
    prompt: '¿Qué identifica mejor la mediación cultural?',
    options: [
      { id: 'A', text: 'Procesos que conectan obras, instituciones y públicos.' },
      { id: 'B', text: 'La catalogación técnica de fondos y colecciones.' },
      { id: 'C', text: 'La política de precios, abonos y descuentos.' },
      { id: 'D', text: 'La cesión contractual de salas y equipamientos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La mediación cultural facilita relaciones, interpretación y participación entre públicos, obras e instituciones.',
    source: sources.mediation
  },
  {
    id: 'm3-ref-examgap-es24-002',
    topicId: 'especifico-24',
    prompt: 'Según el marco estadístico cultural de UNESCO, ¿qué encaja con participación cultural activa?',
    options: [
      { id: 'A', text: 'Tocar música, bailar o crear contenidos culturales.' },
      { id: 'B', text: 'Ver una exposición sin intervenir en su producción.' },
      { id: 'C', text: 'Leer una crítica publicada por un medio externo.' },
      { id: 'D', text: 'Consultar una agenda cultural institucional.' }
    ],
    correctOptionId: 'A',
    explanation: 'La participación activa implica crear, interpretar o practicar actividades culturales, no solo asistir o recibir contenidos.',
    source: sources.unescoFcs
  }
];

const byId = new Map(questions.map((question, index) => [question.id, index]));
let added = 0;
let updated = 0;

for (const question of questionsToAdd) {
  const balanced = withBalancedOptionOrder(question);
  const normalized = {
    ...balanced,
    active: true,
    optionCount: 4,
    origin,
    editorialStatus: 'active-reference',
    createdAt: '2026-08-01'
  };
  const existingIndex = byId.get(question.id);
  if (existingIndex === undefined) {
    questions.push(normalized);
    byId.set(question.id, questions.length - 1);
    added += 1;
  } else {
    questions[existingIndex] = { ...questions[existingIndex], ...normalized };
    updated += 1;
  }
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Preguntas propias de referencia añadidas: ${added}; actualizadas: ${updated}`);
