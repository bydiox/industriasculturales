import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

const fourthOptions = {
  'm3-oficial-igualdad-2023-05': 'Corresponde a las Cortes Generales promover las condiciones para que la libertad y la igualdad sean reales y efectivas.',
  'm3-oficial-igualdad-2023-06': 'Expedir los decretos acordados por las Cortes Generales y ordenar su publicación.',
  'm3-oficial-igualdad-2023-07': 'El Presidente del Congreso de los Diputados, mientras dure la inhabilitación.',
  'm3-oficial-igualdad-2023-08': 'La reforma constitucional y la aprobación de leyes orgánicas.',
  'm3-oficial-igualdad-2023-09': 'Al Congreso de los Diputados.',
  'm3-oficial-igualdad-2023-10': 'El Senado.',
  'm3-oficial-igualdad-2023-11': 'Carecen de personalidad jurídica propia y dependen de la Comunidad Autónoma.',
  'm3-oficial-igualdad-2023-17': 'Los dictados por órgano manifiestamente incompetente por razón de materia o territorio.',
  'm3-oficial-igualdad-2023-20': 'Mediante planes externos al horario de trabajo ordinario.',
  'm3-oficial-igualdad-2023-21': 'A la Dirección General de la Función Pública, sin intervención del departamento de adscripción.',
  'm3-oficial-igualdad-2023-22': '4 por ciento.',
  'm3-oficial-igualdad-2023-23': 'Una vez cada dos meses.',
  'm3-oficial-igualdad-2023-24': 'Igualdad, transparencia y estabilidad presupuestaria.',
  'm3-oficial-igualdad-2023-34': 'La libertad de empresa y la economía de mercado.',
  'm3-oficial-igualdad-2023-35': 'Legalidad, jerarquía normativa, publicidad y seguridad jurídica.',
  'm3-oficial-igualdad-2023-71': 'Por delegación del Congreso y en nombre de las Cortes Generales.',
  'm3-oficial-igualdad-2023-72': 'El municipio.',
  'm3-oficial-igualdad-2023-73': 'Decreto legislativo de refundición.',
  'm3-oficial-igualdad-2023-01': 'Aprobar medidas de conciliación solo cuando no afecten a la promoción profesional.',
  'm3-oficial-igualdad-2023-27': 'Al Tribunal de Cuentas, con aprobación posterior del Gobierno.',
  'm3-oficial-igualdad-2023-28': 'Ante el Senado en el primer mes del ejercicio presupuestario.',
  'm3-oficial-igualdad-2023-29': 'Ordenar por sí mismos la suspensión inmediata de cualquier contrato de trabajo.',
  'm3-oficial-igualdad-2023-30': 'Un conjunto de recomendaciones sin diagnóstico previo de situación.',

  'm3-cultura-comun-2023-01': 'Competencia, delegación, avocación y encomienda de gestión.',
  'm3-cultura-comun-2023-02': 'Identificar únicamente el medio electrónico elegido para recibir notificaciones.',
  'm3-cultura-comun-2023-03': 'Los actos que incurran en cualquier defecto formal subsanable.',
  'm3-cultura-comun-2023-04': 'Contrato mixto.',
  'm3-cultura-comun-2023-07': 'Un plan de contratación pública con los expedientes previstos para el ejercicio.',
  'm3-cultura-comun-2023-08': 'La Administración requerida puede negar la colaboración si el acto produce efectos fuera de su territorio.',
  'm3-cultura-comun-2023-09': 'Cuando el último día sea inhábil, el plazo se entiende vencido el día natural anterior.',
  'm3-cultura-comun-2023-11': 'Su condición constituye mérito preferente para el acceso a la función pública.',
  'm3-cultura-comun-2023-12': 'El traslado exige siempre una vacante de necesaria cobertura en la misma localidad.',
  'm3-cultura-comun-2023-13': 'Debe mediar preaviso de quince días para extinguir la relación durante la prueba.',
  'm3-cultura-comun-2023-14': 'La suspensión provisional puede prolongarse hasta la resolución judicial firme en todo caso.',
  'm3-cultura-comun-2023-16': 'Estado autonómico federal.',
  'm3-cultura-comun-2023-17': 'El artículo 35 de la Constitución española.',
  'm3-cultura-comun-2023-18': 'De dos meses para M3 y M2 y de quince días para el personal sin titulación.',
  'm3-cultura-comun-2023-19': 'La inmunidad absoluta frente a cualquier procedimiento penal durante el mandato.',
  'm3-cultura-comun-2023-20': 'Que el refrendo convierte al Rey en responsable político del acto refrendado.',
  'm3-cultura-comun-2023-21': 'Nombrar directamente a los presidentes de las Comunidades Autónomas.',
  'm3-cultura-comun-2023-22': 'Las funciones que le atribuya el Consejo de Ministros en cada legislatura.',
  'm3-cultura-comun-2023-24': 'Veinte escaños o, alternativamente, el diez por ciento nacional.',
  'm3-cultura-comun-2023-25': 'Al Congreso, al Senado y a las asambleas de las comunidades autónomas.',
  'm3-cultura-comun-2023-26': 'Autorización del gasto, contratación, reconocimiento del crédito y pago material.',
  'm3-cultura-comun-2023-27': 'Los créditos destinados a subvenciones nominativas de carácter cultural.',
  'm3-cultura-comun-2023-28': 'La Dirección General de Presupuestos, con dependencia funcional del Tribunal de Cuentas.',
  'm3-cultura-comun-2023-29': 'La Ley 39/2015, de Procedimiento Administrativo Común.',
  'm3-cultura-comun-2023-32': 'Soberanía nacional, unidad territorial y seguridad jurídica.',
  'm3-cultura-comun-2023-33': 'Supongan una modificación del procedimiento legislativo ordinario.',
  'm3-cultura-comun-2023-34': 'La promoción del deporte y la adecuada utilización del ocio.',
  'm3-cultura-comun-2023-35': 'Cuando se publica la relación de aprobados en el boletín correspondiente.',
  'm3-cultura-comun-2023-r1': 'Solo cuando lo establezca el convenio colectivo aplicable.',
  'm3-cultura-comun-2023-r2': 'Decreto legislativo autorizado por ley de bases.',
  'm3-cultura-comun-2023-r3': 'A los Estados miembros, sin intervención de instituciones de la Unión.',

  'm1-cultura-comun-2023-01': 'El 31 de octubre.',
  'm1-cultura-comun-2023-05': 'El Consejo General del Poder Judicial.',
  'm1-cultura-comun-2023-07': 'Al personal directivo profesional.',
  'm1-cultura-comun-2023-08': 'La negociación colectiva como derecho individual.',
  'm1-cultura-comun-2023-09': 'El que, por nombramiento legal, desempeña servicios retribuidos de carácter permanente.',
  'm1-cultura-comun-2023-10': 'Cada tres años desde la aprobación del plan anterior.',
  'm1-cultura-comun-2023-11': 'Acoso por razón de sexo.',
  'm1-cultura-comun-2023-18': 'Ante el Senado.',
  'm1-cultura-comun-2023-19': 'Debe ser propuesta por el Presidente del Gobierno e incluir un candidato alternativo.',
  'm1-cultura-comun-2023-20': 'Por el Consejo de Ministros, a propuesta del Director General correspondiente.',
  'm1-cultura-comun-2023-21': 'Autorizar la celebración de tratados internacionales.',
  'm1-cultura-comun-2023-22': 'Autorizar la celebración de referéndums consultivos previstos en la Constitución.',
  'm1-cultura-comun-2023-30': '1 por ciento.',

  'm1-cultura-sonido-2023-92': '25 lux.',
  'm1-cultura-sonido-2023-94': 'Cuando lo solicite la representación legal de los trabajadores, sin valorar el riesgo.',
  'm1-cultura-realizacion-2023-89': 'Cuando el trabajador prefiera sustituir medidas colectivas por protección individual.',
  'm1-cultura-iluminacion-2023-53': 'Mayor de 3,5 metros.',
  'm1-cultura-produccion-2023-51': 'Real Decreto 607/2026, de 22 de julio, como régimen vigente antes de mayo de 2027.',
  'm1-cultura-produccion-2023-56': 'Ley 39/2015, de 1 de octubre.',
  'm1-cultura-produccion-2023-89': 'Ley 40/2015, de 1 de octubre.'
};

