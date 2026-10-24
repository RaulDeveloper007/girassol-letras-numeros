// Hash simples e determinístico, sem depender de SubtleCrypto (que só
// funciona em contexto seguro -- https ou localhost -- e falharia no teste
// pelo celular via IP na rede local). Isso é só uma trava simples para a
// criança não entrar no painel, não uma defesa contra ataque.
export function hashPin(pin) {
  const text = `girassol-pin:${pin}`
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0
  }
  return String(hash)
}
