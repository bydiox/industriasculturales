import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const catalog = {
  cdaem: {
    kind: 'referencia',
    sourceId: 'cdaem-danza-patrimonio',
    file: 'sources/fuente-cdaem-danza.html',
    author: 'Centro de Documentación de las Artes Escénicas y de la Música (CDAEM)',
    edition: 'fuente institucional consultada el 1 de agosto de 2026',
    url: 'https://www.musicadanza.es/'
  },
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
  label: 'M3 · segunda ampliación desde fuentes de referencia · 2026-08-01',
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
    id: 'ref-extra2-08-01',
    topicId: 'especifico-08',
    prompt: 'Según el CDAEM, ¿quién realizaba las grabaciones de danza hasta 1998?',
    options: [
      { id: 'A', text: 'Asistencia Técnica del INAEM, por encargo de la Secretaría de Estado de Cultura.' },
      { id: 'B', text: 'La Unidad de Audiovisuales del CDAEM, como servicio propio desde su origen.' },
      { id: 'C', text: 'Las compañías titulares, mediante depósito obligatorio de sus registros.' },
      { id: 'D', text: 'La Biblioteca Nacional, a través del archivo sonoro y audiovisual.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente indica que hasta 1998 las grabaciones fueron encargadas por la Secretaría de Estado de Cultura y realizadas por Asistencia Técnica del INAEM.',
    source: source('cdaem', 'cdaem-danza-patrimonio-videoteca-02', 'Videoteca de danza, párrafo 2')
  },
  {
    id: 'ref-extra2-08-02',
    topicId: 'especifico-08',
    prompt: '¿A qué ritmo aproximado crece la colección Audiovisuales Danza del CDAEM?',
    options: [
      { id: 'A', text: 'Unas cincuenta grabaciones anuales.' },
      { id: 'B', text: 'Unas diez grabaciones anuales.' },
      { id: 'C', text: 'Unas cien grabaciones anuales.' },
      { id: 'D', text: 'Unas doscientas grabaciones anuales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El CDAEM señala que la colección crece a un ritmo aproximado de cincuenta grabaciones anuales.',
    source: source('cdaem', 'cdaem-danza-patrimonio-videoteca-02', 'Videoteca de danza, párrafo 2')
  },
  {
    id: 'ref-extra2-08-03',
    topicId: 'especifico-08',
    prompt: 'Desde 2020, algunos títulos de la colección Audiovisuales Danza se incorporaron a:',
    options: [
      { id: 'A', text: 'La Teatroteca, con préstamo en línea por tiempo limitado.' },
      { id: 'B', text: 'El DIRCE, como actividad económica principal cultural.' },
      { id: 'C', text: 'El inventario Localizart de residencias artísticas.' },
      { id: 'D', text: 'La Estadística de Bibliotecas del Plan Estadístico Nacional.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente indica que desde 2020 algunos títulos se incorporaron a la Teatroteca, que permite el préstamo en línea durante un tiempo limitado.',
    source: source('cdaem', 'cdaem-danza-patrimonio-videoteca-04', 'Videoteca de danza, párrafo 4')
  },
  {
    id: 'ref-extra2-08-04',
    topicId: 'especifico-08',
    prompt: '¿Qué recoge la base de datos de programaciones de danza del CDAEM?',
    options: [
      { id: 'A', text: 'Ciclos, muestras y festivales, con título y autoría o compañía, desde 2000.' },
      { id: 'B', text: 'Fichas artísticas de estrenos coreográficos realizados desde 1998.' },
      { id: 'C', text: 'Fotografías relacionadas con programaciones o estrenos de 2001 a 2011.' },
      { id: 'D', text: 'Artículos, monografías, ponencias y tesis relativas a la danza.' }
    ],
    correctOptionId: 'A',
    explanation: 'La base de programaciones reúne ciclos, muestras y festivales, con título y mención de autoría, profesional o compañía, desde el año 2000.',
    source: source('cdaem', 'cdaem-danza-patrimonio-bases-datos-03', 'Bases de datos de danza, párrafo 3')
  },
  {
    id: 'ref-extra2-08-05',
    topicId: 'especifico-08',
    prompt: 'En el ámbito patrimonial, ¿qué funciones señala el CDAEM como propias?',
    options: [
      { id: 'A', text: 'Recopilar y custodiar patrimonio documental escénico y musical español.' },
      { id: 'B', text: 'Contratar giras, fijar cachés y adjudicar servicios técnicos.' },
      { id: 'C', text: 'Gestionar taquilla, abonos y campañas de precios públicos.' },
      { id: 'D', text: 'Inspeccionar locales, autorizar aforos y sancionar espectáculos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El CDAEM recoge como funciones patrimoniales la recopilación y custodia del patrimonio documental escénico y musical español, junto con herramientas para su estudio y difusión.',
    source: source('cdaem', 'cdaem-danza-patrimonio-funciones-02', 'Funciones patrimoniales del CDAEM, párrafo 2')
  },
  {
    id: 'ref-extra2-10-01',
    topicId: 'especifico-10',
    prompt: 'En 2022, según el Anuario 2024, las instituciones museísticas investigadas recibieron aproximadamente:',
    options: [
      { id: 'A', text: '51,6 millones de visitantes.' },
      { id: 'B', text: '23,2 millones de visitantes.' },
      { id: 'C', text: '1,8 millones de visitantes.' },
      { id: 'D', text: '710.200 visitantes.' }
    ],
    correctOptionId: 'A',
    explanation: 'La Estadística de Museos y Colecciones Museográficas estima que 1.522 instituciones museísticas recibieron 51,6 millones de visitantes en 2022.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'ref-extra2-10-02',
    topicId: 'especifico-10',
    prompt: '¿Qué operación estadística recoge información sobre producción, exhibición, distribución y difusión cinematográficas?',
    options: [
      { id: 'A', text: 'La Estadística de Cinematografía.' },
      { id: 'B', text: 'La Estadística de Bibliotecas.' },
      { id: 'C', text: 'La Estadística de Archivos.' },
      { id: 'D', text: 'La Estadística de Museos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que la Estadística de Cinematografía proporciona información sobre producción, exhibición, distribución y difusión cinematográficas.',
    source: source('anuario', 'anuario-cultura-2024-s15-artes-esc-nicas-y-musicales-04', 'Artes escénicas y musicales, párrafo 4')
  },
  {
    id: 'ref-extra2-19-01',
    topicId: 'especifico-19',
    prompt: 'Según la FEMP, el sistema de indicadores culturales surge de la colaboración entre:',
    options: [
      { id: 'A', text: 'La FEMP y el Ministerio de Cultura.' },
      { id: 'B', text: 'El ICAA y Patrimonio Nacional.' },
      { id: 'C', text: 'El INAEM y el Ministerio de Hacienda.' },
      { id: 'D', text: 'La BNE y el Instituto Cervantes.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento atribuye el diseño del sistema a la convergencia y colaboración de la FEMP y el Ministerio de Cultura.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p09', 'Párrafo 9')
  },
  {
    id: 'ref-extra2-19-02',
    topicId: 'especifico-19',
    prompt: 'En el Sistema de Indicadores de la FEMP, ¿qué deben respaldar las respuestas cualitativas?',
    options: [
      { id: 'A', text: 'Evidencias documentales.' },
      { id: 'B', text: 'Estimaciones intuitivas.' },
      { id: 'C', text: 'Opiniones del programador.' },
      { id: 'D', text: 'Votaciones informales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento señala que las respuestas cualitativas deben apoyarse en evidencias documentales.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p13', 'Párrafo 13')
  },
  {
    id: 'ref-extra2-19-03',
    topicId: 'especifico-19',
    prompt: '¿Qué prueba pendiente menciona la FEMP tras construir el Sistema de Indicadores?',
    options: [
      { id: 'A', text: 'Una prueba piloto de implementación en localizaciones tipo.' },
      { id: 'B', text: 'Un examen oficial estatal de gestores culturales.' },
      { id: 'C', text: 'Una auditoría de contratos menores culturales.' },
      { id: 'D', text: 'Un registro obligatorio de festivales privados.' }
    ],
    correctOptionId: 'A',
    explanation: 'La FEMP menciona como paso pendiente una prueba piloto en localizaciones tipo para depurar y mejorar el sistema.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p13', 'Párrafo 13')
  },
  {
    id: 'ref-extra2-21-01',
    topicId: 'especifico-21',
    prompt: 'Según el Plan de Derechos Culturales, ¿qué problema se detecta en el uso del Bono Cultural Joven?',
    options: [
      { id: 'A', text: 'Señales de falta de equidad en acceso y uso.' },
      { id: 'B', text: 'Dificultades de programación en zonas rurales.' },
      { id: 'C', text: 'Baja articulación con mediación cultural.' },
      { id: 'D', text: 'Escasa coordinación con centros educativos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 9 señala que el Bono Cultural Joven tiene potencial inclusivo, pero ha mostrado señales de falta de equidad en su acceso y uso.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-009', 'Medida 9: Refuerzo del Bono Cultural Joven')
  },
  {
    id: 'ref-extra2-21-02',
    topicId: 'especifico-21',
    prompt: 'En el gasto cultural de los hogares de 2023, ¿qué partida aparece con un 13,8 %?',
    options: [
      { id: 'A', text: 'Espectáculos, como cines, teatros y otros.' },
      { id: 'B', text: 'Museos, bibliotecas, parques y similares.' },
      { id: 'C', text: 'Cuotas y alquileres de radio y televisión.' },
      { id: 'D', text: 'Servicios fotográficos y otros servicios.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario desglosa el gasto cultural e identifica los espectáculos —cines, teatros y otros— con un 13,8 %.',
    source: source('anuario', 'anuario-cultura-2024-s04-gasto-de-consumo-cultural-de-l-02', 'Gasto de consumo cultural de los hogares, párrafo 2')
  },
  {
    id: 'ref-extra2-22-01',
    topicId: 'especifico-22',
    prompt: 'Según el Anuario 2024, ¿qué porcentaje declaró asistir al teatro en el último año?',
    options: [
      { id: 'A', text: '23,2 %.' },
      { id: 'B', text: '43,5 %.' },
      { id: 'C', text: '7,0 %.' },
      { id: 'D', text: '2,6 %.' }
    ],
    correctOptionId: 'A',
    explanation: 'Dentro de hábitos y prácticas culturales, el Anuario recoge un 23,2 % de personas que asistieron al teatro en el último año.',
    source: source('anuario', 'anuario-cultura-2024-s09-h-bitos-y-pr-cticas-culturales-01', 'Hábitos y prácticas culturales, párrafo 1')
  },
  {
    id: 'ref-extra2-22-02',
    topicId: 'especifico-22',
    prompt: 'En el Sistema de la FEMP, ¿qué indicador directo se menciona para conocer la asistencia a actos escénicos?',
    options: [
      { id: 'A', text: 'Número de asistentes a actos escénicos programados directamente.' },
      { id: 'B', text: 'Número de contratos artísticos negociados sin publicidad.' },
      { id: 'C', text: 'Número de espacios escénicos estables por provincia.' },
      { id: 'D', text: 'Número de libros inscritos con ISBN en el año.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento menciona el número de asistentes a actos escénicos programados directamente por la entidad pública local como indicador de asistencia.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p24', 'Párrafo 24')
  },
  {
    id: 'ref-extra2-23-01',
    topicId: 'especifico-23',
    prompt: 'Según el Plan de Derechos Culturales, ¿por qué es necesaria una guía sobre diversidad lingüística?',
    options: [
      { id: 'A', text: 'Por la escasez de materiales accesibles y actualizados.' },
      { id: 'B', text: 'Por la ausencia de lenguas protegidas en España.' },
      { id: 'C', text: 'Por la desaparición de toda política cultural local.' },
      { id: 'D', text: 'Por la obligación de traducir todos los contratos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 69 señala que faltan materiales accesibles y actualizados para explicar el valor democrático de la diversidad lingüística y su marco de protección.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-069', 'Medida 69: Guía sobre la diversidad lingüística')
  },
  {
    id: 'ref-extra2-23-02',
    topicId: 'especifico-23',
    prompt: 'En la FEMP, ¿con qué objetivo de política cultural se analizan los factores comunicativos?',
    options: [
      { id: 'A', text: 'Garantizar la equidad en el acceso a la vida cultural local.' },
      { id: 'B', text: 'Incrementar la memoria colectiva mediante archivos locales.' },
      { id: 'C', text: 'Medir la asistencia anual a actos escénicos programados.' },
      { id: 'D', text: 'Evaluar la disponibilidad de abonos y medios de pago.' }
    ],
    correctOptionId: 'A',
    explanation: 'El objetivo B2 vincula los factores comunicativos con la equidad en el acceso de la ciudadanía a la vida cultural local.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p22', 'Párrafo 22')
  },
  {
    id: 'ref-extra2-24-01',
    topicId: 'especifico-24',
    prompt: 'El programa Cultura y Ciudadanía del Plan de Derechos Culturales promueve la participación en colaboración con:',
    options: [
      { id: 'A', text: 'Agentes públicos y privados.' },
      { id: 'B', text: 'Centros educativos y universidades.' },
      { id: 'C', text: 'Entidades locales y bibliotecas.' },
      { id: 'D', text: 'Museos estatales y archivos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 22 define Cultura y Ciudadanía como un programa para promover la participación ciudadana en cultura en colaboración con agentes públicos y privados.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-022', 'Medida 22: Cultura y Ciudadanía')
  },
  {
    id: 'ref-extra2-24-02',
    topicId: 'especifico-24',
    prompt: 'Según el Plan de Derechos Culturales, los pilotos de ciencia ciudadana en arte y escuela buscan establecer alianzas entre:',
    options: [
      { id: 'A', text: 'Ciencia ciudadana y arte.' },
      { id: 'B', text: 'Taquilla y abonos.' },
      { id: 'C', text: 'Archivo y préstamo.' },
      { id: 'D', text: 'Fiscalidad y mecenazgo.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 98 propone proyectos piloto orientados a establecer alianzas entre ciencia ciudadana y arte desde el espacio educativo.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-098', 'Medida 98: Pilotos de ciencia ciudadana en los proyectos de arte y escuela')
  },
  {
    id: 'ref-extra2-24-03',
    topicId: 'especifico-24',
    prompt: 'La medida 12 del Plan de Derechos Culturales plantea la cultura en el ámbito penitenciario como herramienta para:',
    options: [
      { id: 'A', text: 'Imaginar el futuro y reconstruir vínculos con el entorno.' },
      { id: 'B', text: 'Mejorar hábitos lectores y acceso a bibliotecas.' },
      { id: 'C', text: 'Impulsar mediación artística en centros educativos.' },
      { id: 'D', text: 'Crear redes comunitarias de espacios culturales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 12 parte de que la cultura ayuda a imaginar el futuro, trascender límites y reconstruir vínculos con el entorno en contextos de privación de libertad.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-012', 'Medida 12: Programa de intervención cultural en el ámbito penitenciario')
  },
  {
    id: 'ref-extra2-25-01',
    topicId: 'especifico-25',
    prompt: 'El Plan de Derechos Culturales plantea la cesión de espacios para iniciativas culturales ciudadanas a partir de:',
    options: [
      { id: 'A', text: 'Espacios infrautilizados o en desuso.' },
      { id: 'B', text: 'Archivos de titularidad estatal.' },
      { id: 'C', text: 'Fondos audiovisuales de danza.' },
      { id: 'D', text: 'Presupuestos de entidades locales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 17 parte de aprovechar espacios infrautilizados o en desuso para facilitar proyectos culturales impulsados por la ciudadanía.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-017', 'Medida 17: Cesión de espacios para iniciativas culturales ciudadanas')
  },
  {
    id: 'ref-extra2-25-02',
    topicId: 'especifico-25',
    prompt: '¿Qué tipo de materiales menciona el Plan de Derechos Culturales al hablar de cesión de uso cultural?',
    options: [
      { id: 'A', text: 'Escenografías, estructuras técnicas y materiales gráficos o decorativos.' },
      { id: 'B', text: 'Libros con ISBN, revistas académicas y tesis doctorales.' },
      { id: 'C', text: 'Contratos menores, nóminas y expedientes disciplinarios.' },
      { id: 'D', text: 'Indicadores cuantitativos, censos y operaciones estadísticas.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 84 menciona escenografías, estructuras técnicas y materiales gráficos o decorativos que suelen quedar almacenados o desecharse tras un uso limitado.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-084', 'Medida 84: Protocolo para la cesión de uso de materiales culturales')
  },
  {
    id: 'ref-extra2-25-03',
    topicId: 'especifico-25',
    prompt: 'Según el Plan de Derechos Culturales, ¿qué equipamientos pueden funcionar como refugios climáticos?',
    options: [
      { id: 'A', text: 'Equipamientos culturales, especialmente bibliotecas.' },
      { id: 'B', text: 'Centros educativos, especialmente conservatorios.' },
      { id: 'C', text: 'Espacios escénicos, especialmente salas de ensayo.' },
      { id: 'D', text: 'Centros museísticos, especialmente almacenes.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 85 destaca el potencial de los equipamientos culturales, entre ellos bibliotecas, para actuar como refugios climáticos.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-085', 'Medida 85: Espacios culturales como refugios climáticos')
  },
  {
    id: 'ref-extra2-27-01',
    topicId: 'especifico-27',
    prompt: 'Según el Anuario 2024, ¿qué estimaba la explotación específica de la EPA sobre empleo cultural en 2023?',
    options: [
      { id: 'A', text: '723,3 mil personas, el 3,4 % del empleo total.' },
      { id: 'B', text: '182,7 mil personas, el 5,7 % del empleo total.' },
      { id: 'C', text: '51,6 mil personas, el 1,8 % del empleo total.' },
      { id: 'D', text: '710,2 mil personas, el 3,6 % del empleo total.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que el empleo cultural ascendió en 2023 a 723,3 mil personas, un 3,4 % del empleo total en España.',
    source: source('anuario', 'anuario-cultura-2024-s00-introducci-n-y-notas-metodol-g-03', 'Introducción y notas metodológicas, párrafo 3')
  },
  {
    id: 'ref-extra2-27-02',
    topicId: 'especifico-27',
    prompt: 'Según el Anuario 2024, ¿qué rasgo formativo presenta el empleo cultural respecto al conjunto nacional?',
    options: [
      { id: 'A', text: 'Una tasa de educación superior más elevada.' },
      { id: 'B', text: 'Una tasa de educación superior más baja.' },
      { id: 'C', text: 'La misma tasa de educación superior.' },
      { id: 'D', text: 'Ausencia de datos sobre nivel formativo.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario señala que el empleo cultural presenta una tasa de educación superior del 70,2 %, frente al 46,6 % del conjunto nacional.',
    source: source('anuario', 'anuario-cultura-2024-s00-introducci-n-y-notas-metodol-g-03', 'Introducción y notas metodológicas, párrafo 3')
  },
  {
    id: 'ref-extra2-27-03',
    topicId: 'especifico-27',
    prompt: 'Según el Anuario 2024, ¿qué proporción de empresas culturales eran empresas sin asalariados a principios de 2023?',
    options: [
      { id: 'A', text: '51,5 %.' },
      { id: 'B', text: '46,0 %.' },
      { id: 'C', text: '13,2 %.' },
      { id: 'D', text: '86,8 %.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que el 51,5 % de las empresas culturales eran empresas sin asalariados.',
    source: source('anuario', 'anuario-cultura-2024-s02-empresas-culturales-01', 'Empresas culturales, párrafo 1')
  },
  {
    id: 'ref-extra2-27-04',
    topicId: 'especifico-27',
    prompt: 'En el Componente 24, la inversión C24.I2 se refiere a:',
    options: [
      { id: 'A', text: 'Dinamización de la cultura a lo largo del territorio.' },
      { id: 'B', text: 'Impulso de la competitividad de las industrias culturales.' },
      { id: 'C', text: 'Digitalización e impulso de grandes servicios culturales.' },
      { id: 'D', text: 'Refuerzo de derechos de autor y derechos conexos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 identifica la inversión C24.I2 como dinamización de la cultura a lo largo del territorio.',
    source: source('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  }
];

const byId = new Map(questions.map((question, index) => [question.id, index]));
let added = 0;
let updated = 0;

for (const item of items) {
  const html = await readFile(join(root, 'data', item.source.file), 'utf8');
  if (!new RegExp(`(?:id|data-anchor-id)=["']${item.source.anchorId}["']`).test(html)) {
    throw new Error(`Ancla inexistente en ${item.id}: ${item.source.anchorId}`);
  }
  const normalized = normalise(item);
  const existingIndex = byId.get(normalized.id);
  if (existingIndex === undefined) {
    questions.push(normalized);
    byId.set(normalized.id, questions.length - 1);
    added += 1;
  } else {
    questions[existingIndex] = { ...questions[existingIndex], ...normalized };
    updated += 1;
  }
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Segunda pasada de referencia: ${added} añadidas; ${updated} actualizadas.`);
