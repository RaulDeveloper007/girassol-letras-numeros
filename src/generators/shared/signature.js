export function sheetSignature(exercises) {
  return exercises
    .map((exercise) => `${exercise.type}:${JSON.stringify(exercise.display)}:${exercise.expectedAnswer ?? exercise.correctValue ?? ''}`)
    .join('|')
}
