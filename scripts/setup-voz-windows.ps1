<#
.SYNOPSIS
    Etapa 1.2 — Preparação do ambiente de voz no Windows 11: síntese e
    reconhecimento de fala offline em Português (Brasil) e Inglês (EUA).

.DESCRIPTION
    Este script pausa e pede confirmação [S/n] antes de cada instalação.
    PRECISA ser executado em um PowerShell como Administrador.

.NOTES
    Como abrir como administrador: menu Iniciar > digite "PowerShell" >
    clique direito > "Executar como administrador".
#>

$ErrorActionPreference = 'Stop'

function Confirmar($mensagem) {
    $resp = Read-Host "$mensagem [S/n]"
    return ($resp -eq '' -or $resp -match '^[sS]')
}

function Linha { Write-Host ('-' * 70) -ForegroundColor DarkGray }

Write-Host "`n=== Etapa 1.2 — Configuração de voz no Windows 11 ===`n" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# 0) Confirmar que está em modo administrador
# ---------------------------------------------------------------------------
$isAdmin = ([Security.Principal.WindowsIdentity]::GetCurrent().Groups -contains 'S-1-5-32-544')
if (-not $isAdmin) {
    Write-Host "Este script precisa ser executado como Administrador." -ForegroundColor Red
    Write-Host "Feche esta janela e reabra o PowerShell com 'Executar como administrador'." -ForegroundColor Red
    exit 1
}
Write-Host "Executando como Administrador: OK" -ForegroundColor Green

# ---------------------------------------------------------------------------
# 1) Listar capacidades de voz disponíveis/instaladas
# ---------------------------------------------------------------------------
Linha
Write-Host "1) Comando: Get-WindowsCapability -Online | Where-Object Name -like '*Speech*'"
if (Confirmar "Executar?") {
    $capacidades = Get-WindowsCapability -Online | Where-Object { $_.Name -like '*Speech*' }
    $capacidades | Select-Object Name, State | Format-Table -AutoSize
}

# ---------------------------------------------------------------------------
# 2) Instalar síntese de voz (TextToSpeech) em pt-BR e en-US
# ---------------------------------------------------------------------------
Linha
Write-Host "2) Síntese de voz (TextToSpeech) — pt-BR e en-US"

$nomePtTTS = ($capacidades | Where-Object { $_.Name -like 'Language.TextToSpeech*pt-BR*' }).Name
$nomeEnTTS = ($capacidades | Where-Object { $_.Name -like 'Language.TextToSpeech*en-US*' }).Name

if (-not $nomePtTTS) { $nomePtTTS = 'Language.TextToSpeech~~~pt-BR~0.0.1.0' }
if (-not $nomeEnTTS) { $nomeEnTTS = 'Language.TextToSpeech~~~en-US~0.0.1.0' }

Write-Host "Comando: Add-WindowsCapability -Online -Name `"$nomePtTTS`""
if (Confirmar "Instalar voz de síntese em Português (Brasil)?") {
    Add-WindowsCapability -Online -Name $nomePtTTS
}

Write-Host "Comando: Add-WindowsCapability -Online -Name `"$nomeEnTTS`""
if (Confirmar "Instalar voz de síntese em Inglês (EUA)?") {
    Add-WindowsCapability -Online -Name $nomeEnTTS
}

# ---------------------------------------------------------------------------
# 3) Instalar reconhecimento de fala (Speech) em pt-BR e en-US
# ---------------------------------------------------------------------------
Linha
Write-Host "3) Reconhecimento de fala (Speech) — pt-BR e en-US"

$nomePtSpeech = ($capacidades | Where-Object { $_.Name -like 'Language.Speech~~~pt-BR*' }).Name
$nomeEnSpeech = ($capacidades | Where-Object { $_.Name -like 'Language.Speech~~~en-US*' }).Name

if (-not $nomePtSpeech) { $nomePtSpeech = 'Language.Speech~~~pt-BR~0.0.1.0' }
if (-not $nomeEnSpeech) { $nomeEnSpeech = 'Language.Speech~~~en-US~0.0.1.0' }

Write-Host "Comando: Add-WindowsCapability -Online -Name `"$nomePtSpeech`""
if (Confirmar "Instalar reconhecimento de fala em Português (Brasil)?") {
    Add-WindowsCapability -Online -Name $nomePtSpeech
}

Write-Host "Comando: Add-WindowsCapability -Online -Name `"$nomeEnSpeech`""
if (Confirmar "Instalar reconhecimento de fala em Inglês (EUA)?") {
    Add-WindowsCapability -Online -Name $nomeEnSpeech
}

# ---------------------------------------------------------------------------
# 4) Confirmar os idiomas em Configurações > Hora e idioma > Fala
# ---------------------------------------------------------------------------
Linha
Write-Host "4) Abrindo Configurações > Fala, para você confirmar visualmente..."
if (Confirmar "Abrir agora (ms-settings:speech)?") {
    Start-Process "ms-settings:speech"
    Write-Host "Confira que 'Português (Brasil)' e 'Inglês (Estados Unidos)'" -ForegroundColor Yellow
    Write-Host "aparecem instalados na seção de idiomas de reconhecimento de fala." -ForegroundColor Yellow
    Read-Host "`nPressione Enter aqui quando confirmar"
}

# ---------------------------------------------------------------------------
# 5) Permissão de microfone para apps e navegador
# ---------------------------------------------------------------------------
Linha
Write-Host "5) Abrindo Configurações > Privacidade > Microfone..."
if (Confirmar "Abrir agora (ms-settings:privacy-microphone)?") {
    Start-Process "ms-settings:privacy-microphone"
    Write-Host "Confirme que 'Acesso ao microfone' está ATIVADO, e que o Edge" -ForegroundColor Yellow
    Write-Host "e/ou o Chrome aparecem com permissão concedida na lista abaixo." -ForegroundColor Yellow
    Read-Host "`nPressione Enter aqui quando confirmar"
}

Linha
Write-Host "`nEtapa 1.2 concluída. Reinicie o navegador e acesse a tela" -ForegroundColor Cyan
Write-Host "'Verificar voz' (#/verificar-voz) do app para testar síntese e" -ForegroundColor Cyan
Write-Host "reconhecimento nos dois idiomas." -ForegroundColor Cyan
