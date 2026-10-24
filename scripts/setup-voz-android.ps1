<#
.SYNOPSIS
    Etapa 1.1 — Preparação do ambiente de voz no Xiaomi Redmi 9 (Android/MIUI),
    executado a partir do Windows 11 via ADB.

.DESCRIPTION
    Este script NÃO instala nada sozinho sem você confirmar. Ele pausa antes
    de cada ação importante e pede [S] para continuar ou [N] para pular.

    Pré-requisitos no celular (fazer ANTES de rodar este script):
      1. Configurações > Sobre o telefone > tocar 7x em "Versão da MIUI"
         até aparecer "Você agora é um desenvolvedor!"
      2. Configurações > Configurações adicionais > Opções do desenvolvedor
         > ativar "Depuração USB"
      3. Na mesma tela, ativar também "Depuração USB (Configurações de
         segurança)" — a MIUI bloqueia alguns comandos `adb shell settings`
         sem isso.
      4. Conectar o celular ao PC por cabo USB e escolher "Transferência de
         arquivos" na notificação USB do Android.

.NOTES
    Rode a partir de um PowerShell comum (não precisa ser administrador).
#>

$ErrorActionPreference = 'Stop'

function Confirmar($mensagem) {
    $resp = Read-Host "$mensagem [S/n]"
    return ($resp -eq '' -or $resp -match '^[sS]')
}

function Linha { Write-Host ('-' * 70) -ForegroundColor DarkGray }

Write-Host "`n=== Etapa 1.1 — Configuração de voz no Redmi 9 (via ADB) ===`n" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# 1) Verificar/instalar o ADB (Android Platform Tools)
# ---------------------------------------------------------------------------
Linha
Write-Host "1) Verificando se o ADB está instalado..."
$adbOk = $false
try {
    $null = & adb version 2>$null
    if ($LASTEXITCODE -eq 0) { $adbOk = $true }
} catch { $adbOk = $false }

if (-not $adbOk) {
    Write-Host "ADB não encontrado no PATH." -ForegroundColor Yellow
    Write-Host "Comando sugerido para instalar via winget:"
    Write-Host "  winget install --id Google.PlatformTools" -ForegroundColor Green
    if (Confirmar "Executar esse comando agora?") {
        winget install --id Google.PlatformTools
        Write-Host "Instalação concluída. Feche e reabra este terminal (PowerShell) para que o PATH seja atualizado, depois rode este script de novo." -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "Instale manualmente em https://developer.android.com/tools/releases/platform-tools e rode este script novamente." -ForegroundColor Yellow
        exit 1
    }
}
Write-Host "ADB encontrado." -ForegroundColor Green

# ---------------------------------------------------------------------------
# 2) Detectar o aparelho
# ---------------------------------------------------------------------------
Linha
Write-Host "2) Comando: adb devices"
if (Confirmar "Executar?") {
    adb devices
    Write-Host ""
    Write-Host "Veja a lista acima. Se aparecer 'unauthorized', olhe a tela do" -ForegroundColor Yellow
    Write-Host "celular e toque em 'Permitir' na caixa de depuração USB." -ForegroundColor Yellow
    if (-not (Confirmar "`nO Redmi 9 aparece como 'device' (não 'unauthorized' nem vazio)?")) {
        Write-Host "Resolva a conexão/autorização e rode o script novamente." -ForegroundColor Red
        exit 1
    }
}

# ---------------------------------------------------------------------------
# 3) Verificar o "Serviços de fala do Google" (TTS)
# ---------------------------------------------------------------------------
Linha
Write-Host "3) Comando: adb shell pm list packages com.google.android.tts"
if (Confirmar "Executar?") {
    $pkg = adb shell pm list packages com.google.android.tts
    if ($pkg -match 'com.google.android.tts') {
        Write-Host "Pacote encontrado: $pkg" -ForegroundColor Green
    } else {
        Write-Host "Não encontrado. Vou abrir a página da Play Store no celular." -ForegroundColor Yellow
        if (Confirmar "Abrir a Play Store no celular agora?") {
            adb shell am start -a android.intent.action.VIEW -d "market://details?id=com.google.android.tts"
            Write-Host "No celular: toque em Instalar/Atualizar e aguarde terminar." -ForegroundColor Yellow
            Read-Host "Pressione Enter aqui quando a instalação terminar"
        }
    }
}

