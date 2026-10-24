// Sistema de níveis próprio do Girassol das Letras e Números — não usa a
// nomenclatura de nível de nenhuma marca de terceiros.
export const STAGES = ['Semente', 'Broto', 'Folha', 'Botão', 'Flor', 'Girassol']
export const SUBLEVELS_PER_STAGE = 5
export const MAX_LEVEL = STAGES.length * SUBLEVELS_PER_STAGE

export function getStageInfo(level) {
  const clamped = Math.min(Math.max(level, 1), MAX_LEVEL)
  const stageIndex = Math.min(Math.floor((clamped - 1) / SUBLEVELS_PER_STAGE), STAGES.length - 1)
  const subLevel = clamped - stageIndex * SUBLEVELS_PER_STAGE

  return {
    level: clamped,
    stageIndex,
    stageName: STAGES[stageIndex],
    subLevel,
    label: `${STAGES[stageIndex]} ${subLevel}`,
  }
}
