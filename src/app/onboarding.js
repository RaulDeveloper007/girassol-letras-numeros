import { createStudent } from '../data/students-repo.js'
import { saveProgress } from '../data/subject-progress-repo.js'
import { getInitialLevelsForAge } from './age-level-mapping.js'

const SUBJECTS = ['math', 'portuguese', 'english']

export async function createStudentProfile({ firstName, age, avatarIcon }) {
  const student = await createStudent({ firstName, age, avatarIcon })
  const levels = getInitialLevelsForAge(age)
  const now = new Date().toISOString()

  for (const subject of SUBJECTS) {
    await saveProgress({ studentId: student.id, subject, level: levels[subject], levelSince: now })
  }

  return student
}
