import { saveSheetResult } from '../data/sheets-repo.js'
import { saveAttempt, listAttemptsByStudentSubject } from '../data/attempts-repo.js'
import { getProgress, saveProgress } from '../data/subject-progress-repo.js'
import { getRules } from '../data/progression-rules-repo.js'
import { MAX_LEVEL, getStageInfo } from '../levels/stage-names.js'
import { createId } from '../generators/shared/id.js'

/**
 * Persiste o resultado da folha, grava a tentativa resumida para o painel
 * do responsável, e aplica a regra de avanço (X folhas seguidas no mesmo
 * nível, com acerto >= Y% e tempo <= Z segundos).
 */
export async function completeSheet({ studentId, sheet, exerciseResults, elapsedSeconds }) {
  const gradedResults = exerciseResults.filter((result) => result?.graded)
  const correctCount = gradedResults.filter((result) => result.isCorrect).length
  const totalGraded = gradedResults.length
  const accuracyRate = totalGraded > 0 ? Math.round((correctCount / totalGraded) * 100) : 100

  const now = new Date().toISOString()

  const exercisesWithAnswers = sheet.exercises.map((exercise, i) => ({
    ...exercise,
    studentAnswer: exerciseResults[i]?.studentAnswer ?? null,
    isCorrect: exerciseResults[i]?.isCorrect ?? null,
  }))

  await saveSheetResult({
    id: sheet.id,
    studentId,
    subject: sheet.subject,
    level: sheet.level,
    stageName: sheet.stageName,
    exercises: exercisesWithAnswers,
    startedAt: sheet.startedAt,
    finishedAt: now,
    correctCount,
    totalCount: totalGraded,
    elapsedSeconds,
  })

  const recurrentErrorTags = gradedResults
    .map((result, i) => (!result.isCorrect ? sheet.exercises[i].type : null))
    .filter(Boolean)

  await saveAttempt({
    id: createId(),
    studentId,
    subject: sheet.subject,
    level: sheet.level,
    date: now,
    accuracyRate,
    elapsedSeconds,
    avgTimeSeconds: totalGraded > 0 ? Math.round(elapsedSeconds / totalGraded) : elapsedSeconds,
    recurrentErrorTags,
  })

  const rules = await getRules(sheet.subject)
  const allAttempts = await listAttemptsByStudentSubject(studentId, sheet.subject)
  const sameLevelAttempts = allAttempts
    .filter((attempt) => attempt.level === sheet.level)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const recentWindow = sameLevelAttempts.slice(0, rules.sheetsRequired)
  const meetsStreakRule =
    recentWindow.length >= rules.sheetsRequired &&
    recentWindow.every((attempt) => attempt.accuracyRate >= rules.minAccuracy && attempt.elapsedSeconds <= rules.maxTimeSeconds)

  // Acertar tudo numa folha já avança de nível, sem precisar esperar a
  // sequência de folhas da regra configurável abaixo.
  const perfectSheet = totalGraded > 0 && correctCount === totalGraded
  const meetsRule = perfectSheet || meetsStreakRule

  let leveledUp = false
  let newLevel = sheet.level

  if (meetsRule && sheet.level < MAX_LEVEL) {
    newLevel = sheet.level + 1
    leveledUp = true
    const progress = await getProgress(studentId, sheet.subject)
    await saveProgress({ ...progress, level: newLevel, levelSince: now })
  }

  return {
    correctCount,
    totalGraded,
    totalExercises: sheet.exercises.length,
    accuracyRate,
    elapsedSeconds,
    leveledUp,
    newStage: getStageInfo(newLevel),
  }
}
