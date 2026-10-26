// Saudação conforme o horário local do aparelho:
// 05h00–11h59 bom dia · 12h00–17h59 boa tarde · 18h00–04h59 boa noite.
export function saudacaoPorHorario(data = new Date()) {
  const hora = data.getHours()
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}
