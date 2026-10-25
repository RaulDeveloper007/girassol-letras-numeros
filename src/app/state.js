const state = {
  activeStudentId: null,
  activeSubject: null,
  currentSheetId: null,
  lastSheetSummary: null,
  // true só durante o diagnóstico obrigatório de um perfil recém-criado
  // (ver screens/profile-select/create-profile.js) -- fora disso, o
  // diagnóstico é opcional e por disciplina escolhida à mão.
  diagnosticoObrigatorio: false,
}

export function getState() {
  return state
}

export function setState(patch) {
  Object.assign(state, patch)
}
