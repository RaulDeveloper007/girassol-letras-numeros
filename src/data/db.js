const DB_NAME = 'girassol-db'
const DB_VERSION = 1

let dbPromise = null

export function openDb() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students', { keyPath: 'id' })
      }

      if (!db.objectStoreNames.contains('subjectProgress')) {
        const store = db.createObjectStore('subjectProgress', { keyPath: ['studentId', 'subject'] })
        store.createIndex('byStudent', 'studentId')
      }

      if (!db.objectStoreNames.contains('sheets')) {
        const store = db.createObjectStore('sheets', { keyPath: 'id' })
        store.createIndex('byStudentSubject', ['studentId', 'subject'])
      }

      if (!db.objectStoreNames.contains('attempts')) {
        const store = db.createObjectStore('attempts', { keyPath: 'id' })
        store.createIndex('byStudentSubject', ['studentId', 'subject'])
      }

      if (!db.objectStoreNames.contains('progressionRules')) {
        db.createObjectStore('progressionRules', { keyPath: 'subject' })
      }

      if (!db.objectStoreNames.contains('guardianSettings')) {
        db.createObjectStore('guardianSettings', { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return dbPromise
}

function withStore(storeName, mode, executor) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const store = tx.objectStore(storeName)
        const request = executor(store)
        let settled = false

        request.onsuccess = () => {
          settled = true
          resolve(request.result)
        }
        request.onerror = () => {
          settled = true
          reject(request.error)
        }
        tx.onerror = () => {
          if (!settled) reject(tx.error)
        }
      })
  )
}

export function dbGet(storeName, key) {
  return withStore(storeName, 'readonly', (store) => store.get(key))
}

export function dbGetAll(storeName) {
  return withStore(storeName, 'readonly', (store) => store.getAll())
}

export function dbGetAllByIndex(storeName, indexName, value) {
  return withStore(storeName, 'readonly', (store) => store.index(indexName).getAll(value))
}

export function dbPut(storeName, value) {
  return withStore(storeName, 'readwrite', (store) => store.put(value))
}

export function dbDelete(storeName, key) {
  return withStore(storeName, 'readwrite', (store) => store.delete(key))
}

export function dbClear(storeName) {
  return withStore(storeName, 'readwrite', (store) => store.clear())
}

export const STORE_NAMES = [
  'students',
  'subjectProgress',
  'sheets',
  'attempts',
  'progressionRules',
  'guardianSettings',
]
