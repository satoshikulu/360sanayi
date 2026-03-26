# Video Optimizasyon Rehberi

## Mevcut Durum
- **Dosya:** `assets/videoshowcase.mp4`
- **Boyut:** ~12MB
- **Yükleme Süresi:** Yavaş (özellikle mobil ağlarda)

## Önerilen Sıkıştırma Ayarları

### FFmpeg ile Optimize Etme:

```bash
# H.264 codec - İyi uyumluluk, orta boyut
ffmpeg -i videoshowcase.mp4 -vcodec libx264 -crf 28 -preset medium -acodec aac -b:a 128k -movflags +faststart videoshowcase_optimized.mp4

# H.265/HEVC - Daha iyi sıkıştırma (modern tarayıcılar)
ffmpeg -i videoshowcase.mp4 -vcodec libx265 -crf 28 -preset medium -acodec aac -b:a 128k -movflags +faststart videoshowcase_hevc.mp4

# VP9 - WebM formatı (Chrome/Firefox için ideal)
ffmpeg -i videoshowcase.mp4 -vcodec libvpx-vp9 -crf 30 -b:v 0 -quality good -cpu-used 4 -acodec libopus -b:a 128k videoshowcase.webm
```

### HandBrake Ayarları (GUI):
- **Format:** MP4
- **Video Codec:** H.264
- **Quality:** RF 26-28 (düşük kalite, hızlı yükleme)
- **Preset:** Fast
- **Resolution:** 1280x720 veya 1920x1080 (orijinalinden düşür)
- **Audio:** AAC 128kbps
- **Web Optimized:** ✓ İşaretle

### Online Araçlar:
- [CloudConvert](https://cloudconvert.com/mp4-to-webm)
- [VideoCompressor.app](https://videocompressor.app/)
- [YouCompress](https://www.youcompress.com/)

## Hedef Boyutlar:
- **MP4 (H.264):** 3-5MB (720p), 5-8MB (1080p)
- **WebM (VP9):** 2-4MB (720p), 4-6MB (1080p)

## Uygulama Adımları:

1. **Video'yu sıkıştır** (yukarıdaki araçlardan biriyle)
2. **Dosyaları değiştir:**
   ```
   assets/videoshowcase.mp4 → optimize edilmiş versiyon
   assets/videoshowcase.webm → yedek WebM versiyonu (opsiyonel)
   ```

3. **Git'e commit et:**
   ```bash
   git add assets/videoshowcase.mp4
   git commit -m "Optimize hero video - reduced file size"
   git push
   ```

## Performans İpuçları:

### HTML'de Yapılan Optimizasyonlar:
✓ `preload="auto"` eklendi
✓ `poster` attribute kullanıldı
✓ WebM fallback eklendi
✓ Preload link tag'i eklendi

### JavaScript'te Yapılan Optimizasyonlar:
✓ Timeout süresi 5s → 3s düşürüldü
✓ %30 yüklemede gösterme özelliği
✓ Progress event listener
✓ Error handling iyileştirildi

### CSS'te Yapılan Optimizasyonlar:
✓ `will-change: opacity` performansı
✓ Video yüklenene kadar koyu arka plan

## Test Etme:

### Chrome DevTools:
1. F12 → Network tab
2. "Slow 3G" seç
3. Sayfayı yenile
4. Video yükleme süresini kontrol et

### Lighthouse:
1. F12 → Lighthouse tab
2. "Performance" testi çalıştır
3. Video optimizasyonu skorunu kontrol et

## Alternatif Çözüm:

Eğer video çok büyükse, **lazy loading** düşünülebilir:
- İlk açılışta statik poster göster
- Kullanıcı scroll yapınca video yükle
- Intersection Observer API kullan

## Sonuç:

Video 12MB → 4MB'e düşürülürse:
- ✅ 3x daha hızlı yükleme
- ✅ Mobil veri tasarrufu
- ✅ Daha iyi Lighthouse skoru
- ✅ Daha az bounce rate
