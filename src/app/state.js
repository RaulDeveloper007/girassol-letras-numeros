const state = {
  activeStudentId: null,
  activeSubject: null,
  currentSheetId: null,
}

export function getState() {
  return state
}

export function setState(patch) {
  Object.assign(state, patch)
}
