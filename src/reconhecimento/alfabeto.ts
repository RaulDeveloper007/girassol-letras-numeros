// Alfabeto de caracteres reconhecíveis a partir do desenho na caixa de
// escrita: dígitos + os símbolos que aparecem em respostas de Matemática
// (vírgula decimal, barra de fração, sinal de menos). Letras manuscritas
// ficam de fora por ora -- caligrafia real varia muito mais entre si do
// que dígitos impressos, e um classificador treinado só com fontes do
// sistema arriscaria não generalizar bem (ver discussão no PR).
export const ALFABETO = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '/', '-'] as const

export type Caractere = (typeof ALFABETO)[number]

export function indiceDoCaractere(caractere: string): number {
  return ALFABETO.indexOf(caractere as Caractere)
}

export function caractereDoIndice(indice: number): string {
  const caractere = ALFABETO[indice]
  if (caractere === undefined) throw new Error(`Índice fora do alfabeto: ${indice}`)
  return caractere
}