const byId = new Map(questions.map(question => [question.id, question]));
const variants = [];

for (const [baseId, fourthText] of Object.entries(fourthOptions)) {
  const base = byId.get(baseId);
  if (!base) throw new Error(`No existe la pregunta base: ${baseId}`);
  if (byId.has(`${baseId}-B`)) continue;
  if (!base.source?.lawId || !base.source?.anchorId) {
    throw new Error(`La pregunta base no está anclada: ${baseId}`);
  }
  if (base.options.length !== 3) {
    throw new Error(`La pregunta base no tiene 3 opciones: ${baseId}`);
  }
  const optionId = base.options.some(option => option.id === 'D') ? 'd' : 'D';
  const optionTexts = new Set(base.options.map(option => option.text.trim().toLowerCase()));
  if (optionTexts.has(fourthText.trim().toLowerCase())) {
    throw new Error(`Cuarto distractor duplicado en ${baseId}`);
  }
  variants.push({
    ...base,
    id: `${baseId}-B`,
    options: [...base.options, { id: optionId, text: fourthText }],
    optionCount: 4,
    origin: {
      type: 'own_variant',
      variantOf: baseId,
      label: `Variante propia B de ${baseId}`,
      basedOn: base.origin?.label || 'Pregunta oficial histórica',
      historical: false
    },
    explanation: `${base.explanation || 'Pregunta oficial revisada.'} Fuente de estudio: ${base.source.reference}.`,
    active: true,
    variantPolicy: {
      createdAt: '2026-08-01',
      rule: 'Variante propia con cuarta opción; la pregunta oficial original conserva sus tres opciones.'
    }
  });
}

questions.push(...variants);
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Creadas ${variants.length} variantes B de preguntas oficiales ancladas.`);
