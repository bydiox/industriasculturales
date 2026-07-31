export function examScore({ correct, wrong, expectedQuestions, maximumPoints, penaltyFraction = 1 / 3 }) {
  const valuePerCorrect = maximumPoints / expectedQuestions;
  return (correct - (wrong * penaltyFraction)) * valuePerCorrect;
}

export function penaltyFraction(config) {
  return config === 'one_third_of_correct_answer' ? 1 / 3 : 0;
}
