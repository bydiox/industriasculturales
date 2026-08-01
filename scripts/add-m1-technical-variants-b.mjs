import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const baseOrigin = id => ({
  type: 'own_variant',
  variantOf: id,
  label: `Variante propia B de ${id}`,
  basedOn: 'Pregunta oficial M1 Cultura 2023',
  historical: false
});

const cncp = ({ reference, url, anchorId }) => ({
  kind: 'bibliografia',
  reference,
  url,
  file: 'sources/cncp-technical.html',
  anchorId
});

const rd2816 = (anchorId, reference) => ({
  lawId: 'rd-2816-1982',
  anchorId,
  reference,
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1982-28915'
});

const art524 = cncp({
  reference: 'ART524_3, Maquinaria escénica para el espectáculo en vivo',
  url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634',
  anchorId: 'cncp-art524-3-contenidos'
});

const art523 = cncp({
  reference: 'ART523_3, Construcción de decorados para la escena',
  url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634',
  anchorId: 'cncp-art523-3-contenidos'
});

const ims075 = cncp({
  reference: 'IMS075_3, Luminotecnia para el espectáculo en vivo',
  url: 'https://www.boe.es/eli/es/o/2019/07/18/pci797',
  anchorId: 'cncp-ims075-3-contenidos'
});

const ims436 = cncp({
  reference: 'IMS436_2, Operaciones de sonido',
  url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972',
  anchorId: 'cncp-ims436-2-contenidos'
});

const ims439 = cncp({
  reference: 'IMS439_3, Desarrollo y control de sonido en vivo',
  url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972',
  anchorId: 'cncp-ims439-3-contenidos'
});

