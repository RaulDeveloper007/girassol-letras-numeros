import { dbPut, dbGetAllByIndex } from './db.js'

const STORE = 'attempts'

export function saveAttempt(attempt) {
  return dbPut(STORE, attempt)
}

export function listAttemptsByStudentSubject(studentId, subject) {
  return dbGetAllByIndex(STORE, 'byStudentSubject', [studentId, subject])
}
