import { dbGet, dbGetAll, dbPut, dbDelete } from './db.js'
import { createId } from '../generators/shared/id.js'

const STORE = 'students'

export function listStudents() {
  return dbGetAll(STORE)
}

export function getStudent(id) {
  return dbGet(STORE, id)
}

export function saveStudent(student) {
  return dbPut(STORE, student)
}

export function deleteStudent(id) {
  return dbDelete(STORE, id)
}

// Dado coletado além do primeiro nome: só a idade, usada uma vez para
// calibrar o nível inicial pela série escolar correspondente. Nada sai do
// aparelho.
export async function createStudent({ firstName, age, avatarIcon }) {
  const student = {
    id: createId(),
    firstName,
    age,
    avatarIcon,
    createdAt: new Date().toISOString(),
  }
  await saveStudent(student)
  return student
}