const variants = [
  {
    id: 'm1-cultura-maquinaria-2023-37-B',
    topicId: 'especifico-30',
    prompt: 'Según el RD 2816/1982, en instalaciones eventuales, portátiles o desmontables, ¿qué debe comprobarse en relación con el montaje?',
    options: [
      { id: 'A', text: 'La inspección del montaje y la comprobación de su funcionamiento.' },
      { id: 'B', text: 'La clasificación artística del espectáculo por su género.' },
      { id: 'C', text: 'La liquidación económica completa de la gira.' },
      { id: 'D', text: 'La selección del reparto y del equipo creativo.' }
    ],
    correctOptionId: 'A',
    explanation: 'El artículo 35 del RD 2816/1982 prevé requisitos y condiciones para inspeccionar el montaje y comprobar el funcionamiento de locales o instalaciones eventuales, portátiles o desmontables.',
    source: rd2816('rd-2816-1982-art35', 'RD 2816/1982, artículo 35'),
    origin: baseOrigin('m1-cultura-maquinaria-2023-37'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-maquinaria-2023-55-B',
    topicId: 'especifico-30',
    prompt: 'Según el RD 2816/1982, ¿cómo deben tratarse las instalaciones eventuales cuando no tengan regla especial propia?',
    options: [
      { id: 'A', text: 'Aplicando por analogía las normas del Reglamento y las condiciones de la autoridad competente.' },
      { id: 'B', text: 'Eximiéndolas de control por ser instalaciones no permanentes.' },
      { id: 'C', text: 'Sustituyendo la licencia por una comunicación artística.' },
      { id: 'D', text: 'Limitando la revisión al precio de las localidades.' }
    ],
    correctOptionId: 'A',
    explanation: 'El artículo 35 del RD 2816/1982 indica que estas instalaciones se adaptarán a reglamentos especiales, se aplicarán por analogía las normas del Reglamento y se cumplirán condiciones de las autoridades competentes.',
    source: rd2816('rd-2816-1982-art35', 'RD 2816/1982, artículo 35'),
    origin: baseOrigin('m1-cultura-maquinaria-2023-55'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-64-B',
    topicId: 'especifico-31',
    prompt: 'Según ART523_3, ¿qué documento resulta básico para construir o adaptar decorados al espacio escénico?',
    options: [
      { id: 'A', text: 'Diseños y planos del decorado y del espacio de representación.' },
      { id: 'B', text: 'Una relación de cortesías y protocolo institucional.' },
      { id: 'C', text: 'El calendario de pagos de la taquilla anticipada.' },
      { id: 'D', text: 'La plantilla de nóminas del personal administrativo.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART523_3 se centra en interpretar diseños y planos para construir, montar y adaptar decorados al espacio de representación.',
    source: art523,
    origin: baseOrigin('m1-cultura-asistencia-2023-64'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-65-B',
    topicId: 'especifico-31',
    prompt: 'Según ART523_3, ¿qué relación debe existir entre decorado y espacio de representación?',
    options: [
      { id: 'A', text: 'El decorado debe montarse y adaptarse al espacio concreto de representación.' },
      { id: 'B', text: 'El decorado debe ignorar las medidas del espacio para conservar su diseño.' },
      { id: 'C', text: 'El espacio se define únicamente por la campaña de comunicación.' },
      { id: 'D', text: 'La escenografía se sustituye siempre por archivo audiovisual.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente ART523_3 incluye construcción, montaje y adaptación de decorados y elementos escenográficos al espacio de representación.',
    source: art523,
    origin: baseOrigin('m1-cultura-asistencia-2023-65'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-67-B',
    topicId: 'especifico-31',
    prompt: 'Según ART524_3, ¿qué conjunto pertenece al trabajo de maquinaria escénica?',
    options: [
      { id: 'A', text: 'Bastidores, rampas, practicables y otros componentes de la caja escénica.' },
      { id: 'B', text: 'Notas de prensa, cartelería exterior y clipping de medios.' },
      { id: 'C', text: 'Abonos, descuentos, tarifas y campañas de fidelización.' },
      { id: 'D', text: 'Expedientes de subvención, reintegros y recursos administrativos.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART524_3 recoge elementos y estructuras de maquinaria escénica como bastidores, rampas, practicables, forillos y otros componentes.',
    source: art524,
    origin: baseOrigin('m1-cultura-asistencia-2023-67'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-68-B',
    topicId: 'especifico-32',
    prompt: 'Según ART524_3, ¿qué tarea forma parte del ciclo de trabajo de la maquinaria escénica?',
    options: [
      { id: 'A', text: 'Montaje, desmontaje, almacenamiento y mantenimiento de elementos escénicos.' },
      { id: 'B', text: 'Diseño de la estrategia de públicos de la temporada.' },
      { id: 'C', text: 'Tramitación de ayudas en régimen de concurrencia competitiva.' },
      { id: 'D', text: 'Redacción del plan editorial de comunicación institucional.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART524_3 menciona expresamente montaje, desmontaje, almacenamiento y mantenimiento de elementos escénicos.',
    source: art524,
    origin: baseOrigin('m1-cultura-asistencia-2023-68'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-75-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS439_3, ¿qué elementos forman parte del desarrollo y control del sonido en vivo?',
    options: [
      { id: 'A', text: 'Señal, patch, control, escucha y coordinación con escena.' },
      { id: 'B', text: 'Taquilla, protocolo, abonos y plan de patrocinios.' },
      { id: 'C', text: 'Licencia urbanística, aforo contable y reintegro.' },
      { id: 'D', text: 'Inventario museístico, depósito legal y préstamo bibliotecario.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS439_3 se presenta como referencia para diseñar, documentar, probar y operar sistemas de sonido en directo, considerando señal, patch, control y escucha.',
    source: ims439,
    origin: baseOrigin('m1-cultura-asistencia-2023-75'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-77-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS439_3, ¿qué debe documentarse al preparar un sistema de sonido en vivo?',
    options: [
      { id: 'A', text: 'La señal, el patch, el control y la escucha del sistema.' },
      { id: 'B', text: 'La memoria económica de una subvención pública.' },
      { id: 'C', text: 'La relación de miembros del patronato de una fundación.' },
      { id: 'D', text: 'El régimen de incompatibilidades del personal funcionario.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS439_3 incluye diseño, documentación, prueba y operación de sistemas de sonido en directo, con atención a señal, patch, control y escucha.',
    source: ims439,
    origin: baseOrigin('m1-cultura-asistencia-2023-77'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-78-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS436_2, ¿qué fases aparecen en la operación básica de sistemas de sonido?',
    options: [
      { id: 'A', text: 'Preparación, prueba, operación y desmontaje de equipos.' },
      { id: 'B', text: 'Convocatoria, baremación, nombramiento y toma de posesión.' },
      { id: 'C', text: 'Aprobación, compromiso, reconocimiento y pago presupuestario.' },
      { id: 'D', text: 'Catalogación, depósito, préstamo e inventario bibliográfico.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS436_2 se describe como referencia para montaje y operación básica de sistemas de sonido e intercomunicación, con preparación, prueba, operación y desmontaje.',
    source: ims436,
    origin: baseOrigin('m1-cultura-asistencia-2023-78'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-79-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS436_2, ¿a qué ámbito pertenece el montaje y operación básica de sistemas de intercomunicación?',
    options: [
      { id: 'A', text: 'A las operaciones de sonido en espectáculos y eventos.' },
      { id: 'B', text: 'A la gestión tributaria de entidades culturales.' },
      { id: 'C', text: 'A la tutela administrativa del patrimonio inmueble.' },
      { id: 'D', text: 'A la selección de personal laboral fijo.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS436_2 incluye sistemas de sonido e intercomunicación en espectáculos, con montaje, prueba, operación y desmontaje.',
    source: ims436,
    origin: baseOrigin('m1-cultura-asistencia-2023-79'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-80-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS439_3, ¿qué comprobación encaja con la prueba de un sistema de sonido en directo?',
    options: [
      { id: 'A', text: 'Revisar señal, control y escucha antes de la operación.' },
      { id: 'B', text: 'Valorar el mérito artístico de una candidatura.' },
      { id: 'C', text: 'Resolver el expediente de reintegro de una ayuda.' },
      { id: 'D', text: 'Aprobar los estatutos de una asociación cultural.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS439_3 incluye probar y operar sistemas de sonido en directo considerando señal, control y escucha.',
    source: ims439,
    origin: baseOrigin('m1-cultura-asistencia-2023-80'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-81-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS439_3, ¿qué dimensión debe coordinarse en la operación de sonido durante una función?',
    options: [
      { id: 'A', text: 'La coordinación con escena y la seguridad del montaje.' },
      { id: 'B', text: 'La aprobación de precios públicos y bonificaciones.' },
      { id: 'C', text: 'La inscripción registral de una entidad sin ánimo de lucro.' },
      { id: 'D', text: 'La liquidación del impuesto de sociedades.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS439_3 menciona la coordinación con escena y la seguridad de montaje dentro del desarrollo y control del sonido en vivo.',
    source: ims439,
    origin: baseOrigin('m1-cultura-asistencia-2023-81'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-88-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS075_3, ¿qué elementos se coordinan en la planificación de una instalación luminotécnica?',
    options: [
      { id: 'A', text: 'Aparatos, líneas, dimmers y sistemas de control.' },
      { id: 'B', text: 'Abonos, precios públicos, taquilla y protocolo.' },
      { id: 'C', text: 'Reintegros, recursos, notificaciones y sanciones.' },
      { id: 'D', text: 'Patronato, protectorado, fundación y depósito legal.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS075_3 incluye la planificación del montaje y distribución de aparatos, líneas, dimmers y sistemas de control.',
    source: ims075,
    origin: baseOrigin('m1-cultura-asistencia-2023-88'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-89-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS075_3, ¿con qué se relacionan los dimmers en luminotecnia escénica?',
    options: [
      { id: 'A', text: 'Con la regulación de la iluminación y los sistemas de control.' },
      { id: 'B', text: 'Con la captación de sonido mediante micrófonos inalámbricos.' },
      { id: 'C', text: 'Con la venta anticipada de localidades y abonos.' },
      { id: 'D', text: 'Con la catalogación de fondos documentales.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS075_3 incluye la planificación de aparatos, líneas, dimmers y sistemas de control dentro de la luminotecnia para espectáculo en vivo.',
    source: ims075,
    origin: baseOrigin('m1-cultura-asistencia-2023-89'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-90-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS075_3, ¿qué aspecto forma parte del trabajo de enfoque y ajuste de la iluminación escénica?',
    options: [
      { id: 'A', text: 'Ángulos, posiciones, recortes, enfoque y color.' },
      { id: 'B', text: 'Auditoría contable, reintegro y justificación de gastos.' },
      { id: 'C', text: 'Inscripción registral, patronato y protectorado.' },
      { id: 'D', text: 'Clasificación profesional, trienios y permisos.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS075_3 recoge ángulos, posiciones, recortes, enfoque, color y documentación en la iluminación escénica.',
    source: ims075,
    origin: baseOrigin('m1-cultura-asistencia-2023-90'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-91-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS075_3, ¿qué debe coordinarse con el diseño de puesta en escena en un montaje luminotécnico?',
    options: [
      { id: 'A', text: 'El enfoque, el color, los recortes y la documentación de iluminación.' },
      { id: 'B', text: 'La publicación de bases de subvenciones y recursos.' },
      { id: 'C', text: 'La contratación laboral del elenco artístico.' },
      { id: 'D', text: 'La clasificación presupuestaria del organismo autónomo.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS075_3 vincula la documentación y coordinación luminotécnica con el diseño de la puesta en escena.',
    source: ims075,
    origin: baseOrigin('m1-cultura-asistencia-2023-91'),
    active: true,
    optionCount: 4
  },
  {
    id: 'm1-cultura-asistencia-2023-92-B',
    topicId: 'especifico-33',
    prompt: 'Según IMS075_3, ¿qué elementos se planifican en el montaje de iluminación escénica?',
    options: [
      { id: 'A', text: 'Aparatos, líneas, dimmers y sistemas de control.' },
      { id: 'B', text: 'Abonos, precios, descuentos y campañas de captación.' },
      { id: 'C', text: 'Expedientes, recursos, plazos y notificaciones.' },
      { id: 'D', text: 'Inventarios, depósitos, préstamos y bajas patrimoniales.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS075_3 menciona la planificación del montaje y distribución de aparatos, líneas, dimmers y sistemas de control.',
    source: ims075,
    origin: baseOrigin('m1-cultura-asistencia-2023-92'),
    active: true,
    optionCount: 4
  }
];

const byId = new Map(questions.map((question, index) => [question.id, index]));
let added = 0;
let updated = 0;

for (const variant of variants) {
  const existingIndex = byId.get(variant.id);
  if (existingIndex === undefined) {
    questions.push(variant);
    byId.set(variant.id, questions.length - 1);
    added += 1;
  } else {
    questions[existingIndex] = { ...questions[existingIndex], ...variant };
    updated += 1;
  }
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Variantes B añadidas: ${added}; actualizadas: ${updated}`);
