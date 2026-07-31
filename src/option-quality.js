export function optionProblems(question) {
  const ids = question.options.map(option => option.id);
  const texts = question.options.map(option => option.text.trim().toLocaleLowerCase('es-ES'));
  const problems = [];
  if (new Set(ids).size !== ids.length) problems.push('IDs de opciones duplicados');
  if (new Set(texts).size !== texts.length) problems.push('textos de opciones duplicados');
  if (!ids.includes(question.correctOptionId)) problems.push('respuesta correcta inexistente');
  return problems;
}

export function correctPositionCounts(questions, expectedOptions) {
  const counts = Array(expectedOptions).fill(0);
  for (const question of questions) {
    if (question.options.length !== expectedOptions) continue;
    const position = question.options.findIndex(option => option.id === question.correctOptionId);
    if (position >= 0) counts[position] += 1;
  }
  return counts;
}
