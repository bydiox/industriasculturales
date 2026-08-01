import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const sourceCatalog = {
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
  label: 'M3 · ampliación desde fuentes de referencia · 2026-08-01',
  historical: false,
  elaboracion: 'Elaborada a partir de fuente institucional con ancla verificada'
};

const optionIds = ['A', 'B', 'C', 'D'];

function source(key, anchorId, reference) {
  return { ...sourceCatalog[key], anchorId, reference, locator: reference };
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
    id: 'ref-extra-08-01',
    topicId: 'especifico-08',
    prompt: 'Según el CDAEM, ¿desde qué década reúne grabaciones la colección Audiovisuales Danza?',
    options: [
      { id: 'A', text: 'Desde los años sesenta.' },
      { id: 'B', text: 'Desde los años setenta.' },
      { id: 'C', text: 'Desde los años ochenta.' },
      { id: 'D', text: 'Desde los años noventa.' }
    ],
    correctOptionId: 'C',
    explanation: 'La fuente indica que la colección Audiovisuales Danza reúne grabaciones desde los años ochenta hasta la actualidad.',
    source: source('cdaem', 'cdaem-danza-patrimonio-videoteca-01', 'Videoteca de danza, párrafo 1')
  },
  {
    id: 'ref-extra-08-02',
    topicId: 'especifico-08',
    prompt: 'En la videoteca de danza del CDAEM, ¿qué dato forma parte de cada registro de videograbación?',
    options: [
      { id: 'A', text: 'Ficha artística, estreno, soportes y datos de grabación.' },
      { id: 'B', text: 'Autoría, signatura, depósito y derechos de préstamo.' },
      { id: 'C', text: 'Reparto, gira, recaudación y crítica publicada.' },
      { id: 'D', text: 'Programa, cartel, fotografías y ficha de prensa.' }
    ],
    correctOptionId: 'A',
    explanation: 'El CDAEM señala que cada registro detalla ficha artística completa, fecha de estreno, soportes disponibles y lugar y fecha de grabación.',
    source: source('cdaem', 'cdaem-danza-patrimonio-videoteca-03', 'Videoteca de danza, párrafo 3')
  },
  {
    id: 'ref-extra-08-03',
    topicId: 'especifico-08',
    prompt: '¿Qué recoge la base de datos de estrenos coreográficos del CDAEM?',
    options: [
      { id: 'A', text: 'Fichas artísticas de estrenos desde 1998.' },
      { id: 'B', text: 'Programaciones de festivales desde 2000.' },
      { id: 'C', text: 'Fotografías de espectáculos entre 2001 y 2011.' },
      { id: 'D', text: 'Bibliografía especializada incluida en BIME.' }
    ],
    correctOptionId: 'A',
    explanation: 'La base de datos de estrenos coreográficos contiene fichas artísticas de estrenos realizados desde 1998 hasta la actualidad.',
    source: source('cdaem', 'cdaem-danza-patrimonio-bases-datos-02', 'Bases de datos de danza, párrafo 2')
  },
  {
    id: 'ref-extra-08-04',
    topicId: 'especifico-08',
    prompt: '¿Qué novedad introdujo la edición de 2021 del Mapa del patrimonio de danza en España?',
    options: [
      { id: 'A', text: 'Amplió el alcance y mejoró la navegabilidad.' },
      { id: 'B', text: 'Sustituyó los archivos por recursos audiovisuales.' },
      { id: 'C', text: 'Limitó el directorio a compañías públicas.' },
      { id: 'D', text: 'Eliminó los fondos personales de coreógrafos.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente indica que en 2021 se publicó una nueva edición que amplía el alcance del Mapa y mejora su navegabilidad.',
    source: source('cdaem', 'cdaem-danza-patrimonio-mapa-patrimonio-04', 'Mapa del patrimonio de danza en España, párrafo 4')
  },
  {
    id: 'ref-extra-10-01',
    topicId: 'especifico-10',
    prompt: 'En el Anuario de Estadísticas Culturales 2024, ¿qué instituciones desarrollan la Estadística de Museos y Colecciones Museográficas?',
    options: [
      { id: 'A', text: 'Ministerio de Cultura, con Defensa, Patrimonio Nacional y comunidades.' },
      { id: 'B', text: 'Ministerio de Cultura, con INE, BNE y Guardia Civil.' },
      { id: 'C', text: 'Ministerio de Hacienda, con comunidades y entidades locales.' },
      { id: 'D', text: 'ICAA, con salas de exhibición, festivales y distribuidoras.' }
    ],
    correctOptionId: 'A',
    explanation: 'La estadística la desarrolla el Ministerio de Cultura con la colaboración del Ministerio de Defensa, Patrimonio Nacional y las comunidades y ciudades autónomas.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-01', 'Museos y colecciones museográficas, párrafo 1')
  },
  {
    id: 'ref-extra-10-02',
    topicId: 'especifico-10',
    prompt: 'Según el Anuario 2024, ¿qué dato describe la Estadística de Bibliotecas?',
    options: [
      { id: 'A', text: 'Equipamiento, actividad, financiación y uso de tecnologías.' },
      { id: 'B', text: 'Visitantes, colecciones, exposiciones y restauración.' },
      { id: 'C', text: 'Depósitos, fondos, consultas y servicios en sala.' },
      { id: 'D', text: 'Producción, exhibición, distribución y difusión.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario indica que esta estadística proporciona información sobre equipamiento, instalaciones, actividad, recursos, financiación y uso de tecnologías.',
    source: source('anuario', 'anuario-cultura-2024-s11-museos-y-colecciones-museogr-f-03', 'Museos y colecciones museográficas, párrafo 3')
  },
  {
    id: 'ref-extra-10-03',
    topicId: 'especifico-10',
    prompt: 'Según el Anuario 2024, ¿quién facilitó los datos de bienes muebles e inmuebles inscritos como BIC?',
    options: [
      { id: 'A', text: 'Registros y Documentación del Patrimonio Histórico.' },
      { id: 'B', text: 'Fomento de la Industria Cinematográfica.' },
      { id: 'C', text: 'Archivos Estatales y Sistemas Documentales.' },
      { id: 'D', text: 'Promoción del Libro y la Lectura.' }
    ],
    correctOptionId: 'A',
    explanation: 'El epígrafe de Patrimonio atribuye esos datos a la Subdirección General de Registros y Documentación del Patrimonio Histórico del Ministerio de Cultura.',
    source: source('anuario', 'anuario-cultura-2024-s10-patrimonio-01', 'Patrimonio, párrafo 1')
  },
  {
    id: 'ref-extra-19-01',
    topicId: 'especifico-19',
    prompt: 'El Sistema de Indicadores de la FEMP se concibe principalmente como:',
    options: [
      { id: 'A', text: 'Una caja de herramientas de autoevaluación aplicable de forma gradual.' },
      { id: 'B', text: 'Una guía de orientación para formular políticas culturales.' },
      { id: 'C', text: 'Un sistema de evaluación con aplicación uniforme y cerrada.' },
      { id: 'D', text: 'Una experiencia piloto limitada a observatorios culturales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fuente lo define como un ejercicio de autoevaluación, una “caja de herramientas” utilizable total o parcialmente y de aplicación progresiva y gradual.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p11', 'Párrafo 11')
  },
  {
    id: 'ref-extra-19-02',
    topicId: 'especifico-19',
    prompt: 'Según la FEMP, ¿qué recomendación de la Agenda 21 de la cultura impulsa un sistema de indicadores culturales?',
    options: [
      { id: 'A', text: 'El artículo 49, sobre seguimiento y comparabilidad.' },
      { id: 'B', text: 'El artículo 25, sobre evaluación del impacto cultural.' },
      { id: 'C', text: 'El artículo 21, sobre participación ciudadana.' },
      { id: 'D', text: 'El artículo 14, sobre información cultural local.' }
    ],
    correctOptionId: 'A',
    explanation: 'El artículo 49 insta a realizar una propuesta de sistema de indicadores que facilite el seguimiento y la comparabilidad.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p04', 'Párrafo 4')
  },
  {
    id: 'ref-extra-19-03',
    topicId: 'especifico-19',
    prompt: '¿Qué combinación de indicadores recoge el Sistema de Indicadores de la FEMP?',
    options: [
      { id: 'A', text: '117 cuantitativos y 235 cualitativos.' },
      { id: 'B', text: '235 cuantitativos y 117 cualitativos.' },
      { id: 'C', text: '49 cuantitativos y 25 cualitativos.' },
      { id: 'D', text: '70 cuantitativos y 30 cualitativos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento señala que combina hasta 117 indicadores cuantitativos y 235 cualitativos.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p11', 'Párrafo 11')
  },
  {
    id: 'ref-extra-19-04',
    topicId: 'especifico-19',
    prompt: 'Según el Plan de Derechos Culturales, ¿qué dimensión evalúa el balance social y comunitario además de la económica?',
    options: [
      { id: 'A', text: 'Contribución al bien común, cohesión social y comunidad.' },
      { id: 'B', text: 'Recaudación bruta, precio medio y ocupación anual.' },
      { id: 'C', text: 'Número de contratos, licitaciones y expedientes.' },
      { id: 'D', text: 'Rendimiento escénico, aforo técnico y carga eléctrica.' }
    ],
    correctOptionId: 'A',
    explanation: 'El balance social y comunitario evalúa impacto más allá de lo económico, atendiendo al bien común, la cohesión social, la comunidad y el retorno social.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-015', 'Medida 15: Estudio sobre la aplicación del balance social y comunitario')
  },
  {
    id: 'ref-extra-21-01',
    topicId: 'especifico-21',
    prompt: 'En los indicadores de la FEMP, ¿qué instrumentos aparecen como medios indirectos para conocer públicos y usuarios?',
    options: [
      { id: 'A', text: 'Abonos, medios de pago, buzón y encuestas.' },
      { id: 'B', text: 'Convenios, licencias, avales y nóminas.' },
      { id: 'C', text: 'Partituras, libretos, decorados y focos.' },
      { id: 'D', text: 'Recursos, sanciones, multas y tasas.' }
    ],
    correctOptionId: 'A',
    explanation: 'El documento menciona, entre medios indirectos, abonos para actividades, medios de pago electrónicos, buzón de sugerencias y encuestas de satisfacción.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p25', 'Párrafo 25')
  },
  {
    id: 'ref-extra-21-02',
    topicId: 'especifico-21',
    prompt: 'Según el Anuario 2024, ¿qué porcentaje del gasto total en bienes y servicios corresponde al gasto cultural de los hogares en 2023?',
    options: [
      { id: 'A', text: '1,8 %.' },
      { id: 'B', text: '3,4 %.' },
      { id: 'C', text: '5,7 %.' },
      { id: 'D', text: '13,8 %.' }
    ],
    correctOptionId: 'A',
    explanation: 'En 2023, el gasto cultural de los hogares representó el 1,8 % del gasto total estimado en bienes y servicios.',
    source: source('anuario', 'anuario-cultura-2024-s04-gasto-de-consumo-cultural-de-l-01', 'Gasto de consumo cultural de los hogares, párrafo 1')
  },
  {
    id: 'ref-extra-21-03',
    topicId: 'especifico-21',
    prompt: 'En el Sistema de la FEMP, ¿qué factor analiza el objetivo B1 para garantizar la accesibilidad cultural?',
    options: [
      { id: 'A', text: 'El precio de la oferta cultural.' },
      { id: 'B', text: 'La diversidad de la oferta cultural.' },
      { id: 'C', text: 'La comunicación de la oferta cultural.' },
      { id: 'D', text: 'La memoria colectiva de la oferta cultural.' }
    ],
    correctOptionId: 'A',
    explanation: 'El objetivo B1 analiza el tratamiento del factor precio para garantizar la accesibilidad de la oferta cultural.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p21', 'Párrafo 21')
  },
  {
    id: 'ref-extra-22-01',
    topicId: 'especifico-22',
    prompt: 'Según el Anuario 2024, ¿qué porcentaje declaró asistir a espectáculos de artes escénicas y musicales en el último año?',
    options: [
      { id: 'A', text: '43,5 %.' },
      { id: 'B', text: '23,2 %.' },
      { id: 'C', text: '7,0 %.' },
      { id: 'D', text: '2,6 %.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario recoge un 43,5 % de personas que asistieron a espectáculos de artes escénicas y musicales en el último año.',
    source: source('anuario', 'anuario-cultura-2024-s09-h-bitos-y-pr-cticas-culturales-01', 'Hábitos y prácticas culturales, párrafo 1')
  },
  {
    id: 'ref-extra-22-02',
    topicId: 'especifico-22',
    prompt: 'En la ficha A1.1.1 de la FEMP, la asistencia a actos escénicos se entiende como:',
    options: [
      { id: 'A', text: 'Acudir a un acto escénico programado por la entidad pública local.' },
      { id: 'B', text: 'Comprar un abono aunque no se acuda al espectáculo.' },
      { id: 'C', text: 'Consultar una agenda cultural sin asistir al acto.' },
      { id: 'D', text: 'Recibir una campaña de comunicación institucional.' }
    ],
    correctOptionId: 'A',
    explanation: 'La FEMP define asistencia como la acción de acudir a un acto escénico programado por la entidad pública local.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p27', 'Párrafo 27')
  },
  {
    id: 'ref-extra-22-03',
    topicId: 'especifico-22',
    prompt: '¿Qué necesidad de información abre el ámbito A de Participación ciudadana en el Sistema de la FEMP?',
    options: [
      { id: 'A', text: 'Conocer el uso o asistencia de la ciudadanía a la oferta cultural.' },
      { id: 'B', text: 'Calcular la amortización contable de los equipamientos.' },
      { id: 'C', text: 'Registrar expedientes disciplinarios del personal.' },
      { id: 'D', text: 'Clasificar contratos por procedimiento de adjudicación.' }
    ],
    correctOptionId: 'A',
    explanation: 'El ámbito A se abre con la necesidad de conocer el uso/asistencia que hace la ciudadanía de la oferta cultural promovida desde entidades públicas locales.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p20', 'Párrafo 20')
  },
  {
    id: 'ref-extra-23-01',
    topicId: 'especifico-23',
    prompt: 'En el Sistema de la FEMP, ¿qué objetivo persigue analizar los factores comunicativos de la oferta cultural?',
    options: [
      { id: 'A', text: 'Garantizar la equidad en el acceso a la vida cultural local.' },
      { id: 'B', text: 'Incrementar el uso y asistencia a la oferta cultural local.' },
      { id: 'C', text: 'Fomentar la creación y proyección de la memoria local.' },
      { id: 'D', text: 'Canalizar el potencial creativo hacia la identidad local.' }
    ],
    correctOptionId: 'A',
    explanation: 'El objetivo B2 analiza los factores comunicativos para garantizar la equidad en el acceso de la ciudadanía a la vida cultural local.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p22', 'Párrafo 22')
  },
  {
    id: 'ref-extra-23-02',
    topicId: 'especifico-23',
    prompt: '¿Qué busca la guía sobre diversidad lingüística del Plan de Derechos Culturales?',
    options: [
      { id: 'A', text: 'Facilitar la comprensión y valoración de la pluralidad lingüística.' },
      { id: 'B', text: 'Actualizar el inventario de residencias artísticas.' },
      { id: 'C', text: 'Promover la programación en zonas de reto demográfico.' },
      { id: 'D', text: 'Crear campañas sobre cultura y salud comunitaria.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 69 propone herramientas que permitan comprender y valorar la pluralidad lingüística como patrimonio cultural y derecho cultural.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-069', 'Medida 69: Guía sobre la diversidad lingüística')
  },
  {
    id: 'ref-extra-23-03',
    topicId: 'especifico-23',
    prompt: 'En los indicadores de la FEMP, ¿qué pregunta sirve para conocer mejor a usuarios y públicos culturales?',
    options: [
      { id: 'A', text: 'Si existe sistema de recogida de datos de usuarios y públicos.' },
      { id: 'B', text: 'Si existen abonos para festivales, ciclos o temporadas.' },
      { id: 'C', text: 'Si se registra la asistencia a actos expositivos.' },
      { id: 'D', text: 'Si se mide la variación anual de asistentes.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Sistema plantea comprobar si existe algún sistema de recogida de datos de usuarios y públicos de servicios y actividades culturales.',
    source: source('femp', 'femp-indicadores-politicas-culturales-p24', 'Párrafo 24')
  },
  {
    id: 'ref-extra-24-01',
    topicId: 'especifico-24',
    prompt: 'Según el Plan de Derechos Culturales, ¿qué función se asocia a la coordinación cultural en centros educativos?',
    options: [
      { id: 'A', text: 'Articular la colaboración entre agentes culturales y educativos.' },
      { id: 'B', text: 'Crear programas de arte y educación por disciplinas.' },
      { id: 'C', text: 'Impulsar pilotos de ciencia ciudadana en el aula.' },
      { id: 'D', text: 'Desarrollar materiales para sesiones de cine-escuela.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 29 habla de una función de articulación que facilite la colaboración entre agentes culturales y educativos en centros y entorno territorial.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-029', 'Medida 29: Coordinación cultural en centros educativos')
  },
  {
    id: 'ref-extra-24-02',
    topicId: 'especifico-24',
    prompt: 'En el Plan de Derechos Culturales, ¿qué caracteriza a los laboratorios comunitarios?',
    options: [
      { id: 'A', text: 'Diagnóstico y propuestas con saberes expertos y profanos.' },
      { id: 'B', text: 'Formación interdisciplinar entre cultura y salud.' },
      { id: 'C', text: 'Campañas para visibilizar cultura y bienestar.' },
      { id: 'D', text: 'Coordinación cultural entre centros y territorio.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 97 los plantea como mecanismos participativos para diagnóstico y generación de propuestas, rompiendo jerarquías entre saberes expertos y profanos.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-097', 'Medida 97: Laboratorios comunitarios')
  },
  {
    id: 'ref-extra-24-03',
    topicId: 'especifico-24',
    prompt: '¿Qué pretende el programa de formación interdisciplinar en artes y salud del Plan de Derechos Culturales?',
    options: [
      { id: 'A', text: 'Capacitar agentes para integrar artes en salud y bienestar.' },
      { id: 'B', text: 'Crear campañas sobre impacto cultural en la salud.' },
      { id: 'C', text: 'Activar laboratorios comunitarios de ciencia ciudadana.' },
      { id: 'D', text: 'Desarrollar programas de arte y educación escolar.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 94 prevé formación para profesionales de salud, gestores culturales, artistas y otros agentes en la intersección entre artes y salud.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-094', 'Medida 94: Formación interdisciplinar en artes y salud')
  },
  {
    id: 'ref-extra-25-01',
    topicId: 'especifico-25',
    prompt: 'La Red de residencias artísticas del Plan de Derechos Culturales incluye, además de crear la red:',
    options: [
      { id: 'A', text: 'Actualizar el inventario de residencias Localizart.' },
      { id: 'B', text: 'Crear una plataforma de cine en municipios.' },
      { id: 'C', text: 'Garantizar acceso en zonas de reto demográfico.' },
      { id: 'D', text: 'Redactar protocolos de cesión de materiales.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 57 prevé poner en marcha una red de residencias y actualizar el inventario Localizart.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-057', 'Medida 57: Red de residencias artísticas')
  },
  {
    id: 'ref-extra-25-02',
    topicId: 'especifico-25',
    prompt: 'Según el Plan de Derechos Culturales, la Plataforma Cine en Municipios se orienta a:',
    options: [
      { id: 'A', text: 'Facilitar cine colectivo en municipios sin salas cercanas.' },
      { id: 'B', text: 'Crear una red estable de residencias artísticas.' },
      { id: 'C', text: 'Ceder espacios culturales a iniciativas ciudadanas.' },
      { id: 'D', text: 'Difundir guías de diversidad lingüística.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 76 crea un proyecto piloto para facilitar el acceso colectivo a proyecciones en municipios pequeños, zonas rurales y territorios despoblados sin salas cercanas.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-076', 'Medida 76: Plataforma Cine en Municipios')
  },
  {
    id: 'ref-extra-25-03',
    topicId: 'especifico-25',
    prompt: 'En las zonas de reto demográfico, ¿qué plantea el Plan de Derechos Culturales respecto a la programación pública?',
    options: [
      { id: 'A', text: 'Reforzar eventos y actividades con atención a cabeceras de comarca.' },
      { id: 'B', text: 'Actualizar residencias para artistas de orígenes diversos.' },
      { id: 'C', text: 'Crear plataformas de cine en municipios pequeños.' },
      { id: 'D', text: 'Ceder materiales culturales tras un uso limitado.' }
    ],
    correctOptionId: 'A',
    explanation: 'La medida 77 busca descentralizar la programación pública y reforzar eventos en zonas de reto demográfico, especialmente cabeceras de comarca y polos de atracción cultural.',
    source: source('derechos', 'plan-derechos-culturales-2025-medida-077', 'Medida 77: Garantía de acceso a la cultura en zonas de reto demográfico')
  },
  {
    id: 'ref-extra-27-01',
    topicId: 'especifico-27',
    prompt: 'Según el Componente 24, antes de la pandemia la industria cultural representaba en España:',
    options: [
      { id: 'A', text: 'El 3,2 % del PIB y 710.200 empleos.' },
      { id: 'B', text: 'El 1,8 % del PIB y 182.697 empleos.' },
      { id: 'C', text: 'El 5,7 % del PIB y 1.522 empleos.' },
      { id: 'D', text: 'El 29,5 % del PIB y 325 empleos.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 indica que antes de la COVID-19 la industria cultural representaba el 3,2 % del PIB y proporcionaba empleo a 710.200 personas.',
    source: source('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  },
  {
    id: 'ref-extra-27-02',
    topicId: 'especifico-27',
    prompt: 'En el Componente 24, ¿qué porcentaje de contribución se atribuye a la transición digital?',
    options: [
      { id: 'A', text: '29,5 %.' },
      { id: 'B', text: '22,48 %.' },
      { id: 'C', text: '34,12 %.' },
      { id: 'D', text: '43,40 %.' }
    ],
    correctOptionId: 'A',
    explanation: 'La sección de contribución a la transición digital fija esa contribución en el 29,5 %.',
    source: source('componente24', 'componente-24-sec-7', 'Contribución del componente a la transición digital')
  },
  {
    id: 'ref-extra-27-03',
    topicId: 'especifico-27',
    prompt: '¿Qué tres ejes estratégicos recoge el Componente 24 para fortalecer las industrias culturales?',
    options: [
      { id: 'A', text: 'Competitividad, dinamización y digitalización/sostenibilidad.' },
      { id: 'B', text: 'Mecenazgo, propiedad intelectual y empleo cultural.' },
      { id: 'C', text: 'Cohesión territorial, igualdad y cooperación europea.' },
      { id: 'D', text: 'Formación, internacionalización y economía circular.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Componente 24 articula sus actuaciones en competitividad, dinamización y cohesión territorial, y digitalización y sostenibilidad de los grandes servicios culturales.',
    source: source('componente24', 'componente-24-sec-1', 'Descripción general del componente')
  },
  {
    id: 'ref-extra-27-04',
    topicId: 'especifico-27',
    prompt: 'Según el Anuario 2024, a principios de 2023 las empresas con actividad económica principal cultural ascendían a:',
    options: [
      { id: 'A', text: '182.697 empresas.' },
      { id: 'B', text: '127.581 empresas.' },
      { id: 'C', text: '1.522 empresas.' },
      { id: 'D', text: '710.200 empresas.' }
    ],
    correctOptionId: 'A',
    explanation: 'El Anuario recoge 182.697 empresas culturales a principios de 2023 en el DIRCE.',
    source: source('anuario', 'anuario-cultura-2024-s02-empresas-culturales-01', 'Empresas culturales, párrafo 1')
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
console.log(`Preguntas extra desde fuentes de referencia: ${added} añadidas; ${updated} actualizadas.`);
