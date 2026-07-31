import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const fourth = {
  // Sonido, iluminación y electricidad escénica (especifico-33)
  'm1-cultura-asistencia-2023-75': 'Aquel que combina cajas de rango completo y subgraves en una misma agrupación.',
  'm1-cultura-asistencia-2023-77': 'Es la oposición que presenta un circuito al paso de la corriente alterna; se expresa en ohmios.',
  'm1-cultura-asistencia-2023-78': 'Es el tiempo que tarda una onda en completar un ciclo.',
  'm1-cultura-asistencia-2023-79': '1.500 m/s.',
  'm1-cultura-asistencia-2023-80': 'Reverberación.',
  'm1-cultura-asistencia-2023-81': 'Interferencias.',
  'm1-cultura-asistencia-2023-88': 'Es un interruptor que protege frente a contactos indirectos mediante la detección de corrientes de fuga.',
  'm1-cultura-asistencia-2023-89': 'Regulador de intensidad.',
  'm1-cultura-asistencia-2023-90': 'Lámpara de halogenuros metálicos.',
  'm1-cultura-asistencia-2023-91': 'Proyector de haz paralelo.',
  'm1-cultura-asistencia-2023-92': 'Blanco.',

  // Escenografía y maquinaria (especifico-31)
  'm1-cultura-asistencia-2023-64': 'Ciclorama.',
  'm1-cultura-asistencia-2023-65': 'Telón de fondo.',
  'm1-cultura-asistencia-2023-67': 'Un carro de tiro que se desplaza por la vara.',
  'm1-cultura-asistencia-2023-68': 'La revisión de los tiros y contrapesos.',
  'm1-cultura-maquinaria-2023-37': 'Boca.',
  'm1-cultura-maquinaria-2023-55': 'Una escotadura practicable en un bastidor.',
  'm1-cultura-maquinaria-2023-61': 'Goma EVA.',

  // Prevención de riesgos y seguridad escénica (especifico-41)
  'm1-cultura-asistencia-2023-48': 'Al Instituto Nacional de Seguridad y Salud en el Trabajo.',
  'm1-cultura-asistencia-2023-49': 'Combatir los riesgos en su origen.',
  'm1-cultura-asistencia-2023-50': 'El fabricante del equipo de trabajo.',
  'm1-cultura-asistencia-2023-51': 'Informar de inmediato de cualquier situación de riesgo.',
  'm1-cultura-asistencia-2023-52': 'Coordinar sus actividades preventivas.',
  'm1-cultura-asistencia-2023-53': 'Mantenimiento de avería.',
  'm1-cultura-asistencia-2023-54': 'Factor de caída libre.',
  'm1-cultura-asistencia-2023-55': 'Trabajador designado.',
  'm1-cultura-comun-2023-13': 'El Comité de Seguridad y Salud.',
  'm1-cultura-comun-2023-15': 'Entre 14 y 25 ºC.',
  'm1-cultura-comun-2023-17': 'Entre 1.001 y 2.000 trabajadores.',
  'm1-cultura-iluminacion-2023-48': 'Sí, porque el calor puede deteriorar las fibras y reducir su resistencia.',
  'm1-cultura-iluminacion-2023-49': 'La carga debe repartirse de forma uniforme entre los puntos de suspensión.',

  // Gestión económica y subvenciones (especifico-44)
  'm1-cultura-produccion-2023-54': 'Es una factura que se genera, transmite y conserva en formato electrónico estructurado.',
  'm1-cultura-produccion-2023-57': 'Facilita la integración automática con los sistemas de contabilidad.',
  'm1-cultura-produccion-2023-58': 'IRPF.',
  'm1-cultura-produccion-2023-63': 'Herramienta que refleja el beneficio contable sin considerar los cobros y pagos.',
  'm1-cultura-produccion-2023-69': 'Solo deberá incluir los pagos efectuados, excluyendo los compromisos pendientes.',
  'm1-cultura-produccion-2023-106': 'Publicidad, transparencia, eficacia, igualdad y no discriminación.',
  'm1-cultura-produccion-2023-107': 'Sí, siempre que la suma no supere el coste de la actividad subvencionada.',
  'm1-cultura-produccion-2023-108': 'Ley 37/2003, de 17 de noviembre.',

  // IV Convenio Único (comun-13)
  'm1-cultura-comun-2023-23': 'El Convenio se aplica únicamente al personal funcionario de la Administración General del Estado.',
  'm1-cultura-comun-2023-24': 'Certificado profesional de nivel 3 o equivalente.',
  'm1-cultura-comun-2023-25': 'El Museo Nacional del Prado.',
  'm1-cultura-comun-2023-26': 'Agrupa únicamente los puestos con idéntica denominación.',
  'm1-cultura-comun-2023-27': 'Es el órgano encargado de resolver los procesos selectivos del personal laboral.',
  'm1-cultura-produccion-2023-78': '35 horas semanales.',
  'm1-cultura-produccion-2023-80': 'Artículo 35.6.',
};

const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const selected = questions.filter((question) => Object.hasOwn(fourth, question.id));
const missing = Object.keys(fourth).filter((id) => !questions.some((question) => question.id === id));
if (missing.length) throw new Error(`Faltan preguntas del lote: ${missing.join(', ')}`);
for (const question of selected) {
  if (question.options.length !== 3) throw new Error(`${question.id}: no conserva sus tres opciones oficiales`);
  const text = fourth[question.id];
  if (question.options.some((option) => option.text.trim().toLocaleLowerCase('es-ES') === text.trim().toLocaleLowerCase('es-ES'))) {
    throw new Error(`${question.id}: distractor duplicado`);
  }
  question.options = [...question.options, { id: 'd', text }];
  const hash = [...question.id].reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7);
  const shift = hash % 4;
  question.options = question.options.slice(shift).concat(question.options.slice(0, shift));
  question.optionCount = 4;
  question.optionsOrigin = { A: 'official_exam', B: 'official_exam', C: 'official_exam', d: 'editorial' };
  question.optionMigration = {
    version: 1,
    migratedAt: '2026-07-31',
    source: 'm1-pool5-curated',
    editorialNote: 'Cuarta opción revisada como distractor del mismo campo semántico; las tres primeras proceden del cuestionario oficial M1.'
  };
  question.source = {
    ...question.source,
    kind: 'official_exam',
    note: 'Tres opciones proceden del cuestionario oficial M1; la cuarta es una ampliación editorial para el formato de cuatro opciones.'
  };
}
await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Migradas ${selected.length} preguntas M1 con distractores curatoriales.`);
