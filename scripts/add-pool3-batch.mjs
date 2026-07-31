import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const lawManifest = JSON.parse(await readFile(join(root, 'data/laws/laws-manifest.json'), 'utf8'));
const lawMap = new Map(lawManifest.laws.map(law => [law.lawId, law]));
const legalSource = (lawId, anchorId, reference) => ({ lawId, anchorId, reference, url: lawMap.get(lawId)?.officialUrl });
const bibliographySource = (reference, url, anchorId) => ({ kind: 'bibliografia', reference, url, file: 'sources/cncp-technical.html', anchorId });
const question = (id, topicId, prompt, options, explanation, source) => {
  if (options.length !== 4) throw new Error(`${id}: las preguntas nuevas deben tener exactamente cuatro opciones`);
  return ({
  id,
  topicId,
  prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId: 'a',
  explanation,
  source
  });
};
const legal = (id, topicId, prompt, options, explanation, lawId, anchorId, reference) => question(id, topicId, prompt, options, explanation, legalSource(lawId, anchorId, reference));
const cncp = (id, topicId, prompt, options, explanation, reference, url, anchorId) => question(id, topicId, prompt, options, explanation, bibliographySource(reference, url, anchorId));

const rd1957 = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2010-972';
const rd145 = 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2011-3634';
const pci477 = 'https://www.boe.es/buscar/doc.php?id=BOE-A-2019-6274';
const rd918 = 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-20759';
const cncpRefs = {
  ims437: 'IMS437_3, Asistencia a la producción de espectáculos en vivo y eventos',
  ims442: 'IMS442_3, Regiduría de espectáculos en vivo y eventos',
  art523: 'ART523_3, Construcción de decorados para la escena',
  art524: 'ART524_3, Maquinaria escénica para el espectáculo en vivo',
  video: 'Actualización de vídeo y contenidos para la escena, RD 918/2024',
  pci477: 'Producción y adaptación de espacios escénicos, Orden PCI/477/2019'
};

