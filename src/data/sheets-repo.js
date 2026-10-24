import { dbPut, dbGetAllByIndex } from './db.js'

const STORE = 'sheets'

export function saveSheetResult(sheetResult) {
  return dbPut(STORE, sheetResult)
}

export function listSheetsByStudentSubject(studentId, subject) {
  return dbGetAllByIndex(STORE, 'byStudentSubject', [studentId, subject])
}

export async function getLastSheet(studentId, subject) {
  const sheets = await listSheetsByStudentSubject(studentId, subject)
  if (sheets.length === 0) return null
  return sheets.sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))[0]
}
