# Video to WebM Converter Script
# Bu script, MP4 videoları WebM formatına dönüştürür

$ErrorActionPreference = "Stop"

# Dizin değiştir
Set-Location "$PSScriptRoot\360sanayi\assets"

Write-Host "=== Video to WebM Converter ===" -ForegroundColor Cyan
Write-Host ""

# Dosya kontrolü
$mp4File = "videoshowcase.mp4"
$webmFile = "videoshowcase.webm"

if (-not (Test-Path $mp4File)) {
    Write-Host "HATA: $mp4File bulunamadı!" -ForegroundColor Red
    exit 1
}

# FFmpeg kontrolü
try {
    $ffmpegVersion = ffmpeg -version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg not found"
    }
    Write-Host "FFmpeg bulundu: $($ffmpegVersion[0])" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "FFmpeg yüklü değil! Kurulum seçenekleri:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Chocolatey ile kurulum (Önerilen):" -ForegroundColor Cyan
    Write-Host "   choco install ffmpeg" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Scoop ile kurulum:" -ForegroundColor Cyan
    Write-Host "   scoop install ffmpeg" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Manuel kurulum:" -ForegroundColor Cyan
    Write-Host "   https://ffmpeg.org/download.html adresinden indirin" -ForegroundColor White
    Write-Host "   ve PATH'e ekleyin" -ForegroundColor White
    Write-Host ""
    Write-Host "Veya online dönüştürücü kullanın:" -ForegroundColor Yellow
    Write-Host "   - https://cloudconvert.com/mp4-to-webm" -ForegroundColor White
    Write-Host "   - https://www.freeconvert.com/mp4-to-webm" -ForegroundColor White
    Write-Host "   - https://video-converter.com/mp4-to-webm" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Video bilgileri
Write-Host ""
Write-Host "Video bilgisi alınıyor..." -ForegroundColor Cyan
$ffprobeOutput = ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$mp4File" 2>&1
$duration = [math]::Round([double]$ffprobeOutput, 2)
Write-Host "Süre: ${duration}s" -ForegroundColor Gray

# Dönüştürme parametreleri
Write-Host ""
Write-Host "WebM dönüştürme başlatılıyor..." -ForegroundColor Cyan
Write-Host "Codec: VP9" -ForegroundColor Gray
Write-Host "Quality: CRF 30 (İyi kalite/boyut dengesi)" -ForegroundColor Gray
Write-Host "Audio: Opus 128kbps" -ForegroundColor Gray
Write-Host ""

# FFmpeg komutu - WebM dönüştürme
ffmpeg -i "$mp4File" `
    -vcodec libvpx-vp9 `
    -crf 30 `
    -b:v 0 `
    -quality good `
    -cpu-used 4 `
    -acodec libopus `
    -b:a 128k `
    -strict experimental `
    "$webmFile" -y

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Başarılı! WebM dosyası oluşturuldu." -ForegroundColor Green
    
    # Dosya boyutlarını karşılaştır
    $mp4Size = (Get-Item $mp4File).Length / 1MB
    $webmSize = (Get-Item $webmFile).Length / 1MB
    $savings = [math]::Round((1 - $webmSize / $mp4Size) * 100, 1)
    
    Write-Host ""
    Write-Host "Dosya Boyutları:" -ForegroundColor Cyan
    Write-Host "  MP4:  $([math]::Round($mp4Size, 2)) MB" -ForegroundColor Gray
    Write-Host "  WebM: $([math]::Round($webmSize, 2)) MB" -ForegroundColor Gray
    
    if ($savings -gt 0) {
        Write-Host "  Tasarruf: ${savings}% ⬇️" -ForegroundColor Green
    } else {
        Write-Host "  Boyut artışı: $([math]::Abs($savings))% ⬆️" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Test etmek için:" -ForegroundColor Cyan
    Write-Host "  1. Tarayıcıda sayfayı aç" -ForegroundColor Gray
    Write-Host "  2. F12 > Network > videoshowcase.webm yükleme süresini kontrol et" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "HATA: Dönüştürme başarısız!" -ForegroundColor Red
    exit 1
}
