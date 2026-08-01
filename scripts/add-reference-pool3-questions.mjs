import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const existingIds = new Set(questions.map(question => question.id));

const origin = number => ({
  type: 'generated_reference',
  label: 'M3 · banco de referencia · cierre pool3',
  questionNumber: number
});

const ref = ({ reference, author, edition, locator, url, note }) => ({
  kind: 'referencia',
  reference,
  author,
  edition,
  locator,
  url,
  ...(note ? { note } : {})
});

const questionsToAdd = [
  {
    id: 'm3-ref-pool3-especifico-08-001',
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
    source: ref({
      reference: 'Encyclopaedia Britannica, “ballet”',
      author: 'Encyclopaedia Britannica',
      edition: 'entrada en línea',
      locator: 'Vocabulario básico del ballet',
      url: 'https://www.britannica.com/art/ballet'
    }),
    active: true,
    optionCount: 4,
    origin: origin(1)
  },
  {
    id: 'm3-ref-pool3-especifico-08-002',
    topicId: 'especifico-08',
    prompt: '¿Con qué se identifica históricamente la danza moderna frente al ballet académico?',
    options: [
      { id: 'A', text: 'Con la restauración del repertorio cortesano barroco.' },
      { id: 'B', text: 'Con una reacción contra las convenciones del ballet clásico.' },
      { id: 'C', text: 'Con la codificación académica de danzas de salón.' },
      { id: 'D', text: 'Con la vuelta al academicismo del ballet romántico.' }
    ],
    correctOptionId: 'B',
    explanation: 'La danza moderna se describe históricamente como una reacción frente a las convenciones del ballet clásico y su código académico.',
    source: ref({
      reference: 'Encyclopaedia Britannica, “modern dance”',
      author: 'Encyclopaedia Britannica',
      edition: 'entrada en línea',
      locator: 'Definición e historia',
      url: 'https://www.britannica.com/art/modern-dance'
    }),
    active: true,
    optionCount: 4,
    origin: origin(2)
  },
  {
    id: 'm3-ref-pool3-especifico-08-003',
    topicId: 'especifico-08',
    prompt: '¿Qué caracteriza al Tanztheater asociado a Pina Bausch?',
    options: [
      { id: 'A', text: 'La reconstrucción literal de ballets del siglo XIX.' },
      { id: 'B', text: 'El uso exclusivo de danzas de salón codificadas.' },
      { id: 'C', text: 'La mezcla de danza, gesto, escena y elementos teatrales.' },
      { id: 'D', text: 'La supresión completa de la dimensión dramatúrgica.' }
    ],
    correctOptionId: 'C',
    explanation: 'El Tanztheater se asocia a una forma escénica que integra danza con recursos teatrales, gesto, acción y construcción dramatúrgica.',
    source: ref({
      reference: 'Encyclopaedia Britannica, “Pina Bausch”',
      author: 'Encyclopaedia Britannica',
      edition: 'entrada en línea',
      locator: 'Tanztheater',
      url: 'https://www.britannica.com/biography/Pina-Bausch'
    }),
    active: true,
    optionCount: 4,
    origin: origin(3)
  },
  {
    id: 'm3-ref-pool3-especifico-09-001',
    topicId: 'especifico-09',
    prompt: 'En artes circenses, ¿qué es el trapecio?',
    options: [
      { id: 'A', text: 'Un número basado en lanzamiento y recepción de objetos.' },
      { id: 'B', text: 'Un aparato de equilibrio sobre cuerda tensada.' },
      { id: 'C', text: 'Una estructura vertical para acrobacia en tela.' },
      { id: 'D', text: 'Un aparato aéreo formado por una barra suspendida.' }
    ],
    correctOptionId: 'D',
    explanation: 'El trapecio es un aparato aéreo: una barra suspendida mediante cuerdas o cables sobre la que se realizan ejercicios acrobáticos.',
    source: ref({
      reference: 'Encyclopaedia Britannica, “circus”',
      author: 'Encyclopaedia Britannica',
      edition: 'entrada en línea',
      locator: 'Aerial acts and apparatus',
      url: 'https://www.britannica.com/art/circus-theatrical-entertainment'
    }),
    active: true,
    optionCount: 4,
    origin: origin(4)
  },
  {
    id: 'm3-ref-pool3-especifico-09-002',
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
    source: ref({
      reference: 'Encyclopaedia Britannica, “circus”',
      author: 'Encyclopaedia Britannica',
      edition: 'entrada en línea',
      locator: 'Circus skills and acts',
      url: 'https://www.britannica.com/art/circus-theatrical-entertainment'
    }),
    active: true,
    optionCount: 4,
    origin: origin(5)
  },
  {
    id: 'm3-ref-pool3-especifico-10-001',
    topicId: 'especifico-10',
    prompt: 'En el mercado del arte, ¿qué se entiende por mercado primario?',
    options: [
      { id: 'A', text: 'La reventa de obras ya adquiridas por coleccionistas.' },
      { id: 'B', text: 'La primera venta de una obra por artista, estudio o galería.' },
      { id: 'C', text: 'La venta en subasta de obras procedentes de colecciones.' },
      { id: 'D', text: 'La compraventa posterior entre galerías y coleccionistas.' }
    ],
    correctOptionId: 'B',
    explanation: 'El mercado primario se refiere a la primera comercialización de una obra; el secundario corresponde a reventas posteriores.',
    source: ref({
      reference: 'Sotheby’s Institute of Art, “Primary and Secondary Art Markets”',
      author: 'Sotheby’s Institute of Art',
      edition: 'recurso en línea',
      locator: 'Distinción mercado primario/secundario',
      url: 'https://www.sothebysinstitute.com/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(6)
  },
  {
    id: 'm3-ref-pool3-especifico-10-002',
    topicId: 'especifico-10',
    prompt: '¿A qué alude la expresión white cube en la exhibición de artes visuales?',
    options: [
      { id: 'A', text: 'A un almacén técnico para conservación preventiva.' },
      { id: 'B', text: 'A una feria comercial dedicada a galerías privadas.' },
      { id: 'C', text: 'A un espacio expositivo neutro, blanco y descontextualizado.' },
      { id: 'D', text: 'A un soporte cúbico utilizado para escultura pública.' }
    ],
    correctOptionId: 'C',
    explanation: 'White cube designa el modelo de galería blanca, limpia y aparentemente neutral que aísla la obra de otros contextos visuales.',
    source: ref({
      reference: 'Tate, “Art Terms: White Cube”',
      author: 'Tate',
      edition: 'entrada en línea',
      locator: 'Definición',
      url: 'https://www.tate.org.uk/art/art-terms/w/white-cube'
    }),
    active: true,
    optionCount: 4,
    origin: origin(7)
  },
  {
    id: 'm3-ref-pool3-especifico-10-003',
    topicId: 'especifico-10',
    prompt: '¿Qué caracteriza a una instalación artística?',
    options: [
      { id: 'A', text: 'La producción seriada de copias idénticas.' },
      { id: 'B', text: 'La restauración material de una obra antigua.' },
      { id: 'C', text: 'La catalogación documental de fondos museísticos.' },
      { id: 'D', text: 'La configuración de una obra en relación con un espacio.' }
    ],
    correctOptionId: 'D',
    explanation: 'La instalación se define por la relación entre obra, espacio y experiencia del espectador, más que por un objeto aislado.',
    source: ref({
      reference: 'Tate, “Art Terms: Installation Art”',
      author: 'Tate',
      edition: 'entrada en línea',
      locator: 'Definición',
      url: 'https://www.tate.org.uk/art/art-terms/i/installation-art'
    }),
    active: true,
    optionCount: 4,
    origin: origin(8)
  },
  {
    id: 'm3-ref-pool3-especifico-19-001',
    topicId: 'especifico-19',
    prompt: '¿Qué dimensiones recoge una matriz DAFO?',
    options: [
      { id: 'A', text: 'Debilidades, amenazas, fortalezas y oportunidades.' },
      { id: 'B', text: 'Diagnóstico, alcance, financiación y organigrama.' },
      { id: 'C', text: 'Demanda, audiencia, fondos y operación.' },
      { id: 'D', text: 'Diseño, activación, formato y objetivos.' }
    ],
    correctOptionId: 'A',
    explanation: 'DAFO es el acrónimo de debilidades, amenazas, fortalezas y oportunidades; combina análisis interno y externo.',
    source: ref({
      reference: 'Ministerio de Industria, Comercio y Turismo, “Herramienta DAFO”',
      author: 'Ministerio de Industria, Comercio y Turismo',
      edition: 'recurso en línea',
      locator: 'Definición DAFO',
      url: 'https://dafo.ipyme.org/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(9)
  },
  {
    id: 'm3-ref-pool3-especifico-19-002',
    topicId: 'especifico-19',
    prompt: '¿Qué expresa el retorno social de la inversión, conocido como SROI?',
    options: [
      { id: 'A', text: 'El número bruto de entradas vendidas en taquilla.' },
      { id: 'B', text: 'La relación entre valor social generado e inversión realizada.' },
      { id: 'C', text: 'El coste contable de producción por localidad ofertada.' },
      { id: 'D', text: 'La diferencia entre ingresos propios y subvención pública.' }
    ],
    correctOptionId: 'B',
    explanation: 'El SROI traduce a una relación el valor social generado por una intervención respecto a los recursos invertidos.',
    source: ref({
      reference: 'Social Value International, “A Guide to Social Return on Investment”',
      author: 'Social Value International',
      edition: '2012',
      locator: 'Concepto de SROI',
      url: 'https://www.socialvalueint.org/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(10)
  },
  {
    id: 'm3-ref-pool3-especifico-19-003',
    topicId: 'especifico-19',
    prompt: 'En evaluación de proyectos, ¿qué diferencia un resultado de una realización?',
    options: [
      { id: 'A', text: 'La realización describe recursos asignados al proyecto.' },
      { id: 'B', text: 'El resultado enumera actividades ejecutadas por el gestor.' },
      { id: 'C', text: 'El resultado describe cambios; la realización, entregables.' },
      { id: 'D', text: 'La realización mide efectos sociales posteriores al cierre.' }
    ],
    correctOptionId: 'C',
    explanation: 'En la cadena de resultados, las realizaciones son productos o servicios entregados; los resultados son cambios o efectos derivados.',
    source: ref({
      reference: 'European Commission, Better Regulation Toolbox',
      author: 'European Commission',
      edition: '2021',
      locator: 'Intervention logic: outputs, results and impacts',
      url: 'https://commission.europa.eu/law/law-making-process/planning-and-proposing-law/better-regulation_en'
    }),
    active: true,
    optionCount: 4,
    origin: origin(11)
  },
  {
    id: 'm3-ref-pool3-especifico-21-001',
    topicId: 'especifico-21',
    prompt: 'En mercadotecnia cultural, ¿qué es la segmentación de públicos?',
    options: [
      { id: 'A', text: 'La definición de una única oferta para todos los asistentes.' },
      { id: 'B', text: 'La medición de ocupación total sin distinguir perfiles.' },
      { id: 'C', text: 'La agrupación de sedes según tamaño y titularidad.' },
      { id: 'D', text: 'La división del público en grupos con rasgos o comportamientos comunes.' }
    ],
    correctOptionId: 'D',
    explanation: 'Segmentar consiste en agrupar públicos o mercados según características compartidas para comprenderlos y orientar mejor la oferta o comunicación.',
    source: ref({
      reference: 'Philip Kotler y Joanne Scheff, Standing Room Only: Strategies for Marketing the Performing Arts',
      author: 'Philip Kotler; Joanne Scheff',
      edition: 'Harvard Business School Press, 1997',
      locator: 'Capítulos sobre segmentación y públicos',
      url: 'https://archive.org/details/standingroomonly00kotl'
    }),
    active: true,
    optionCount: 4,
    origin: origin(12)
  },
  {
    id: 'm3-ref-pool3-especifico-21-002',
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
    source: ref({
      reference: 'Philip Kotler y Joanne Scheff, Standing Room Only: Strategies for Marketing the Performing Arts',
      author: 'Philip Kotler; Joanne Scheff',
      edition: 'Harvard Business School Press, 1997',
      locator: 'Estrategias de precios, abonos y públicos',
      url: 'https://archive.org/details/standingroomonly00kotl'
    }),
    active: true,
    optionCount: 4,
    origin: origin(24)
  },
  {
    id: 'm3-ref-pool3-especifico-22-001',
    topicId: 'especifico-22',
    prompt: 'En gestión cultural, ¿qué finalidad tiene el desarrollo de audiencias?',
    options: [
      { id: 'A', text: 'Ampliar, diversificar o profundizar la relación con los públicos.' },
      { id: 'B', text: 'Limitar la relación con el público a la venta de abonos.' },
      { id: 'C', text: 'Medir únicamente la ocupación media de cada función.' },
      { id: 'D', text: 'Concentrar la comunicación en públicos ya fidelizados.' }
    ],
    correctOptionId: 'A',
    explanation: 'Audience development se usa para designar estrategias orientadas a ampliar públicos, diversificarlos o profundizar su vínculo con la institución.',
    source: ref({
      reference: 'European Commission, Study on Audience Development',
      author: 'European Commission',
      edition: '2017',
      locator: 'Definición de audience development',
      url: 'https://op.europa.eu/en/publication-detail/-/publication/cc36509d-19c6-11e7-808e-01aa75ed71a1'
    }),
    active: true,
    optionCount: 4,
    origin: origin(13)
  },
  {
    id: 'm3-ref-pool3-especifico-22-002',
    topicId: 'especifico-22',
    prompt: '¿Qué mide la Encuesta de Hábitos y Prácticas Culturales en España?',
    options: [
      { id: 'A', text: 'El balance económico anual de cada teatro público.' },
      { id: 'B', text: 'Los hábitos, prácticas y consumos culturales de la población.' },
      { id: 'C', text: 'La clasificación presupuestaria de los programas ministeriales.' },
      { id: 'D', text: 'El inventario administrativo de bienes culturales protegidos.' }
    ],
    correctOptionId: 'B',
    explanation: 'La encuesta oficial recoge información sobre hábitos y prácticas culturales de la población española, incluida asistencia y participación cultural.',
    source: ref({
      reference: 'Ministerio de Cultura, Encuesta de Hábitos y Prácticas Culturales en España',
      author: 'Ministerio de Cultura',
      edition: 'operación estadística oficial',
      locator: 'Descripción de la operación',
      url: 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/ehc.html'
    }),
    active: true,
    optionCount: 4,
    origin: origin(14)
  },
  {
    id: 'm3-ref-pool3-especifico-23-001',
    topicId: 'especifico-23',
    prompt: 'En planificación comunicativa, ¿qué son los medios propios?',
    options: [
      { id: 'A', text: 'Espacios pagados contratados a un soporte externo.' },
      { id: 'B', text: 'Impactos informativos obtenidos por cobertura periodística.' },
      { id: 'C', text: 'Canales controlados por la entidad, como web o boletín.' },
      { id: 'D', text: 'Conversaciones generadas por usuarios en redes compartidas.' }
    ],
    correctOptionId: 'C',
    explanation: 'Los medios propios son canales controlados por la organización, a diferencia de los pagados o de los ganados por cobertura externa.',
    source: ref({
      reference: 'Gini Dietrich, Spin Sucks: Communication and Reputation Management in the Digital Age',
      author: 'Gini Dietrich',
      edition: 'Que Publishing, 2014',
      locator: 'PESO model: paid, earned, shared, owned media',
      url: 'https://spinsucks.com/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(15)
  },
  {
    id: 'm3-ref-pool3-especifico-23-002',
    topicId: 'especifico-23',
    prompt: '¿Qué función cumple un briefing de comunicación de un proyecto cultural?',
    options: [
      { id: 'A', text: 'Cerrar un plan de medios con tarifas e inserciones.' },
      { id: 'B', text: 'Recoger impactos obtenidos tras la campaña.' },
      { id: 'C', text: 'Fijar normas gráficas de identidad visual.' },
      { id: 'D', text: 'Sintetizar objetivos, públicos, mensajes y condicionantes.' }
    ],
    correctOptionId: 'D',
    explanation: 'El briefing reúne la información básica que orienta una acción de comunicación: objetivos, destinatarios, mensajes, tono, calendario y límites.',
    source: ref({
      reference: 'Paul A. Argenti, Corporate Communication',
      author: 'Paul A. Argenti',
      edition: 'McGraw-Hill, 7.ª ed.',
      locator: 'Planning and communication strategy',
      url: 'https://www.mheducation.com/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(16)
  },
  {
    id: 'm3-ref-pool3-especifico-24-001',
    topicId: 'especifico-24',
    prompt: '¿Qué identifica mejor la mediación cultural?',
    options: [
      { id: 'A', text: 'Procesos que conectan obras, instituciones y públicos.' },
      { id: 'B', text: 'La catalogación técnica de fondos y colecciones.' },
      { id: 'C', text: 'La política de precios, abonos y descuentos.' },
      { id: 'D', text: 'La cesión contractual de salas y equipamientos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La mediación cultural se entiende como un conjunto de prácticas que facilitan relaciones, interpretación y participación entre públicos, obras e instituciones.',
    source: ref({
      reference: 'Institute for Art Education, Time for Cultural Mediation',
      author: 'Institute for Art Education, Zurich University of the Arts',
      edition: '2012',
      locator: 'Concepto de cultural mediation',
      url: 'https://www.kultur-vermittlung.ch/time-for-cultural-mediation/'
    }),
    active: true,
    optionCount: 4,
    origin: origin(17)
  },
  {
    id: 'm3-ref-pool3-especifico-24-002',
    topicId: 'especifico-24',
    prompt: 'Según el marco estadístico cultural de UNESCO, ¿qué ejemplo encaja con participación cultural activa?',
    options: [
      { id: 'A', text: 'Ver una exposición sin intervenir en su producción.' },
      { id: 'B', text: 'Tocar música, bailar o crear contenidos culturales.' },
      { id: 'C', text: 'Leer una crítica publicada por un medio externo.' },
      { id: 'D', text: 'Consultar una agenda cultural institucional.' }
    ],
    correctOptionId: 'B',
    explanation: 'La participación activa implica crear, interpretar o practicar actividades culturales, no solo asistir o recibir contenidos.',
    source: ref({
      reference: 'UNESCO Institute for Statistics, 2009 UNESCO Framework for Cultural Statistics',
      author: 'UNESCO Institute for Statistics',
      edition: '2009',
      locator: 'Cultural participation',
      url: 'https://uis.unesco.org/sites/default/files/documents/unesco-framework-for-cultural-statistics-2009-en_0.pdf'
    }),
    active: true,
    optionCount: 4,
    origin: origin(18)
  },
  {
    id: 'm3-ref-pool3-especifico-25-001',
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
    source: ref({
      reference: 'Donald Getz, Event Studies: Theory, Research and Policy for Planned Events',
      author: 'Donald Getz',
      edition: 'Routledge, 2.ª ed., 2012',
      locator: 'Festivals and planned events',
      url: 'https://www.routledge.com/Event-Studies/Getz/p/book/9780080966037'
    }),
    active: true,
    optionCount: 4,
    origin: origin(19)
  },
  {
    id: 'm3-ref-pool3-especifico-25-002',
    topicId: 'especifico-25',
    prompt: 'En programación artística, ¿qué tarea se asocia al comisariado?',
    options: [
      { id: 'A', text: 'Ordenar fechas de sala sin construir una línea discursiva.' },
      { id: 'B', text: 'Seleccionar obras y articularlas en un discurso expositivo.' },
      { id: 'C', text: 'Diseñar únicamente la campaña gráfica de temporada.' },
      { id: 'D', text: 'Cerrar necesidades técnicas y presupuestos de gira.' }
    ],
    correctOptionId: 'B',
    explanation: 'El comisariado implica seleccionar, ordenar e interpretar obras o propuestas dentro de un marco discursivo.',
    source: ref({
      reference: 'Tate, “Art Terms: Curator”',
      author: 'Tate',
      edition: 'entrada en línea',
      locator: 'Definición de curator',
      url: 'https://www.tate.org.uk/art/art-terms/c/curator'
    }),
    active: true,
    optionCount: 4,
    origin: origin(20)
  },
  {
    id: 'm3-ref-pool3-especifico-25-003',
    topicId: 'especifico-25',
    prompt: 'En artes escénicas, ¿qué es un circuito de programación?',
    options: [
      { id: 'A', text: 'Una red que facilita la circulación de espectáculos entre espacios.' },
      { id: 'B', text: 'Una programación concentrada en pocos días bajo una marca.' },
      { id: 'C', text: 'Una temporada regular de una única sede escénica.' },
      { id: 'D', text: 'Una residencia centrada en el proceso de creación.' }
    ],
    correctOptionId: 'A',
    explanation: 'Un circuito articula varios espacios, programadores o instituciones para favorecer la circulación y exhibición de espectáculos.',
    source: ref({
      reference: 'INAEM, Programa Platea',
      author: 'Instituto Nacional de las Artes Escénicas y de la Música',
      edition: 'programa institucional',
      locator: 'Circulación de espectáculos por espacios escénicos',
      url: 'https://www.cultura.gob.es/cultura/artesescenicas/platea.html'
    }),
    active: true,
    optionCount: 4,
    origin: origin(21)
  },
  {
    id: 'm3-ref-pool3-especifico-27-001',
    topicId: 'especifico-27',
    prompt: '¿Qué finalidad tiene la Cuenta Satélite de la Cultura en España?',
    options: [
      { id: 'A', text: 'Registrar las entradas vendidas por cada espacio escénico.' },
      { id: 'B', text: 'Estimar el peso económico de la cultura en la contabilidad nacional.' },
      { id: 'C', text: 'Clasificar expedientes de contratación por tipo de procedimiento.' },
      { id: 'D', text: 'Inventariar únicamente bienes inmuebles declarados protegidos.' }
    ],
    correctOptionId: 'B',
    explanation: 'La Cuenta Satélite de la Cultura es una operación estadística de síntesis orientada a estimar la contribución económica del sector cultural.',
    source: ref({
      reference: 'Ministerio de Cultura, Cuenta Satélite de la Cultura en España',
      author: 'Ministerio de Cultura',
      edition: 'metodología oficial',
      locator: 'Descripción metodológica',
      url: 'https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/culturabase/cuenta-satelite/metodologia-cuenta.html'
    }),
    active: true,
    optionCount: 4,
    origin: origin(22)
  },
  {
    id: 'm3-ref-pool3-especifico-27-002',
    topicId: 'especifico-27',
    prompt: 'En economía de la cultura, ¿qué describe la cadena de valor cultural?',
    options: [
      { id: 'A', text: 'La jerarquía funcionarial de un organismo cultural.' },
      { id: 'B', text: 'La sucesión de trámites de un expediente administrativo.' },
      { id: 'C', text: 'Las fases de creación, producción, distribución, exhibición y consumo.' },
      { id: 'D', text: 'El cálculo de intereses de una operación financiera.' }
    ],
    correctOptionId: 'C',
    explanation: 'La cadena de valor cultural ordena las fases mediante las que un bien o servicio cultural se crea, produce, distribuye, exhibe y llega a sus públicos.',
    source: ref({
      reference: 'UNESCO Institute for Statistics, 2009 UNESCO Framework for Cultural Statistics',
      author: 'UNESCO Institute for Statistics',
      edition: '2009',
      locator: 'Cultural cycle',
      url: 'https://uis.unesco.org/sites/default/files/documents/unesco-framework-for-cultural-statistics-2009-en_0.pdf'
    }),
    active: true,
    optionCount: 4,
    origin: origin(23)
  }
];

const existingById = new Map(questions.map((question, index) => [question.id, index]));
let added = 0;
let updated = 0;
const draftReason = 'Borrador no activo: en temas específicos sin legislación no se añaden distractores nuevos para simular formato de cuatro opciones.';
for (const question of questionsToAdd) {
  const normalizedQuestion = {
    ...question,
    active: false,
    editorialStatus: 'draft-nonlegal-reference',
    draftReason
  };
  const existingIndex = existingById.get(question.id);
  if (existingIndex === undefined) {
    questions.push(normalizedQuestion);
    existingById.set(question.id, questions.length - 1);
    added += 1;
  } else {
    questions[existingIndex] = {
      ...questions[existingIndex],
      ...normalizedQuestion
    };
    updated += 1;
  }
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Preguntas de referencia en borrador añadidas: ${added}; actualizadas: ${updated}`);