# ---------------------------------------------------------------------------
# 4) Definir "Serviços de fala do Google" como mecanismo padrão
# ---------------------------------------------------------------------------
Linha
Write-Host "4) Comando: adb shell settings put secure tts_default_synth com.google.android.tts"
if (Confirmar "Executar?") {
    adb shell settings put secure tts_default_synth com.google.android.tts
    Write-Host "Verificando..."
    $valor = adb shell settings get secure tts_default_synth
    Write-Host "tts_default_synth = $valor"
    if ($valor -match 'com\.google\.android\.tts') {
        Write-Host "Mecanismo padrão definido corretamente." -ForegroundColor Green
    } else {
        Write-Host "Não foi possível confirmar via ADB (a MIUI bloqueia isso em" -ForegroundColor Yellow
        Write-Host "alguns firmwares mesmo com Depuração USB (segurança) ativa)." -ForegroundColor Yellow
        Write-Host "Confirme manualmente no passo 5 abaixo, na tela de TTS." -ForegroundColor Yellow
    }
}

# ---------------------------------------------------------------------------
# 5) Abrir as configurações de Conversão de texto em voz (baixar vozes)
# ---------------------------------------------------------------------------
Linha
Write-Host "5) Abrindo a tela de Conversão de texto em voz no celular..."
if (Confirmar "Abrir agora?") {
    adb shell am start -a com.android.settings.TTS_SETTINGS
    Write-Host ""
    Write-Host "NO CELULAR, agora faça manualmente (a MIUI não permite automatizar" -ForegroundColor Yellow
    Write-Host "isso por ADB):" -ForegroundColor Yellow
    Write-Host "  a) Em 'Mecanismo de conversão de texto em voz preferido',"
    Write-Host "     confirme/selecione 'Serviços de fala do Google'."
    Write-Host "  b) Toque no ícone de engrenagem ao lado do mecanismo."
    Write-Host "  c) Toque em 'Instalar dados de voz' (ou 'Idiomas')."
    Write-Host "  d) Baixe a voz 'Português (Brasil)'."
    Write-Host "  e) Volte e baixe também a voz 'Inglês (Estados Unidos)'."
    Write-Host "  f) Confirme que ambas aparecem com um ícone de 'instalado' (sem"
    Write-Host "     precisar de rede depois de baixadas)."
    Read-Host "`nPressione Enter aqui quando terminar os dois downloads"
}

# ---------------------------------------------------------------------------
# 6) Reconhecimento de fala offline (pt-BR e en-US)
# ---------------------------------------------------------------------------
Linha
Write-Host "6) Reconhecimento de fala offline (não tem intent padrão — é manual)."
if (Confirmar "Abrir as configurações do app Google agora?") {
    adb shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d "package:com.google.android.googlequicksearchbox"
    Write-Host ""
    Write-Host "NO CELULAR, o caminho costuma ser:" -ForegroundColor Yellow
    Write-Host "  App Google > ícone de perfil > Configurações > Voz >"
    Write-Host "  'Reconhecimento de fala offline' > baixe 'Português (Brasil)'"
    Write-Host "  e 'Inglês (EUA)'."
    Write-Host "(Se o caminho acima não existir no seu app Google, procure por"
    Write-Host "'offline' dentro de Configurações > Voz do app Google.)"
    Read-Host "`nPressione Enter aqui quando terminar os dois downloads"
}

# ---------------------------------------------------------------------------
# 7) Permissão de microfone para o Chrome
# ---------------------------------------------------------------------------
Linha
Write-Host "7) Comando: adb shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d package:com.android.chrome"
if (Confirmar "Abrir as permissões do Chrome no celular?") {
    adb shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d "package:com.android.chrome"
    Write-Host "NO CELULAR: toque em Permissões > Microfone > 'Permitir'." -ForegroundColor Yellow
    Read-Host "`nPressione Enter aqui quando confirmar a permissão"
}

Linha
Write-Host "`nEtapa 1.1 concluída. Próximo passo: abra o app no Chrome do Redmi 9" -ForegroundColor Cyan
Write-Host "e acesse a tela 'Verificar voz' (#/verificar-voz) para testar." -ForegroundColor Cyan
