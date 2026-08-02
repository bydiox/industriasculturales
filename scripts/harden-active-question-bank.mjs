import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const questionsPath = join(root, 'data/questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));
const byId = new Map(questions.map(question => [question.id, question]));
const reviewedAt = '2026-08-02';

function replaceOption(question, optionId, text) {
  const option = question.options.find(item => item.id === optionId);
  if (!option) throw new Error(`No existe la opción ${optionId} en ${question.id}`);
  option.text = text;
}

function review(question, note) {
  question.editorialReview = {
    status: 'reviewed-for-current-m3-bank',
    reviewedAt,
    reviewer: 'codex',
    note
  };
}

function preserveOfficialSource(question) {
  if (question.officialSource?.kind === 'official_exam') return;
  question.officialSource = {
    kind: 'official_exam',
    reference: `${question.origin?.label || 'Cuestionario oficial'} · pregunta ${question.origin?.questionNumber || question.origin?.numeroOriginal || ''}`.trim(),
    note: 'Las tres opciones originales proceden del cuestionario oficial; la cuarta y, cuando se indica, la clave se han revisado para el formato y el Derecho vigentes.'
  };
}

const workerDuty = byId.get('m1-cultura-asistencia-2023-51');
preserveOfficialSource(workerDuty);
replaceOption(workerDuty, 'd', 'Elegir por iniciativa propia el equipo de protección que debe facilitar la empresa.');
workerDuty.explanation = 'El artículo 29 de la Ley 31/1995 obliga a usar correctamente máquinas, herramientas, sustancias y equipos de protección, y a no inutilizar los dispositivos de seguridad. La evaluación del puesto corresponde a la empresa; el trabajador no elige unilateralmente los equipos. La paralización colectiva sigue el procedimiento previsto para un riesgo grave e inminente.';
workerDuty.source = {
  lawId: 'ley-31-1995',
  anchorId: 'ley-31-1995-a29',
  reference: 'Ley 31/1995, artículo 29',
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292'
};
review(workerDuty, 'Se sustituyó un cuarto distractor que también era una obligación legal del trabajador.');

const delegates = byId.get('m1-cultura-comun-2023-17');
delegates.prompt = 'Según la tabla del artículo 35.2 de la Ley 31/1995, de Prevención de Riesgos Laborales, ¿qué plantilla corresponde a cinco Delegados de Prevención?';
replaceOption(delegates, 'd', '3.001 a 4.000 trabajadores.');
delegates.explanation = 'La escala del artículo 35.2 de la Ley 31/1995 asigna cinco Delegados de Prevención a empresas de 1.001 a 2.000 trabajadores. Los demás intervalos corresponden a otro número de delegados.';
delegates.source.anchorId = 'ley-31-1995-a35';
delegates.source.reference = 'Ley 31/1995, artículo 35.2';
review(delegates, 'Se eliminó una opción que repetía literalmente la respuesta correcta y se corrigió el artículo citado.');

const slings = byId.get('m1-cultura-iluminacion-2023-48');
replaceOption(slings, 'd', 'Sí, siempre que la carga permanezca por debajo de la mitad de la WLL.');
slings.explanation = 'Las eslingas textiles son sensibles al calor: una temperatura elevada puede degradar sus fibras y reducir su resistencia. Respetar una fracción de la carga máxima de uso no elimina ese riesgo térmico.';
review(slings, 'Se retiró un distractor contradictorio que explicaba el mismo riesgo de la respuesta correcta.');

const lifting = byId.get('m1-cultura-iluminacion-2023-49');
lifting.prompt = '¿Qué documento permite acreditar que un equipo de elevación recibe el mantenimiento y las revisiones previstos?';
replaceOption(lifting, 'A', 'La hoja de carga utilizada durante el último montaje.');
replaceOption(lifting, 'B', 'El registro actualizado de mantenimiento y revisiones.');
replaceOption(lifting, 'C', 'La relación nominal del personal que trabaja en escena.');
replaceOption(lifting, 'd', 'El plano de implantación de la escenografía.');
lifting.correctOptionId = 'B';
lifting.explanation = 'El registro de mantenimiento y revisiones deja constancia de las comprobaciones realizadas al equipo. La hoja de carga, la relación de personal y el plano de implantación tienen otras finalidades y no acreditan por sí solos su mantenimiento.';
review(lifting, 'La pregunta se reformuló para que solo exista una respuesta correcta y se eliminaron afirmaciones acumulativas.');

const eInvoice = byId.get('m1-cultura-produccion-2023-54');
replaceOption(eInvoice, 'd', 'Es una factura emitida en papel que después se escanea únicamente para archivarla.');
eInvoice.explanation = 'Una factura electrónica se expide y se recibe en formato electrónico. Enviarla por correo puede ser un canal, pero no define por sí solo el concepto; escanear una factura en papel tampoco convierte su emisión original en electrónica.';
review(eInvoice, 'Se sustituyó una segunda definición válida por un distractor inequívoco del mismo campo.');

const eInvoiceAdvantage = byId.get('m1-cultura-produccion-2023-57');
eInvoiceAdvantage.prompt = '¿Qué efecto puede producir la factura electrónica sobre el ciclo de tramitación y cobro?';
replaceOption(eInvoiceAdvantage, 'A', 'Obliga a duplicar la tramitación en papel antes del pago.');
replaceOption(eInvoiceAdvantage, 'B', 'Impide automatizar la recepción y la validación de datos.');
replaceOption(eInvoiceAdvantage, 'C', 'Puede acortar el ciclo de tramitación, incluido el cobro.');
replaceOption(eInvoiceAdvantage, 'd', 'Retrasa el registro hasta que se imprime el documento.');
eInvoiceAdvantage.explanation = 'La factura electrónica puede acelerar la recepción, validación y contabilización, reduciendo el ciclo de tramitación y cobro. No exige una copia previa en papel ni impide la automatización.';
review(eInvoiceAdvantage, 'Se acotó el enunciado porque el cuarto distractor anterior también describía una ventaja real.');

const expenseBalance = byId.get('m1-cultura-produccion-2023-69');
replaceOption(expenseBalance, 'A', 'Las salidas previstas o realizadas, tanto fijas como variables, incluidos los gastos imprevistos.');
replaceOption(expenseBalance, 'B', 'Solo las salidas fijas, como alquileres, suministros y nóminas.');
replaceOption(expenseBalance, 'C', 'Solo los gastos imprevistos surgidos durante la actividad.');
replaceOption(expenseBalance, 'd', 'Solo los pagos ya efectuados, excluyendo cualquier compromiso pendiente.');
expenseBalance.explanation = 'Un balance o control de gastos debe ofrecer una visión completa: gastos fijos, variables e imprevistos, no una sola categoría. Limitarlo a pagos efectuados también ocultaría compromisos que deben controlarse.';
review(expenseBalance, 'Se corrigió una errata y se igualó la extensión de las cuatro respuestas.');

const weeklyHours = byId.get('m1-cultura-produccion-2023-78');
preserveOfficialSource(weeklyHours);
weeklyHours.correctOptionId = 'B';
replaceOption(weeklyHours, 'B', '37,5 horas semanales.');
replaceOption(weeklyHours, 'C', '40 horas semanales.');
replaceOption(weeklyHours, 'd', '35 horas semanales.');
replaceOption(weeklyHours, 'A', '37 horas semanales.');
weeklyHours.explanation = 'El artículo 64.1 del IV Convenio Único fija con carácter general una jornada máxima de 37,5 horas semanales de trabajo efectivo y 1.642 horas anuales. La respuesta histórica de 40 horas no coincide con el texto consolidado que debe estudiarse ahora.';
weeklyHours.source = {
  lawId: 'convenio-iv',
  anchorId: 'convenio-iv-a6-6',
  reference: 'IV Convenio Único, artículo 64.1',
  url: 'https://www.boe.es/eli/es/res/2019/05/13/(1)/con'
};
weeklyHours.sourceReview = {
  status: 'corrected-against-current-consolidated-text',
  reviewedAt,
  note: 'Se corrige la clave importada: el texto consolidado fija 37,5 horas semanales.'
};
review(weeklyHours, 'Respuesta actualizada contra el artículo 64.1 del texto consolidado.');

const grants = byId.get('m1-cultura-produccion-2023-107');
preserveOfficialSource(grants);
replaceOption(grants, 'd', 'Sí, si proceden de administraciones diferentes, aunque en conjunto superen el coste.');
grants.explanation = 'La concurrencia de subvenciones es posible, pero su importe total no puede superar el coste de la actividad subvencionada. Que las ayudas procedan de administraciones distintas no permite sobrepasar ese límite.';
grants.source = {
  lawId: 'ley-38-2003',
  anchorId: 'ley-38-2003-a19',
  reference: 'Ley 38/2003, artículo 19.3',
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2003-20977'
};
review(grants, 'Se eliminó una paráfrasis que duplicaba la respuesta correcta.');

for (const question of questions.filter(item => item.optionMigration?.source === 'm1-pool5-curated')) {
  if (!question.editorialReview) review(question, 'Revisión manual de la cuarta opción: se mantiene por ser plausible, homogénea y no duplicar la respuesta correcta.');
}

let deactivated = 0;
for (const question of questions) {
  const active = question.active === true || (question.active !== false && question.origin?.historical !== true);
  if (!active || !question.source?.lawId || question.source.anchorId || question.source.kind === 'official_exam') continue;
  question.active = false;
  question.editorialStatus = 'pending-current-law-and-anchor-review';
  question.sourceReview = {
    status: 'pending-current-law-and-anchor-review',
    reviewedAt,
    reason: 'La pregunta citaba una norma sin señalar el precepto exacto. Se conserva fuera del banco activo hasta verificar simultáneamente respuesta vigente y ancla.'
  };
  deactivated += 1;
}

await writeFile(questionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`Preguntas M1 revisadas: ${questions.filter(item => item.optionMigration?.source === 'm1-pool5-curated').length}`);
console.log(`Preguntas sin ancla retiradas temporalmente del banco activo: ${deactivated}`);
