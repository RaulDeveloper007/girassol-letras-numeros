const state = {
  activeStudentId: null,
  activeSubject: null,
  activeLevel: null,
  currentSheetId: null,
}

export function getState() {
  return state
}

export function setState(patch) {
  Object.assign(state, patch)
}
