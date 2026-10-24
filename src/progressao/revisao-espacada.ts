// Revisão espaçada simples (tipo Leitner): o intervalo até a próxima
// revisão cresce a cada acerto e volta ao início em qualquer erro.
const INTERVALOS_DIAS = [1, 3, 7, 14, 30, 60] as const

export function proximoIntervaloDias(intervaloAtualDias: number, acertou: boolean): number {
  if (!acertou) return INTERVALOS_DIAS[0]

  const indiceAtual = INTERVALOS_DIAS.indexOf(intervaloAtualDias as (typeof INTERVALOS_DIAS)[number])
  if (indiceAtual === -1) return INTERVALOS_DIAS[0]

  const proximoIndice = Math.min(indiceAtual + 1, INTERVALOS_DIAS.length - 1)
  // Seguro: proximoIndice está sempre entre 0 e length-1 por causa do Math.min acima.
  return INTERVALOS_DIAS[proximoIndice]!
}

export function calcularProximaRevisao(dataBase: Date, intervaloDias: number): Date {
  const proxima = new Date(dataBase)
  proxima.setDate(proxima.getDate() + intervaloDias)
  return proxima
}
