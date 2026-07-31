import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const manifestPath = join(root, 'data/laws/laws-manifest.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const lawMap = new Map(manifest.laws.map(law => [law.lawId, law]));

const source = (lawId, anchorId, reference) => ({
  lawId,
  anchorId,
  reference,
  url: lawMap.get(lawId)?.officialUrl
});
const question = (id, topicId, prompt, options, correctOptionId, explanation, lawId, anchorId, reference, editorialRuleIds = []) => {
  if (options.length !== 4) throw new Error(`${id}: las preguntas nuevas deben tener exactamente cuatro opciones`);
  return ({
  id,
  topicId,
  prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId,
  explanation,
  source: source(lawId, anchorId, reference),
  ...(editorialRuleIds.length ? { editorialRuleIds } : {})
  });
};

const preReformCentreRule = ['centros-inaem-estatutos-pre-reforma-2025'];
const additions = [
  question('m3-corpus-001', 'especifico-03', 'Según el Reglamento de la Orquesta Nacional de España, ¿qué naturaleza tiene la ONE?', [
    'Un conjunto sinfónico integrado en la Administración General del Estado como unidad de producción del INAEM',
    'Un organismo autónomo dedicado exclusivamente a conservar fondos musicales, sin funciones de producción',
    'Una unidad administrativa del Ministerio sin personalidad jurídica ni capacidad de obrar propia'
  ], 'a', 'El artículo 1 la define como conjunto sinfónico integrado en la Administración General del Estado y unidad de producción del INAEM.', 'rd-1245-2002', 'rd-1245-2002-a1', 'Real Decreto 1245/2002, artículo 1', preReformCentreRule),
  question('m3-corpus-002', 'especifico-03', '¿Dónde establece su sede el artículo 2 del Reglamento de la Orquesta Nacional de España?', [
    'En el Teatro de la Zarzuela',
    'En el Auditorio Nacional de Música, en Madrid',
    'En el Centro Dramático Nacional'
  ], 'b', 'El artículo 2 fija la sede de la ONE en el Auditorio Nacional de Música de Madrid.', 'rd-1245-2002', 'rd-1245-2002-a2', 'Real Decreto 1245/2002, artículo 2', preReformCentreRule),
  question('m3-corpus-003', 'especifico-03', '¿Cuál de estas actuaciones figura entre las funciones de la Orquesta Nacional de España?', [
    'Limitar su actividad a conciertos de carácter protocolario',
    'Gestionar exclusivamente subvenciones destinadas a compañías privadas',
    'Desarrollar programas de giras por España y el extranjero'
  ], 'c', 'El artículo 3 incluye las giras por España y el extranjero entre las funciones de la ONE.', 'rd-1245-2002', 'rd-1245-2002-a3', 'Real Decreto 1245/2002, artículo 3', preReformCentreRule),
  question('m3-corpus-004', 'especifico-03', '¿Qué objetivo atribuye la Orden de creación de la JONDE a esta formación?', [
    'Fomentar la vocación artística del músico profesional',
    'Regular la contratación de artistas de cualquier edad',
    'Sustituir a las orquestas profesionales de ámbito estatal'
  ], 'a', 'El artículo 1 incluye como objetivo fomentar la vocación artística del músico profesional.', 'orden-17-10-1983', 'orden-17-10-1983-a1', 'Orden de 17 de octubre de 1983, artículo 1', preReformCentreRule),
  question('m3-corpus-005', 'especifico-03', '¿Cuáles son los órganos directivos de la JONDE según su norma de creación?', [
    'El Presidente del INAEM y la Secretaría General',
    'La Comisión de Dirección del organismo autónomo y el Director de la JONDE',
    'El Consejo de Ministros y el Director General de Presupuestos'
  ], 'b', 'El artículo 2 menciona la Comisión de Dirección del organismo autónomo y el Director de la JONDE.', 'orden-17-10-1983', 'orden-17-10-1983-a2', 'Orden de 17 de octubre de 1983, artículo 2', preReformCentreRule),

  question('m3-corpus-006', 'especifico-41', '¿Qué reconoce el artículo 14 de la Ley de Prevención de Riesgos Laborales?', [
    'Un derecho a la protección eficaz en materia de seguridad y salud en el trabajo',
    'Un derecho limitado a recibir equipos de protección individual',
    'Un derecho aplicable solo a quienes tienen contrato indefinido'
  ], 'a', 'El artículo 14 reconoce el derecho de los trabajadores a una protección eficaz y el deber correlativo de protección del empresario.', 'ley-31-1995', 'ley-31-1995-a14', 'Ley 31/1995, artículo 14'),
  question('m3-corpus-007', 'especifico-41', '¿Cuál es el primer principio de la acción preventiva enumerado en el artículo 15 de la Ley 31/1995?', [
    'Evaluar los riesgos que no puedan evitarse',
    'Evitar los riesgos antes de aplicar medidas posteriores',
    'Trasladar la responsabilidad preventiva a los trabajadores'
  ], 'b', 'El artículo 15 comienza por el principio de evitar los riesgos; los que no puedan evitarse deben evaluarse.', 'ley-31-1995', 'ley-31-1995-a15', 'Ley 31/1995, artículo 15'),
  question('m3-corpus-008', 'especifico-41', '¿Cómo debe integrarse la prevención de riesgos laborales conforme al artículo 16 de la Ley 31/1995?', [
    'Solo en los servicios de prevención externos',
    'Únicamente en la planificación anual de la actividad',
    'En el sistema general de gestión de la empresa y en todos sus niveles jerárquicos'
  ], 'c', 'El artículo 16 exige integrar la prevención en el sistema general de gestión, en el conjunto de actividades y niveles jerárquicos.', 'ley-31-1995', 'ley-31-1995-a16', 'Ley 31/1995, artículo 16'),
  question('m3-corpus-009', 'especifico-41', '¿Cuándo debe recibir formación preventiva cada trabajador?', [
    'Solo después de producirse un accidente de trabajo',
    'Al contratarlo y cuando cambien sus funciones, tecnologías o equipos de trabajo',
    'Únicamente cuando lo solicite por escrito a la empresa'
  ], 'b', 'El artículo 19 exige formación teórica y práctica al contratar y cuando se producen cambios relevantes en funciones, tecnologías o equipos.', 'ley-31-1995', 'ley-31-1995-a19', 'Ley 31/1995, artículo 19'),
  question('m3-corpus-010', 'especifico-41', 'Entre las medidas de emergencia del artículo 20 de la Ley 31/1995 se incluye:', [
    'La elaboración de un plan exclusivamente económico',
    'La suspensión automática de toda actividad cultural durante un año',
    'La organización de primeros auxilios, lucha contra incendios y evacuación'
  ], 'c', 'El artículo 20 exige analizar las emergencias y adoptar medidas de primeros auxilios, lucha contra incendios y evacuación.', 'ley-31-1995', 'ley-31-1995-a20', 'Ley 31/1995, artículo 20'),
  question('m3-corpus-011', 'especifico-41', '¿Quién es responsable de la elaboración, implantación, mantenimiento y revisión del plan de autoprotección?', [
    'El titular de la actividad',
    'La empresa de seguridad contratada',
    'La Comisión Nacional de Protección Civil en todos los casos'
  ], 'a', 'El artículo 4 del Real Decreto 393/2007 atribuye esa responsabilidad al titular de la actividad.', 'rd-393-2007', 'rd-393-2007-a4', 'Real Decreto 393/2007, artículo 4'),
  question('m3-corpus-012', 'especifico-41', 'En una actividad temporal incluida en el anexo I y realizada en un recinto con otra autorización, ¿quién debe elaborar e implantar el plan antes de comenzar?', [
    'El organizador de la actividad temporal',
    'La administración titular del edificio en todos los casos',
    'El público asistente mediante sus representantes'
  ], 'a', 'El artículo 4 obliga al organizador de la actividad temporal a elaborar e implantar previamente el plan.', 'rd-393-2007', 'rd-393-2007-a4', 'Real Decreto 393/2007, artículo 4'),

  question('m3-corpus-013', 'especifico-26', 'A efectos de la Ley 49/2002, ¿cuál de estas entidades puede ser una entidad sin fines lucrativos?', [
    'Una fundación que cumpla los requisitos legales',
    'Cualquier sociedad mercantil con beneficios reducidos',
    'Toda agrupación informal sin personalidad jurídica'
  ], 'a', 'El artículo 2 incluye las fundaciones, siempre que cumplan los requisitos establecidos por la ley.', 'ley-49-2002', 'ley-49-2002-a2', 'Ley 49/2002, artículo 2'),
  question('m3-corpus-014', 'especifico-26', '¿Qué porcentaje mínimo de determinadas rentas deben destinar a sus fines las entidades del artículo 3 de la Ley 49/2002?', [
    'El 25 por ciento',
    'El 50 por ciento',
    'El 70 por ciento'
  ], 'c', 'El artículo 3 exige destinar directa o indirectamente al menos el 70 % de determinadas rentas a los fines de interés general.', 'ley-49-2002', 'ley-49-2002-a3', 'Ley 49/2002, artículo 3'),
  question('m3-corpus-015', 'especifico-26', '¿Cuál de estas entidades aparece entre las beneficiarias del mecenazgo del artículo 16 de la Ley 49/2002?', [
    'El Estado, las comunidades autónomas y las entidades locales',
    'Solo las sociedades mercantiles cotizadas',
    'Únicamente las personas físicas residentes'
  ], 'a', 'El artículo 16 incluye al Estado, las comunidades autónomas, las entidades locales y organismos autónomos, entre otros.', 'ley-49-2002', 'ley-49-2002-a16', 'Ley 49/2002, artículo 16'),

  question('m3-corpus-016', 'especifico-28', '¿Cuál de los siguientes derechos del artículo 14 del texto refundido de la Ley de Propiedad Intelectual es moral?', [
    'El derecho a exigir el reconocimiento de la condición de autor',
    'El derecho a vender ejemplares en cualquier territorio',
    'El derecho a fijar el precio de todas las entradas'
  ], 'a', 'El artículo 14 incluye entre los derechos morales el reconocimiento de la condición de autor; son irrenunciables e inalienables.', 'rdleg-1-1996', 'rdleg-1-1996-a14', 'Real Decreto Legislativo 1/1996, artículo 14'),
  question('m3-corpus-017', 'especifico-28', '¿Qué derechos de explotación enumera expresamente el artículo 17 del texto refundido de la Ley de Propiedad Intelectual?', [
    'Reproducción, distribución, comunicación pública y transformación',
    'Solo exposición, préstamo y archivo administrativo',
    'Únicamente traducción y reconocimiento de autoría'
  ], 'a', 'El artículo 17 enumera reproducción, distribución, comunicación pública y transformación como modalidades de explotación.', 'rdleg-1-1996', 'rdleg-1-1996-a17', 'Real Decreto Legislativo 1/1996, artículo 17'),
  question('m3-corpus-018', 'especifico-28', '¿Qué entiende el artículo 18 por reproducción?', [
    'La fijación de toda la obra o parte de ella que permita comunicarla u obtener copias',
    'Solo la venta de ejemplares físicos al público',
    'Exclusivamente la representación escénica de una obra'
  ], 'a', 'El artículo 18 comprende la fijación directa o indirecta, provisional o permanente, por cualquier medio y forma.', 'rdleg-1-1996', 'rdleg-1-1996-a18', 'Real Decreto Legislativo 1/1996, artículo 18'),
  question('m3-corpus-019', 'especifico-28', 'Para el artículo 19, la distribución consiste en:', [
    'Poner el original o copias a disposición del público en un soporte tangible',
    'Emitir una obra por radio sin soporte material',
    'Modificar la obra para adaptarla a un nuevo público'
  ], 'a', 'El artículo 19 define la distribución como puesta a disposición del público del original o copias en soporte tangible.', 'rdleg-1-1996', 'rdleg-1-1996-a19', 'Real Decreto Legislativo 1/1996, artículo 19'),

  question('m3-corpus-020', 'especifico-11', '¿Cuál es uno de los objetivos de la Ley 16/1985 del Patrimonio Histórico Español?', [
    'La protección, el acrecentamiento y la transmisión a las generaciones futuras del patrimonio histórico español',
    'La gestión, explotación y comercialización de los bienes culturales de titularidad estatal',
    'La financiación, promoción y exportación de las industrias culturales españolas'
  ], 'a', 'El artículo primero fija como objeto la protección, el acrecentamiento y la transmisión a las generaciones futuras.', 'ley-16-1985', 'ley-16-1985-aprimero', 'Ley 16/1985, artículo primero'),
  question('m3-corpus-021', 'especifico-11', 'Según la Ley 10/2015, las actuaciones de salvaguardia del patrimonio cultural inmaterial deben respetar:', [
    'La igualdad y no discriminación, junto con el protagonismo de las comunidades portadoras',
    'La sustitución de las comunidades portadoras por órganos exclusivamente administrativos',
    'La exclusión de toda participación social en la definición de las medidas'
  ], 'a', 'El artículo 3 incluye la igualdad y no discriminación, la participación y el protagonismo de las comunidades portadoras.', 'ley-10-2015', 'ley-10-2015-a3', 'Ley 10/2015, artículo 3'),
  question('m3-corpus-022', 'especifico-11', '¿Qué deben proteger y conservar las Administraciones Públicas conforme al artículo 4 de la Ley 10/2015?', [
    'Los lugares, espacios, itinerarios y soportes materiales vinculados a los bienes inmateriales',
    'Solo los documentos administrativos generados por los ayuntamientos',
    'Únicamente los bienes muebles declarados de interés cultural'
  ], 'a', 'El artículo 4 se refiere a los lugares, espacios, itinerarios y soportes materiales en que descansan los bienes inmateriales.', 'ley-10-2015', 'ley-10-2015-a4', 'Ley 10/2015, artículo 4'),

  question('m3-corpus-023', 'especifico-16', '¿Cuándo exige la Ley Orgánica 3/2007 que las empresas elaboren y apliquen un plan de igualdad?', [
    'Cuando tienen cincuenta o más personas trabajadoras, con el alcance legal',
    'Solo cuando superan quinientas personas trabajadoras',
    'Únicamente cuando lo solicita una persona trabajadora individual'
  ], 'a', 'El artículo 45.2 establece esa obligación para las empresas de cincuenta o más trabajadores.', 'lo-3-2007', 'lo-3-2007-a45', 'Ley Orgánica 3/2007, artículo 45'),
  question('m3-corpus-024', 'especifico-16', '¿Qué debe incluir un plan de igualdad según el artículo 46 de la Ley Orgánica 3/2007?', [
    'Objetivos concretos, estrategias y sistemas eficaces de seguimiento y evaluación',
    'Solo una declaración general de intenciones sin diagnóstico',
    'Exclusivamente medidas salariales aprobadas por la dirección'
  ], 'a', 'El artículo 46 exige objetivos, estrategias y sistemas de seguimiento y evaluación, precedidos de un diagnóstico.', 'lo-3-2007', 'lo-3-2007-a46', 'Ley Orgánica 3/2007, artículo 46'),
  question('m3-corpus-025', 'especifico-16', '¿En qué plazo deben iniciar la negociación del plan de igualdad las empresas obligadas cuando alcanzan la plantilla exigida?', [
    'Dentro de los tres meses siguientes',
    'Dentro de los nueve meses siguientes',
    'Solo al finalizar el año natural'
  ], 'a', 'El artículo 4 del Real Decreto 901/2020 fija un plazo máximo de tres meses para iniciar la negociación.', 'rd-901-2020', 'rd-901-2020-a4', 'Real Decreto 901/2020, artículo 4'),
  question('m3-corpus-026', 'especifico-16', 'El principio de igual retribución por trabajo de igual valor del Real Decreto 902/2020:', [
    'Vincula a todas las empresas, con independencia del número de personas trabajadoras',
    'Solo se aplica a empresas con auditoría retributiva',
    'Solo opera cuando lo establece expresamente un convenio estatal'
  ], 'a', 'El artículo 4 afirma que el principio vincula a todas las empresas y a todos los convenios y acuerdos colectivos.', 'rd-902-2020', 'rd-902-2020-a4', 'Real Decreto 902/2020, artículo 4'),

  question('m3-corpus-027', 'especifico-17', '¿Qué pretende garantizar el texto refundido de la Ley General de derechos de las personas con discapacidad?', [
    'La igualdad de oportunidades, la no discriminación y la accesibilidad universal',
    'Solo el acceso preferente a puestos de empleo público',
    'Únicamente la gratuidad de los servicios culturales'
  ], 'a', 'El artículo 1 formula esos objetivos junto con la inclusión, la autonomía personal y la erradicación de la discriminación.', 'rdleg-1-2013', 'rdleg-1-2013-a1', 'Real Decreto Legislativo 1/2013, artículo 1'),
  question('m3-corpus-028', 'especifico-17', 'Entre los ámbitos de aplicación de las medidas de accesibilidad del artículo 5 del Real Decreto Legislativo 1/2013 se encuentra:', [
    'El patrimonio cultural',
    'Solo la actividad deportiva profesional',
    'Exclusivamente la vivienda privada no abierta al público'
  ], 'a', 'El artículo 5 incluye expresamente el patrimonio cultural, además de otros ámbitos.', 'rdleg-1-2013', 'rdleg-1-2013-a5', 'Real Decreto Legislativo 1/2013, artículo 5'),
  question('m3-corpus-029', 'especifico-17', '¿Qué regula principalmente el Real Decreto 193/2023?', [
    'Las condiciones básicas de accesibilidad y no discriminación para bienes y servicios a disposición del público',
    'La organización interna, la jerarquía administrativa y la gestión de los museos estatales',
    'El régimen fiscal, las subvenciones y la financiación de las entidades culturales sin fines lucrativos'
  ], 'a', 'El artículo 1 define ese objeto y añade medidas de acción positiva y apoyos complementarios.', 'rd-193-2023', 'rd-193-2023-a1', 'Real Decreto 193/2023, artículo 1'),
  question('m3-corpus-030', 'especifico-17', '¿Cuándo quedan excluidas las condiciones básicas del Real Decreto 193/2023?', [
    'Cuando una regulación específica de servicios públicos o de interés general garantice la accesibilidad y la no discriminación',
    'Cuando una norma cultural permita prestar el servicio sin medidas adicionales de accesibilidad universal',
    'Cuando el servicio sea público y su regulación sectorial no contenga medidas de accesibilidad'
  ], 'a', 'El artículo 4 establece la exclusión cuando una regulación específica garantiza suficientemente la accesibilidad y la no discriminación.', 'rd-193-2023', 'rd-193-2023-a4', 'Real Decreto 193/2023, artículo 4'),

  question('m3-corpus-031', 'especifico-44', '¿Qué principios rigen la programación presupuestaria según el artículo 26 de la Ley General Presupuestaria?', [
    'Estabilidad presupuestaria, sostenibilidad financiera, plurianualidad, transparencia y eficiencia en los recursos públicos',
    'Anualidad, confidencialidad, discrecionalidad y concentración del gasto en cada organismo estatal',
    'Autonomía financiera, libertad de gasto y ausencia de límites plurianuales para cada centro'
  ], 'a', 'El artículo 26 enumera, entre otros, estabilidad, sostenibilidad, plurianualidad, transparencia y eficiencia.', 'ley-47-2003', 'ley-47-2003-a26', 'Ley 47/2003, artículo 26'),
  question('m3-corpus-032', 'especifico-44', '¿Cuál es el límite general de ejercicios al que pueden aplicarse los compromisos de gasto plurianual?', [
    'Dos ejercicios posteriores',
    'Cuatro ejercicios posteriores',
    'Diez ejercicios posteriores'
  ], 'b', 'El artículo 47 establece que el número de ejercicios no será superior a cuatro, con las condiciones y porcentajes legales.', 'ley-47-2003', 'ley-47-2003-a47', 'Ley 47/2003, artículo 47'),
  question('m3-corpus-033', 'especifico-44', '¿Qué caracteriza a una subvención conforme al artículo 2 de la Ley 38/2003?', [
    'Una disposición dineraria pública sin contraprestación directa, vinculada a un objetivo o actividad concreta',
    'Un préstamo público reembolsable con intereses y garantías pactadas con la entidad beneficiaria',
    'Un pago contractual público por un servicio recibido de un proveedor seleccionado'
  ], 'a', 'El artículo 2 exige, entre otros elementos, ausencia de contraprestación directa y vinculación a un objetivo, proyecto, actividad o situación.', 'ley-38-2003', 'ley-38-2003-a2', 'Ley 38/2003, artículo 2')
];

const existing = new Set(questions.map(item => item.id));
const additionsById = new Map(additions.map(item => [item.id, item]));
const fresh = additions.filter(item => !existing.has(item.id));
const updated = questions.map(item => additionsById.get(item.id) || item);
await writeFile(questionsPath, `${JSON.stringify([...updated, ...fresh], null, 2)}\n`, 'utf8');
console.log(`Preguntas de corpus añadidas: ${fresh.length}; revisadas: ${additions.length - fresh.length}`);
