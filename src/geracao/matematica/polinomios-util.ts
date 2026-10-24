// Utilitários compartilhados pelos geradores de cálculo (Fase 17). Os itens
// pedem um valor numérico (derivada/integral avaliada num ponto), não uma
// expressão livre -- o teclado atual só digita números, e isso também evita
// o aluno "escapar" reescrevendo a expressão original sem resolver nada.

export interface TermoPolinomio {
  coeficiente: number
  expoente: number
}

export function avaliarPolinomio(termos: readonly TermoPolinomio[], x: number): number {
  return termos.reduce((soma, termo) => soma + termo.coeficiente * x ** termo.expoente, 0)
}

export function derivarPolinomio(termos: readonly TermoPolinomio[]): TermoPolinomio[] {
  return termos
    .map((termo) => ({ coeficiente: termo.coeficiente * termo.expoente, expoente: termo.expoente - 1 }))
    .filter((termo) => termo.coeficiente !== 0 && termo.expoente >= 0)
}

export function textoPolinomio(termos: readonly TermoPolinomio[]): string {
  if (termos.length === 0) return '0'
  return termos
    .map((termo, i) => {
      const parteX = termo.expoente === 0 ? '' : termo.expoente === 1 ? 'x' : `x^${termo.expoente}`
      const coefAbs = Math.abs(termo.coeficiente)
      const corpo = termo.expoente === 0 ? `${coefAbs}` : coefAbs === 1 ? parteX : `${coefAbs}${parteX}`
      const sinal = termo.coeficiente < 0 ? '-' : i === 0 ? '' : '+'
      return `${sinal} ${corpo}`.trim()
    })
    .join(' ')
}
