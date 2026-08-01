import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const optionIds = ['A', 'B', 'C', 'D'];

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

function bibliografia(reference, file, anchorId, url) {
  return { kind: 'bibliografia', reference, file, anchorId, url };
}

function official(reference) {
  return { kind: 'official_exam', reference };
}

const officialVariantPolicy = {
  createdAt: '2026-08-01',
  rule: 'Variante propia con cuatro opciones; la pregunta oficial original conserva su formato histórico.'
};

const originFinal = {
  type: 'generated_reference',
  label: 'M3 · cierre pool5 desde fuentes técnicas y referencias · 2026-08-01',
  historical: false
};

const items = [
  {
    id: 'm3-2021-oficial-036-B',
    topicId: 'especifico-06',
    prompt: '¿Qué se entiende por teatro victoriano?',
    options: [
      { id: 'A', text: 'Teatro inglés del reinado de Victoria, entre 1837 y 1901.' },
      { id: 'B', text: 'Teatro francés del reinado de Luis XIV, entre 1643 y 1715.' },
      { id: 'C', text: 'Teatro musical vienés vinculado a la opereta decimonónica.' },
      { id: 'D', text: 'Teatro madrileño ligado al género chico de corta duración.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial identifica el teatro victoriano con la producción teatral inglesa de la época de la reina Victoria, 1837-1901.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 36'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-036', label: 'Variante propia B de m3-2021-oficial-036', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm1-cultura-iluminacion-2023-33-B',
    topicId: 'especifico-06',
    prompt: 'Dentro de los géneros menores del teatro, ¿qué caracteriza al entremés?',
    options: [
      { id: 'A', text: 'Pieza breve de carácter cómico representada en el entreacto de una comedia.' },
      { id: 'B', text: 'Pieza trágica extensa dividida en cinco actos y de asunto heroico.' },
      { id: 'C', text: 'Representación unipersonal de carácter lírico sin acción dramática.' },
      { id: 'D', text: 'Escena religiosa medieval organizada en torno a episodios bíblicos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El entremés es una pieza breve y cómica, tradicionalmente representada entre actos de una obra principal.',
    source: official('Cuestionario M1 Iluminación, Captación y Tratamiento de Imagen, turno libre, pregunta 33. Ministerio de Cultura y Deporte, 25/11/2023.'),
    origin: { type: 'own_variant', variantOf: 'm1-cultura-iluminacion-2023-33', label: 'Variante propia B de m1-cultura-iluminacion-2023-33', basedOn: 'Pregunta oficial M1 Cultura 2023', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm1-cultura-maquinaria-2023-41-B',
    topicId: 'especifico-06',
    prompt: 'En el teatro clásico español, ¿cómo se llama el espacio de representación nacido de los patios interiores de casas?',
    options: [
      { id: 'A', text: 'Corral de comedias.' },
      { id: 'B', text: 'Teatro a la italiana.' },
      { id: 'C', text: 'Sala isabelina.' },
      { id: 'D', text: 'Odeón cortesano.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial señala el corral de comedias como el espacio vinculado a los patios interiores en el teatro clásico español.',
    source: official('Cuestionario M1 Maquinaria Escénica para el Espectáculo en Vivo, turno libre, pregunta 41. Ministerio de Cultura y Deporte, 25/11/2023.'),
    origin: { type: 'own_variant', variantOf: 'm1-cultura-maquinaria-2023-41', label: 'Variante propia B de m1-cultura-maquinaria-2023-41', basedOn: 'Pregunta oficial M1 Cultura 2023', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-2021-oficial-063-B',
    topicId: 'especifico-07',
    prompt: '¿Qué elemento común caracteriza al denominado género chico?',
    options: [
      { id: 'A', text: 'La menor duración de las obras y la posibilidad de varios pases diarios.' },
      { id: 'B', text: 'El predominio del recitativo continuo y de la acción cantada.' },
      { id: 'C', text: 'La representación en grandes teatros de ópera italianos.' },
      { id: 'D', text: 'El formato de concierto lírico sin escenas costumbristas.' }
    ],
    correctOptionId: 'A',
    explanation: 'La clave oficial del género chico es la reducción de duración, que facilitaba varios pases diarios y abarataba precios.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 63'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-063', label: 'Variante propia B de m3-2021-oficial-063', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-2021-oficial-066-B',
    topicId: 'especifico-07',
    prompt: '¿Cuál de estos ciclos de lied fue compuesto por Robert Schumann?',
    options: [
      { id: 'A', text: 'Dichterliebe.' },
      { id: 'B', text: 'Winterreise.' },
      { id: 'C', text: 'Vier letzte Lieder.' },
      { id: 'D', text: 'Kindertotenlieder.' }
    ],
    correctOptionId: 'A',
    explanation: 'La plantilla oficial atribuye Dichterliebe a Robert Schumann; Winterreise es de Schubert y Vier letzte Lieder de Richard Strauss.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 66'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-066', label: 'Variante propia B de m3-2021-oficial-066', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-2021-oficial-064-B',
    topicId: 'especifico-07',
    prompt: 'Doña Francisquita está considerada uno de los máximos exponentes de:',
    options: [
      { id: 'A', text: 'La restauración de la zarzuela grande.' },
      { id: 'B', text: 'La tonadilla escénica dieciochesca.' },
      { id: 'C', text: 'El género chico madrileño.' },
      { id: 'D', text: 'La ópera bufa italiana.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta oficial sitúa Doña Francisquita como uno de los máximos exponentes de la restauración de la zarzuela grande.',
    source: official('Convocatoria oficial M3 2021, primer ejercicio, pregunta 64'),
    origin: { type: 'own_variant', variantOf: 'm3-2021-oficial-064', label: 'Variante propia B de m3-2021-oficial-064', basedOn: 'Convocatoria oficial M3 2021', historical: false },
    variantPolicy: officialVariantPolicy
  },
  {
    id: 'm3-pool5-final-12-01',
    topicId: 'especifico-12',
    prompt: 'Según IMS437_3, ¿qué bloque de tareas encaja con la asistencia a la producción de espectáculos en vivo?',
    options: [
      { id: 'A', text: 'Organización, contratación, planificación de fases, cronogramas y presupuestos.' },
      { id: 'B', text: 'Libro de regiduría, avisos, cambios de escena y comunicación durante función.' },
      { id: 'C', text: 'Bastidores, rampas, practicables, forillos y mantenimiento escénico.' },
      { id: 'D', text: 'Patch, enfoque, regulación de proyectores y pruebas de iluminación.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente técnica de producción recoge organización, contratación, planificación, cronogramas y presupuestos como contenidos propios de producción y adaptación.',
    source: bibliografia('Producción y adaptación de espacios escénicos, actualización 2019', 'sources/cncp-technical.html', 'cncp-pci477-produccion', 'https://www.boe.es/buscar/doc.php?id=BOE-A-2019-6893'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-29-01',
    topicId: 'especifico-29',
    prompt: 'Según ART523_3, al construir decorados para la escena, ¿qué operación es propia del trabajo escenográfico?',
    options: [
      { id: 'A', text: 'Interpretar diseños y planos para adaptar decorados al espacio de representación.' },
      { id: 'B', text: 'Ordenar convocatorias, avisos y entradas de intérpretes durante la función.' },
      { id: 'C', text: 'Seleccionar proyectores, configurar dimmers y documentar el patch.' },
      { id: 'D', text: 'Preparar figurines, pruebas de vestuario y arreglos de sastrería.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART523_3 se centra en interpretar diseños y planos y en construir, montar o adaptar decorados y elementos escenográficos al espacio de representación.',
    source: bibliografia('ART523_3, Construcción de decorados para la escena', 'sources/cncp-technical.html', 'cncp-art523-3-contenidos', 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-32-01',
    topicId: 'especifico-32',
    prompt: 'Según ART524_3, ¿qué conjunto pertenece a elementos y estructuras de maquinaria escénica?',
    options: [
      { id: 'A', text: 'Bastidores, rampas, practicables, forillos y desembarcos.' },
      { id: 'B', text: 'Proyectores, dimmers, recortes, filtros y mesas de control.' },
      { id: 'C', text: 'Micrófonos, monitores, mesas, envíos y sistemas de intercom.' },
      { id: 'D', text: 'Figurines, tejidos, percheros, arreglos y fichas de vestuario.' }
    ],
    correctOptionId: 'A',
    explanation: 'ART524_3 enumera bastidores, rampas, practicables, forillos, desembarcos y otros componentes de la caja escénica.',
    source: bibliografia('ART524_3, Maquinaria escénica para el espectáculo en vivo', 'sources/cncp-technical.html', 'cncp-art524-3-contenidos', 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-34-01',
    topicId: 'especifico-34',
    prompt: 'Según la actualización de producción y adaptación de espacios, ¿qué debe analizarse al adaptar una producción a un nuevo espacio escénico?',
    options: [
      { id: 'A', text: 'El edificio, el espacio temporal, los recursos técnicos y los recursos artísticos.' },
      { id: 'B', text: 'El reparto, los cachés, la estrategia de públicos y la campaña de comunicación.' },
      { id: 'C', text: 'El libro de regiduría, los avisos a público y las entradas de intérpretes.' },
      { id: 'D', text: 'La selección de luminarias, el enfoque, el color y los efectos de luz.' }
    ],
    correctOptionId: 'A',
    explanation: 'La Orden PCI/477/2019 recoge análisis del edificio y del espacio temporal, recursos técnicos y artísticos, organización y planificación.',
    source: bibliografia('Producción y adaptación de espacios escénicos, actualización 2019', 'sources/cncp-technical.html', 'cncp-pci477-produccion', 'https://www.boe.es/buscar/doc.php?id=BOE-A-2019-6893'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-34-02',
    topicId: 'especifico-34',
    prompt: 'En adaptación de espacios escénicos, ¿qué instrumento permite ordenar fases, tiempos y recursos de producción?',
    options: [
      { id: 'A', text: 'Cronograma de producción.' },
      { id: 'B', text: 'Libro de regiduría.' },
      { id: 'C', text: 'Ficha de vestuario.' },
      { id: 'D', text: 'Plano de iluminación.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente de producción y adaptación incluye la planificación de fases, cronogramas y presupuestos entre sus contenidos.',
    source: bibliografia('Producción y adaptación de espacios escénicos, actualización 2019', 'sources/cncp-technical.html', 'cncp-pci477-produccion', 'https://www.boe.es/buscar/doc.php?id=BOE-A-2019-6893'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-35-01',
    topicId: 'especifico-35',
    prompt: 'Según el temario técnico M1 de sastrería, la terminología específica del vestuario de espectáculo incluye:',
    options: [
      { id: 'A', text: 'Tipos de prendas, accesorios, adornos y usos historicistas.' },
      { id: 'B', text: 'Puntadas, planchado, lavado y mantenimiento de calzado.' },
      { id: 'C', text: 'Patronaje, modelaje, toma de medidas y pruebas.' },
      { id: 'D', text: 'Desgloses, figurines, aprovisionamiento y giras.' }
    ],
    correctOptionId: 'A',
    explanation: 'El temario M1 de sastrería incluye terminología del vestuario: prendas, accesorios, adornos y usos historicistas de distintas épocas.',
    source: bibliografia('Temario técnico INAEM M1, Gestión de Sastrería del Espectáculo en Vivo, tema 3', 'sources/inaem-m1-2022.html', 'inaem-m1-2022-gestion-de-sastreria-del-espectaculo-e-t3', 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2022-23830'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-35-02',
    topicId: 'especifico-35',
    prompt: 'Según el temario M1 de caracterización, ¿qué bloque pertenece al proceso de maquillaje profesional?',
    options: [
      { id: 'A', text: 'Productos, útiles y técnicas de elaboración de máscaras y prótesis.' },
      { id: 'B', text: 'Toma de medidas, patronaje base y arreglos de vestuario.' },
      { id: 'C', text: 'Pelucas, postizos, coloración y protocolos de peinado.' },
      { id: 'D', text: 'Figurines, desgloses, pruebas y comunicación con sastrería.' }
    ],
    correctOptionId: 'A',
    explanation: 'El temario de caracterización incluye diseño y elaboración de máscaras y prótesis, además de productos, útiles y técnicas asociados.',
    source: bibliografia('Temario técnico INAEM M1, Caracterización y Maquillaje Profesional, tema 5', 'sources/inaem-m1-2022.html', 'inaem-m1-2022-caracterizacion-y-maquillaje-profesion-t5', 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2022-23830'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-36-01',
    topicId: 'especifico-36',
    prompt: 'Según IMS442_3, ¿qué documentación se asocia directamente a la regiduría de ensayos y función?',
    options: [
      { id: 'A', text: 'Libro de regiduría, convocatorias, partes y documentación de ensayo y función.' },
      { id: 'B', text: 'Ficha técnica, rider de compañía, plano de implantación y aforo.' },
      { id: 'C', text: 'Inventario de utilería, hoja de pasada, almacén y movimientos.' },
      { id: 'D', text: 'Desglose de vestuario, figurines, pruebas y fichas de arreglo.' }
    ],
    correctOptionId: 'A',
    explanation: 'IMS442_3 menciona el libro de regiduría, convocatorias, partes y documentación de ensayo y función.',
    source: bibliografia('IMS442_3, Regiduría de espectáculos en vivo y eventos', 'sources/cncp-technical.html', 'cncp-ims442-3-contenidos', 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-37-01',
    topicId: 'especifico-37',
    prompt: 'Según IMS442_3, durante la representación la regiduría coordina especialmente:',
    options: [
      { id: 'A', text: 'Artistas, equipos técnicos, cambios, avisos y comunicación.' },
      { id: 'B', text: 'Montaje, mantenimiento, almacenamiento y reparación de decorados.' },
      { id: 'C', text: 'Diseño, enfoque, color, patch y regulación de luminarias.' },
      { id: 'D', text: 'Pruebas, arreglos, cambios rápidos y conservación de vestuario.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente IMS442_3 sitúa en regiduría la coordinación de artistas, equipos técnicos, cambios, avisos y comunicación durante la representación.',
    source: bibliografia('IMS442_3, Regiduría de espectáculos en vivo y eventos', 'sources/cncp-technical.html', 'cncp-ims442-3-contenidos', 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-42-01',
    topicId: 'especifico-42',
    prompt: 'Según la NTP 534 del INSST, la carga mental depende de factores de la tarea, condiciones externas y:',
    options: [
      { id: 'A', text: 'Características de la persona.' },
      { id: 'B', text: 'Organización preventiva.' },
      { id: 'C', text: 'Tipo de jornada.' },
      { id: 'D', text: 'Nivel de responsabilidad.' }
    ],
    correctOptionId: 'A',
    explanation: 'La NTP 534 agrupa los factores de carga mental en exigencias de la tarea, condiciones externas y características de la persona.',
    source: bibliografia('NTP 534, Carga mental de trabajo: factores', 'sources/m3-bibliography.html', 'ntp-0534-factores', 'https://www.insst.es/documents/94886/191756/NTP%20534%20Carga%20mental%20de%20trabajo%20factores.pdf'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-42-02',
    topicId: 'especifico-42',
    prompt: 'Según la NTP 318 del INSST, el estrés laboral se entiende como un proceso en el que intervienen estresores, percepción y:',
    options: [
      { id: 'A', text: 'Recursos o características de la persona.' },
      { id: 'B', text: 'Carga física de la tarea.' },
      { id: 'C', text: 'Organización del turno.' },
      { id: 'D', text: 'Condiciones ambientales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La NTP 318 presenta el estrés como una interacción entre estresores, percepción y características o recursos personales.',
    source: bibliografia('NTP 318, El estrés: proceso de generación en el ámbito laboral', 'sources/m3-bibliography.html', 'ntp-0318-proceso', 'https://www.insst.es/documents/94886/326827/ntp_318.pdf/2c36529c-e315-4b60-9b6d-33cb81a8bfd0'),
    origin: originFinal
  },
  {
    id: 'm3-pool5-final-42-03',
    topicId: 'especifico-42',
    prompt: 'En prevención psicosocial, ¿qué diferencia mejor la carga mental de la carga física?',
    options: [
      { id: 'A', text: 'La carga mental se vincula a exigencias intelectuales y tratamiento de información.' },
      { id: 'B', text: 'La carga mental mide el esfuerzo muscular y la postura de trabajo.' },
      { id: 'C', text: 'La carga mental equivale al ruido, la iluminación y la temperatura.' },
      { id: 'D', text: 'La carga mental describe la duración y distribución de la jornada.' }
    ],
    correctOptionId: 'A',
    explanation: 'La NTP 0179 sitúa la carga mental en las exigencias intelectuales de la tarea y los factores que afectan mentalmente a la persona.',
    source: bibliografia('NTP 0179, La carga mental del trabajo: definición y evaluación', 'sources/m3-bibliography.html', 'ntp-0179-definicion', 'https://www.insst.es/normativa/riesgos-psicosociales/listado-de-ntp'),
    origin: originFinal
  }
].map(rotate);

const itemIds = new Set(items.map(question => question.id));
const retained = questions.filter(question => !itemIds.has(question.id));
const replaced = questions.length - retained.length;
retained.push(...items);

await writeFile(questionsPath, `${JSON.stringify(retained, null, 2)}\n`, 'utf8');
console.log(`Añadidas/actualizadas ${items.length} preguntas de cierre pool5 (${replaced} reemplazadas).`);
