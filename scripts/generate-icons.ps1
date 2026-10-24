Add-Type -AssemblyName System.Drawing

function New-SunflowerIcon {
    param(
        [int]$Size,
        [string]$OutPath,
        [string]$BgColor = '#FDE68A',
        [string]$PetalColor = '#F9A825',
        [string]$CenterColor = '#6D4C33'
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $bg = [System.Drawing.ColorTranslator]::FromHtml($BgColor)
    $petal = [System.Drawing.ColorTranslator]::FromHtml($PetalColor)
    $center = [System.Drawing.ColorTranslator]::FromHtml($CenterColor)

    $g.Clear($bg)

    $cx = $Size / 2
    $cy = $Size / 2
    $petalRadius = $Size * 0.17
    $orbit = $Size * 0.26
    $petalBrush = New-Object System.Drawing.SolidBrush($petal)

    for ($i = 0; $i -lt 10; $i++) {
        $angle = (2 * [Math]::PI / 10) * $i
        $px = $cx + [Math]::Cos($angle) * $orbit
        $py = $cy + [Math]::Sin($angle) * $orbit
        $g.FillEllipse($petalBrush, $px - $petalRadius, $py - $petalRadius, $petalRadius * 2, $petalRadius * 2)
    }

    $centerRadius = $Size * 0.22
    $centerBrush = New-Object System.Drawing.SolidBrush($center)
    $g.FillEllipse($centerBrush, $cx - $centerRadius, $cy - $centerRadius, $centerRadius * 2, $centerRadius * 2)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
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
