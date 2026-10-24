Add-Type -AssemblyName System.Drawing

function New-SunflowerIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [string]$BgColorTop = '#FFF3C4',
        [string]$BgColorBottom = '#FDE68A',
        [string]$PetalColor = '#F9A825',
        [string]$PetalHighlight = '#FFD54F',
        [string]$CenterColor = '#6D4C33',
        [string]$CenterHighlight = '#8D6E52'
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Fundo em degrade (dá sensação de luz vindo de cima, mais profundidade
    # que uma cor chapada).
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.ColorTranslator]::FromHtml($BgColorTop),
        [System.Drawing.ColorTranslator]::FromHtml($BgColorBottom),
        90.0
    )
    $g.FillRectangle($bgBrush, $bgRect)

    $cx = $Size / 2
    $cy = $Size / 2
    $petalRadius = $Size * 0.17
    $orbit = $Size * 0.26

    # Sombra suave sob a flor: varias elipses semitransparentes deslocadas,
    # simulando um leve desfoque sem precisar de blur de verdade.
    for ($s = 8; $s -gt 0; $s--) {
        $alpha = [int](7 * $s)
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 40, 30, 10))
        $shadowRadius = ($orbit + $petalRadius) * (0.92 + $s * 0.01)
        $offset = $Size * (0.015 + $s * 0.003)
        $g.FillEllipse(
            $shadowBrush,
            $cx - $shadowRadius + $offset,
            $cy - $shadowRadius + $offset * 1.6,
            $shadowRadius * 2,
            $shadowRadius * 2
        )
        $shadowBrush.Dispose()
    }

    $petalBaseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($PetalColor))
    $petalHighlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($PetalHighlight))

    for ($i = 0; $i -lt 10; $i++) {
        $angle = (2 * [Math]::PI / 10) * $i
        $px = $cx + [Math]::Cos($angle) * $orbit
        $py = $cy + [Math]::Sin($angle) * $orbit

        # Base da pétala.
        $g.FillEllipse($petalBaseBrush, $px - $petalRadius, $py - $petalRadius, $petalRadius * 2, $petalRadius * 2)

        # Brilho deslocado pra cima-esquerda -- efeito "glossy" de volume.
        $hl = $petalRadius * 0.55
        $hx = $px - $petalRadius * 0.3
        $hy = $py - $petalRadius * 0.3
        $g.FillEllipse($petalHighlightBrush, $hx - $hl, $hy - $hl, $hl * 2, $hl * 2)
    }

    # Centro com a mesma logica de base + brilho.
    $centerRadius = $Size * 0.22
    $centerBaseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($CenterColor))
    $g.FillEllipse($centerBaseBrush, $cx - $centerRadius, $cy - $centerRadius, $centerRadius * 2, $centerRadius * 2)

    $centerHighlightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($CenterHighlight))
    $chl = $centerRadius * 0.5
    $chx = $cx - $centerRadius * 0.3
    $chy = $cy - $centerRadius * 0.3
    $g.FillEllipse($centerHighlightBrush, $chx - $chl, $chy - $chl, $chl * 2, $chl * 2)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $bgBrush.Dispose()
    $petalBaseBrush.Dispose()
    $petalHighlightBrush.Dispose()
    $centerBaseBrush.Dispose()
    $centerHighlightBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

$iconsDir = Join-Path $PSScriptRoot '..\public\icons'
New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null

New-SunflowerIcon -Size 192 -OutPath (Join-Path $iconsDir 'icon-192.png')
New-SunflowerIcon -Size 512 -OutPath (Join-Path $iconsDir 'icon-512.png')
New-SunflowerIcon -Size 192 -OutPath (Join-Path $iconsDir 'icon-maskable-192.png')
New-SunflowerIcon -Size 512 -OutPath (Join-Path $iconsDir 'icon-maskable-512.png')
New-SunflowerIcon -Size 180 -OutPath (Join-Path $iconsDir 'apple-touch-icon.png')
New-SunflowerIcon -Size 32 -OutPath (Join-Path $iconsDir 'favicon-32.png')

Write-Output "Icones gerados em $iconsDir"
