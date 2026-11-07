Add-Type -AssemblyName System.Drawing

$root = 'D:\alulu\apk\android\app\src\main\res'
$source = 'D:\alulu\apk\www\icons\lunara-1024.png'
$art = [System.Drawing.Image]::FromFile($source)

function New-Canvas([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    return @($bmp, $g)
}

function Draw-Art($g, [int]$size, [double]$fill) {
    $side = [int][Math]::Round($size * $fill)
    $offset = [int][Math]::Round(($size - $side) / 2)
    $rect = New-Object System.Drawing.Rectangle($offset, $offset, $side, $side)
    $g.DrawImage($art, $rect)
}

# ---------- 1. 传统方形图标 + 圆形图标 ----------
$densities = @{ 'mipmap-mdpi' = 48; 'mipmap-hdpi' = 72; 'mipmap-xhdpi' = 96; 'mipmap-xxhdpi' = 144; 'mipmap-xxxhdpi' = 192 }
foreach ($key in $densities.Keys) {
    $size = $densities[$key]
    $dir = Join-Path $root $key

    # 方形（部分启动器未适配自适应图标时使用）
    $c = New-Canvas $size
    Draw-Art $c[1] $size 1.0
    $c[1].Dispose()
    $c[0].Save((Join-Path $dir 'ic_launcher.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $c[0].Dispose()

    # 圆形
    $c = New-Canvas $size
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddEllipse(0, 0, $size, $size)
    $c[1].SetClip($clip)
    Draw-Art $c[1] $size 1.0
    $c[1].Dispose()
    $c[0].Save((Join-Path $dir 'ic_launcher_round.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $c[0].Dispose()
    $clip.Dispose()
    Write-Output ("legacy  " + $key + " " + $size + "px")
}

# ---------- 2. 自适应图标前景（108dp 画布） ----------
$adaptive = @{ 'mipmap-mdpi' = 108; 'mipmap-hdpi' = 162; 'mipmap-xhdpi' = 216; 'mipmap-xxhdpi' = 324; 'mipmap-xxxhdpi' = 432 }
foreach ($key in $adaptive.Keys) {
    $size = $adaptive[$key]
    $c = New-Canvas $size
    Draw-Art $c[1] $size 0.88
    $c[1].Dispose()
    $c[0].Save((Join-Path $root (Join-Path $key 'ic_launcher_foreground.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    $c[0].Dispose()
    Write-Output ("adaptive " + $key + " " + $size + "px")
}

# ---------- 3. 启动图（按原尺寸等比裁切铺满） ----------
Get-ChildItem $root -Recurse -Filter 'splash.png' | ForEach-Object {
    $old = [System.Drawing.Image]::FromFile($_.FullName)
    $w = $old.Width; $h = $old.Height
    $old.Dispose()
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $scale = [Math]::Max($w / 1024.0, $h / 1024.0)
    $dw = [int][Math]::Round(1024 * $scale)
    $dh = [int][Math]::Round(1024 * $scale)
    $g.DrawImage($art, (New-Object System.Drawing.Rectangle([int](($w - $dw) / 2), [int](($h - $dh) / 2), $dw, $dh)))
    $g.Dispose()
    $bmp.Save($_.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output ("splash  " + $_.Directory.Name + ' ' + $w + 'x' + $h)
}

$art.Dispose()
Write-Output 'ICONS DONE'