const additions = [
  cncp('m3-pool-001', 'especifico-29', 'En la cualificación ART523_3, ¿qué operación forma parte del trabajo escenográfico?', [
    'Interpretar diseños y planos para construir o adaptar decorados al espacio de representación',
    'Autorizar subvenciones culturales mediante resolución administrativa',
    'Configurar exclusivamente redes de datos para la venta de entradas'
  ], 'ART523_3 se centra en interpretar diseños y planos y en construir, montar o adaptar elementos escenográficos; no describe funciones de subvención ni de ticketing.', cncpRefs.art523, rd145, 'cncp-art523-3-contenidos'),
  cncp('m3-pool-002', 'especifico-29', '¿Qué conjunto pertenece al ámbito técnico de la maquinaria escénica ART524_3?', [
    'Bastidores, rampas y practicables de la caja escénica',
    'Guiones de comunicación, campañas y notas de prensa',
    'Bases de datos de públicos y segmentación de audiencias'
  ], 'ART524_3 recoge elementos de maquinaria y estructuras escénicas, como bastidores, rampas y practicables, junto con su montaje y mantenimiento.', cncpRefs.art524, rd145, 'cncp-art524-3-contenidos'),
  cncp('m3-pool-003', 'especifico-34', 'Al adaptar una planta escenográfica a una sala de ensayos, ¿qué enfoque coincide con el estándar de producción?', [
    'Analizar el espacio, los recursos técnicos y artísticos, la organización y las fases de trabajo',
    'Conservar la planta sin comprobar medidas para evitar cambios en el diseño original',
    'Limitar la planificación a la contratación, sin cronograma ni coordinación técnica'
  ], 'La adaptación exige relacionar el espacio con los recursos técnicos y artísticos y con la planificación de la producción.', cncpRefs.pci477, pci477, 'cncp-pci477-produccion'),
  cncp('m3-pool-004', 'especifico-34', '¿Qué documentación ayuda a coordinar la producción y la logística de una adaptación escénica?', [
    'Calendario de fases, tareas, responsables, necesidades técnicas y presupuesto',
    'Únicamente el cartel publicitario y el programa de mano definitivo',
    'Solo una relación de artistas, sin fechas, recursos ni responsables'
  ], 'IMS437_3 relaciona la producción con calendario, tareas, responsables, necesidades técnicas y presupuesto.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-005', 'especifico-36', '¿Qué documento reúne habitualmente las órdenes, avisos y cambios de una función?', [
    'El libro de regiduría',
    'El inventario patrimonial del museo',
    'El expediente de contratación del edificio'
  ], 'El estándar IMS442_3 identifica el libro de regiduría como documentación de ensayo y función, junto con convocatorias y partes.', cncpRefs.ims442, rd1957, 'cncp-ims442-3-contenidos'),
  cncp('m3-pool-006', 'especifico-36', 'Durante una representación, ¿qué función encaja con la regiduría?', [
    'Coordinar avisos, cambios y comunicación entre artistas y equipos técnicos',
    'Redactar la memoria económica anual de la entidad productora',
    'Resolver por sí sola la adjudicación de los contratos públicos'
  ], 'IMS442_3 vincula la regiduría con la coordinación de artistas, equipos técnicos, cambios, avisos y comunicación durante la función.', cncpRefs.ims442, rd1957, 'cncp-ims442-3-contenidos'),
  cncp('m3-pool-007', 'especifico-36', 'Antes de un ensayo, ¿qué actuación corresponde a una preparación de regiduría?', [
    'Preparar el espacio y revisar la documentación y las convocatorias de trabajo',
    'Sustituir el diseño artístico por un presupuesto de cierre ya aprobado',
    'Eliminar las órdenes de escena para dejar libertad a cada equipo'
  ], 'La preparación de ensayos incluye el espacio, las convocatorias y la documentación de trabajo.', cncpRefs.ims442, rd1957, 'cncp-ims442-3-contenidos'),
  cncp('m3-pool-008', 'especifico-36', 'Según el estándar de producción en vivo, ¿qué secuencia refleja mejor un proyecto escénico?', [
    'Preproducción, preparación, montaje, ensayos, representación, desmontaje y cierre',
    'Representación, contratación, preproducción, desmontaje y ensayo opcional',
    'Montaje, cierre, preproducción, representación y contratación posterior'
  ], 'IMS437_3 ordena la producción por fases; los ensayos y la representación se sitúan después de la preparación y el montaje.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-009', 'especifico-37', 'En teatro o circo, ¿qué criterio debe guiar la dirección de escenario?', [
    'Coordinar el proyecto y adaptar la organización a los equipos, el espacio y la representación',
    'Aplicar una única distribución de tareas, aunque cambien el recinto y el espectáculo',
    'Separar la dirección de escenario de cualquier comunicación con los equipos técnicos'
  ], 'La regiduría y la producción en vivo exigen coordinación y adaptación a los equipos, al espacio y a las condiciones de representación.', cncpRefs.ims442, rd1957, 'cncp-ims442-3-contenidos'),
  cncp('m3-pool-010', 'especifico-37', '¿Cuál de estas tareas pertenece a la coordinación de una función escénica?', [
    'Gestionar avisos, cambios y órdenes de escena durante la representación',
    'Determinar el tipo impositivo aplicable a cada donación cultural',
    'Aprobar la declaración de un bien como patrimonio histórico'
  ], 'La coordinación de avisos, cambios y órdenes de escena es una tarea propia de regiduría.', cncpRefs.ims442, rd1957, 'cncp-ims442-3-contenidos'),
  cncp('m3-pool-011', 'especifico-37', 'Al trabajar con un espacio no convencional, ¿qué debe hacer la producción escénica?', [
    'Revisar la adaptación del espectáculo, los recursos disponibles y la coordinación de equipos',
    'Mantener sin revisión el plan previsto para un teatro a la italiana',
    'Excluir las necesidades técnicas porque el espacio no es un recinto teatral'
  ], 'IMS437_3 e IMS442_3 contemplan la adaptación a espacios de representación no convencionales.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-012', 'especifico-38', 'En una gira, ¿qué información es esencial para adaptar la producción a cada recinto?', [
    'Características del espacio, recursos técnicos, calendario, responsables y necesidades de montaje',
    'Solo el nombre del recinto y la fecha de la primera función',
    'Únicamente el repertorio, sin información sobre equipos o tiempos de montaje'
  ], 'La adaptación de una gira requiere información del espacio, recursos, calendario, responsables y necesidades técnicas.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-013', 'especifico-38', 'Ante una incidencia durante una gira, ¿qué respuesta se ajusta a la gestión de producción?', [
    'Registrar la incidencia, coordinar a los equipos y ajustar la planificación con información verificable',
    'Ocultarla hasta el cierre para no modificar el calendario de trabajo',
    'Trasladar toda decisión al público sin consultar a los equipos de producción'
  ], 'La gestión de producción incluye documentar incidencias, coordinar equipos y ajustar la planificación.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-014', 'especifico-39', '¿Qué conjunto describe documentación útil para gestionar una producción escénica?', [
    'Calendario, tareas, responsables, necesidades técnicas y presupuesto',
    'Contraseñas personales, mensajes informales y archivos sin fecha',
    'Solo fotografías de la función, sin datos de planificación'
  ], 'El estándar de asistencia a la producción identifica calendario, tareas, responsables, necesidades técnicas y presupuesto como documentación de trabajo.', cncpRefs.ims437, rd1957, 'cncp-ims437-3-contenidos'),
  cncp('m3-pool-015', 'especifico-39', 'En los contenidos de vídeo escénico de 2024, ¿qué combinación es coherente?', [
    'Línea de tiempo, efectos, pruebas, copias de seguridad y coordinación de cues',
    'Solo edición de texto y cálculo presupuestario, sin pruebas ni respaldo',
    'Únicamente grabación de audio, sin proyección ni control de contenidos'
  ], 'El RD 918/2024 incorpora contenidos de software, línea de tiempo, efectos, pruebas, respaldo y coordinación de cues para vídeo escénico.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),
  cncp('m3-pool-016', 'especifico-39', '¿Qué debe contemplar una preparación técnica de contenidos de vídeo para escena?', [
    'Pruebas, respaldo y coordinación de la reproducción con las órdenes de escena',
    'Una copia única sin comprobación para evitar versiones diferentes',
    'La reproducción independiente de cualquier cue o indicación de regiduría'
  ], 'Los contenidos de 2024 incluyen pruebas, copias de seguridad y coordinación con cues y regiduría.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),
  cncp('m3-pool-017', 'especifico-40', '¿Qué protocolos aparecen entre los contenidos tecnológicos de vídeo escénico?', [
    'MIDI, OSC, Ethernet y SMPTE',
    'POP3, IMAP, SMTP y DNS',
    'H323, LDAP, NTP y SNMP'
  ], 'La actualización de 2024 menciona MIDI, OSC, Ethernet y SMPTE en relación con control y sincronización de sistemas escénicos.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),
  cncp('m3-pool-018', 'especifico-40', 'En el contexto de proyección escénica, ¿qué describe mejor el mapping?', [
    'Adaptar una imagen o contenido digital a la superficie y geometría de proyección',
    'Convertir automáticamente una señal de audio en un contrato artístico',
    'Registrar un bien cultural en el inventario de patrimonio histórico'
  ], 'El mapping adapta contenidos digitales a una superficie de proyección; el RD 918/2024 lo sitúa junto a warping, proyección y vídeo-dramaturgia.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),

  cncp('m3-pool-033', 'especifico-31', 'Al implantar una escenografía, ¿qué documentación resulta directamente útil?', [
    'Diseños y planos que permitan adaptar los elementos al espacio de representación',
    'Solo una relación de invitados y acreditaciones de prensa',
    'Un inventario económico sin medidas ni indicaciones de montaje'
  ], 'ART523_3 relaciona la construcción y adaptación de decorados con diseños, planos, materiales y el espacio de representación.', cncpRefs.art523, rd145, 'cncp-art523-3-contenidos'),
  cncp('m3-pool-034', 'especifico-31', '¿Qué aspecto debe comprobarse al adaptar un decorado a un espacio distinto del previsto?', [
    'La compatibilidad entre dimensiones, materiales, montaje y condiciones del nuevo espacio',
    'Únicamente el color del telón, sin revisar medidas o elementos estructurales',
    'Solo la duración de la función, aunque cambien las cargas y la implantación'
  ], 'La adaptación escenográfica exige comprobar el diseño y los elementos constructivos frente a las condiciones del nuevo espacio.', cncpRefs.art523, rd145, 'cncp-art523-3-contenidos'),
  cncp('m3-pool-035', 'especifico-31', 'En relación con la maquinaria escénica, ¿qué documentación acompaña al montaje?', [
    'Planos, mediciones, materiales, herramientas y comprobaciones de seguridad',
    'Solo el programa de mano y la crítica publicada tras el estreno',
    'Un listado de artistas sin datos de estructuras ni procedimientos'
  ], 'ART524_3 incluye documentación técnica, medición, materiales, herramientas y comprobaciones de seguridad del montaje.', cncpRefs.art524, rd145, 'cncp-art524-3-contenidos'),
  cncp('m3-pool-036', 'especifico-33', '¿Qué tarea forma parte de la preparación de un montaje luminotécnico?', [
    'Distribuir aparatos, líneas, regulación y control conforme al proyecto de iluminación',
    'Elegir el repertorio musical sin relacionarlo con el diseño de luces',
    'Sustituir el enfoque y las pruebas por una única comprobación al final'
  ], 'IMS075_3 contempla la planificación de aparatos, líneas, dimmers y sistemas de control.', 'IMS075_3, Luminotecnia para el espectáculo en vivo', 'https://www.boe.es/eli/es/o/2019/07/18/pci797', 'cncp-ims075-3-contenidos'),
  cncp('m3-pool-037', 'especifico-33', '¿Qué operación se relaciona con el enfoque de proyectores?', [
    'Ajustar la dirección y el recorte de la luz y documentar el resultado de la prueba',
    'Modificar el guion literario sin revisar la posición de los aparatos',
    'Cambiar la frecuencia de muestreo de un micrófono sin intervenir en la iluminación'
  ], 'El estándar de luminotecnia incluye posiciones, ángulos, enfoque, documentación y pruebas de los proyectores.', 'IMS075_3, Luminotecnia para el espectáculo en vivo', 'https://www.boe.es/eli/es/o/2019/07/18/pci797', 'cncp-ims075-3-contenidos'),
  cncp('m3-pool-038', 'especifico-33', '¿Qué afirmación distingue correctamente una función de los dimmers en una instalación escénica?', [
    'Permiten regular la intensidad de determinados circuitos de iluminación',
    'Sustituyen siempre a los proyectores y generan por sí solos la imagen escénica',
    'Son micrófonos destinados a captar señales de voz durante la función'
  ], 'Los dimmers forman parte de los sistemas de regulación de la iluminación; no son proyectores ni dispositivos de captación sonora.', 'IMS075_3, Luminotecnia para el espectáculo en vivo', 'https://www.boe.es/eli/es/o/2019/07/18/pci797', 'cncp-ims075-3-contenidos'),
  cncp('m3-pool-039', 'especifico-33', 'En vídeo escénico, ¿qué conjunto de tareas aparece en la actualización de 2024?', [
    'Preparar contenidos, configurar efectos y timeline, probar la reproducción y asegurar copias de respaldo',
    'Limitarse a proyectar un archivo sin pruebas, respaldo ni coordinación con la escena',
    'Sustituir el contenido audiovisual por documentación administrativa del contrato'
  ], 'El RD 918/2024 incorpora preparación de contenidos, software, efectos, timeline, pruebas, respaldo y coordinación de la reproducción.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),
  cncp('m3-pool-040', 'especifico-33', '¿Qué diferencia técnica recoge el temario entre una señal de control y un contenido de vídeo?', [
    'La señal de control puede ordenar o sincronizar equipos; el contenido de vídeo es el material que se reproduce o proyecta',
    'Ambos términos designan siempre el mismo archivo y no pueden separarse en un sistema escénico',
    'El contenido de vídeo solo existe como señal analógica y nunca puede gestionarse mediante software'
  ], 'Los contenidos de 2024 separan la preparación del material audiovisual de los protocolos y sistemas de control y sincronización.', cncpRefs.video, rd918, 'cncp-video-escena-2024'),

  legal('m3-pool-019', 'comun-01', '¿Qué relación establece el artículo 2 de la Constitución entre la unidad de España y la autonomía territorial?', [
    'Afirma la unidad de la Nación española y reconoce la autonomía de nacionalidades y regiones y la solidaridad entre ellas',
    'Reconoce soberanía independiente a cada comunidad autónoma y excluye la solidaridad',
    'Declara que la organización territorial solo puede modificarse mediante tratados internacionales'
  ], 'El artículo 2 fundamenta la Constitución en la unidad de la Nación española y reconoce autonomía y solidaridad.', 'ce-1978', 'ce-1978-a2', 'Constitución Española, artículo 2'),
  legal('m3-pool-020', 'comun-01', '¿Qué regla lingüística recoge el artículo 3.2 de la Constitución?', [
    'Las demás lenguas españolas pueden ser oficiales en las comunidades autónomas según sus Estatutos',
    'Solo el castellano puede ser oficial en todo el territorio, sin excepción estatutaria',
    'Las comunidades autónomas pueden declarar oficial cualquier lengua extranjera sin Estatuto'
  ], 'El artículo 3.2 permite la cooficialidad de las demás lenguas españolas en las comunidades autónomas conforme a sus Estatutos.', 'ce-1978', 'ce-1978-a3', 'Constitución Española, artículo 3'),
  legal('m3-pool-021', 'comun-01', '¿Cuál de estos principios aparece expresamente en el artículo 9.3 de la Constitución?', [
    'La seguridad jurídica y la interdicción de la arbitrariedad de los poderes públicos',
    'La libertad de empresa como único límite de la actuación administrativa',
    'La elección directa de todos los órganos constitucionales'
  ], 'El artículo 9.3 garantiza, entre otros, la seguridad jurídica y la interdicción de la arbitrariedad de los poderes públicos.', 'ce-1978', 'ce-1978-a9', 'Constitución Española, artículo 9.3'),
  legal('m3-pool-022', 'comun-03', '¿Cuál es una atribución de las Cortes Generales según el artículo 66.2 de la Constitución?', [
    'Ejercer la potestad legislativa del Estado, aprobar sus Presupuestos y controlar la acción del Gobierno',
    'Nombrar directamente a todos los jueces y dirigir la Administración de Justicia',
    'Ejercer la potestad reglamentaria ordinaria de cada ministerio'
  ], 'El artículo 66.2 atribuye a las Cortes la potestad legislativa, la aprobación de Presupuestos y el control del Gobierno.', 'ce-1978', 'ce-1978-a66', 'Constitución Española, artículo 66.2'),
  legal('m3-pool-023', 'comun-04', '¿Qué funciones atribuye el artículo 97 de la Constitución al Gobierno?', [
    'Dirigir la política interior y exterior, la Administración civil y militar y la defensa del Estado',
    'Ejercer exclusivamente la potestad legislativa y aprobar las sentencias firmes',
    'Controlar las Cortes y designar sin límites a sus miembros'
  ], 'El artículo 97 atribuye al Gobierno la dirección política, administrativa y de defensa y la función ejecutiva y reglamentaria.', 'ce-1978', 'ce-1978-a97', 'Constitución Española, artículo 97'),
  legal('m3-pool-024', 'especifico-11', '¿Qué efecto tiene la declaración de un bien como Bien de Interés Cultural?', [
    'Le otorga una protección y tutela singular conforme al régimen previsto en la Ley 16/1985',
    'Lo excluye del Registro General y permite su exportación sin control',
    'Lo convierte automáticamente en propiedad de la Administración General del Estado'
  ], 'El artículo 9 de la Ley 16/1985 establece una protección y tutela singular para los bienes declarados de interés cultural.', 'ley-16-1985', 'ley-16-1985-anoveno', 'Ley 16/1985, artículo noveno'),
  legal('m3-pool-025', 'especifico-11', '¿Qué principio debe respetar la salvaguardia del patrimonio cultural inmaterial?', [
    'La igualdad y la no discriminación, sin amparar acciones contrarias a la igualdad de género',
    'La prevalencia automática de cualquier tradición sobre los derechos fundamentales',
    'La exclusión de las comunidades y grupos que mantienen la manifestación cultural'
  ], 'El artículo 3 de la Ley 10/2015 exige respetar la igualdad y la no discriminación y rechaza justificar la desigualdad por el carácter tradicional.', 'ley-10-2015', 'ley-10-2015-a3', 'Ley 10/2015, artículo 3'),
  legal('m3-pool-026', 'especifico-26', 'Según el artículo 16 de la Ley 49/2002, ¿qué entidad puede ser beneficiaria de incentivos fiscales al mecenazgo?', [
    'Una entidad sin fines lucrativos a la que se aplique el régimen fiscal del título II',
    'Cualquier empresa mercantil, aunque no cumpla los requisitos del título II',
    'Solo una persona física que done a otra persona física'
  ], 'El artículo 16 incluye entre las entidades beneficiarias a las entidades sin fines lucrativos sometidas al régimen fiscal del título II.', 'ley-49-2002', 'ley-49-2002-a16', 'Ley 49/2002, artículo 16'),
  legal('m3-pool-027', 'especifico-26', '¿Cuál de estas aportaciones aparece entre los donativos deducibles del artículo 17 de la Ley 49/2002?', [
    'Una donación dineraria irrevocable, pura y simple, a una entidad beneficiaria',
    'Un préstamo mercantil reembolsable con intereses de mercado',
    'Una cuota que da derecho a recibir una prestación futura equivalente'
  ], 'El artículo 17 contempla donativos y donaciones dinerarias, de bienes o derechos, cuando cumplen sus requisitos y se realizan a entidades del artículo 16.', 'ley-49-2002', 'ley-49-2002-a17', 'Ley 49/2002, artículo 17'),
  legal('m3-pool-028', 'especifico-28', '¿Qué reconoce el artículo 14 del texto refundido de la Ley de Propiedad Intelectual?', [
    'Derechos morales del autor, como decidir la divulgación y exigir el reconocimiento de la autoría',
    'Solo derechos económicos transmisibles, sin facultades personales del autor',
    'Únicamente derechos de acceso a subvenciones para la creación artística'
  ], 'El artículo 14 enumera derechos morales, entre ellos decidir la divulgación y exigir el reconocimiento de la condición de autor.', 'rdleg-1-1996', 'rdleg-1-1996-a14', 'Real Decreto Legislativo 1/1996, artículo 14'),
  legal('m3-pool-029', 'especifico-28', '¿Qué comprende el derecho exclusivo de explotación del autor según el artículo 17?', [
    'Cualquier forma de explotación de la obra, presente o futura, con las excepciones legales',
    'Solo la primera publicación, sin reproducción ni comunicación pública',
    'Únicamente la venta del soporte físico y nunca la transformación'
  ], 'El artículo 17 reserva al autor el ejercicio exclusivo de los derechos de explotación, incluida cualquier forma de utilización no exceptuada por la ley.', 'rdleg-1-1996', 'rdleg-1-1996-a17', 'Real Decreto Legislativo 1/1996, artículo 17'),
  legal('m3-pool-030', 'especifico-44', '¿Qué principio presupuestario recoge el artículo 26 de la Ley 47/2003?', [
    'Los créditos se destinan exclusivamente a la finalidad específica para la que fueron autorizados',
    'Los créditos pueden aplicarse libremente a cualquier gasto si queda saldo disponible',
    'Los créditos solo pueden ejecutarse después de la aprobación del Tribunal de Cuentas'
  ], 'El artículo 26 recoge el principio de especialidad de los créditos: se destinan a la finalidad específica autorizada.', 'ley-47-2003', 'ley-47-2003-a26', 'Ley 47/2003, artículo 26'),
  legal('m3-pool-031', 'especifico-44', '¿Cuándo pueden adquirirse compromisos de gasto de carácter plurianual conforme al artículo 47 de la Ley 47/2003?', [
    'Cuando se trate de inversiones, transferencias de capital u otros supuestos previstos y se respeten los límites legales',
    'Siempre que el órgano gestor lo considere conveniente, sin límites temporales',
    'Solo para gastos de personal y nunca para inversiones o contratos'
  ], 'El artículo 47 permite compromisos plurianuales en los supuestos legalmente previstos y con sus límites y anualidades.', 'ley-47-2003', 'ley-47-2003-a47', 'Ley 47/2003, artículo 47'),
  legal('m3-pool-032', 'comun-02', '¿Qué función corresponde al Rey conforme al artículo 62 de la Constitución?', [
    'Sancionar y promulgar las leyes y convocar y disolver las Cortes en los términos constitucionales',
    'Dirigir la política interior y exterior y ejercer la potestad reglamentaria ordinaria',
    'Aprobar por sí solo los Presupuestos Generales del Estado y controlar al Gobierno'
  ], 'El artículo 62 enumera funciones constitucionales del Rey, entre ellas sancionar y promulgar las leyes y convocar y disolver las Cortes en los supuestos previstos.', 'ce-1978', 'ce-1978-a62', 'Constitución Española, artículo 62')
];

const positions = ['b', 'c', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'b', 'a', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c'];
for (let index = 0; index < additions.length; index += 1) {
  const target = positions[index];
  const correctText = additions[index].options[0].text;
  const remaining = additions[index].options.slice(1).map(option => option.text);
  const ordered = target === 'a' ? [correctText, ...remaining] : target === 'b' ? [remaining[0], correctText, remaining[1]] : [remaining[0], remaining[1], correctText];
  additions[index].options = ordered.map((text, optionIndex) => ({ id: String.fromCharCode(97 + optionIndex), text }));
  additions[index].correctOptionId = target;
}

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const existing = new Set(questions.map(item => item.id));
const fresh = additions.filter(item => !existing.has(item.id));
const byId = new Map(additions.map(item => [item.id, item]));
const updated = questions.map(item => byId.get(item.id) || item);
await writeFile(questionsPath, `${JSON.stringify([...updated, ...fresh], null, 2)}\n`, 'utf8');
console.log(`Lote pool3 añadido: ${fresh.length}; revisado: ${additions.length - fresh.length}.`);
