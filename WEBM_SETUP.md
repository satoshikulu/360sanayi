# WebM Formatı Ekleme Rehberi

## ⚡ Hızlı Çözüm

### Seçenek 1: PowerShell Script (Önerilen - FFmpeg Gerekli)

```powershell
# Script'i çalıştır
.\convert-to-webm.ps1
```

**FFmpeg Kurulumu:**
```powershell
# Chocolatey ile (Önerilen)
choco install ffmpeg

# veya Scoop ile
scoop install ffmpeg
```

---

### Seçenek 2: Online Dönüştürücüler (FFmpeg Gerekmez)

#### 1. CloudConvert (En İyi Kalite)
1. https://cloudconvert.com/mp4-to-webm adresine git
2. `videoshowcase.mp4` dosyasını yükle
3. Ayarlar:
   - Video Codec: VP9
   - Quality: Good (CRF ~30)
   - Resolution: Original (veya 1280x720)
4. Convert'e tıkla
5. İndir ve `360sanayi/assets/` klasörüne kaydet

#### 2. FreeConvert
1. https://www.freeconvert.com/mp4-to-webm adresine git
2. Dosya yükle
3. Settings → Advanced Settings:
   - Video Codec: VP9
   - CRF: 30
   - Audio Codec: Opus
   - Audio Bitrate: 128kbps
4. Convert Now
5. İndir

#### 3. Video Converter (Hızlı)
1. https://video-converter.com/mp4-to-webm adresine git
2. MP4 dosyasını seç
3. Output: WebM
4. Convert
5. İndir

---

### Seçenek 3: HandBrake (GUI Uygulaması)

1. HandBrake indir: https://handbrake.fr/
2. `videoshowcase.mp4` dosyasını aç
3. **Summary** tab:
   - Format: WebM
4. **Video** tab:
   - Video Codec: VP9
   - Framerate: Same as source
   - Constant Quality: RF 30
5. **Audio** tab:
   - Codec: Opus
   - Bitrate: 128
6. Start Encode
7. Çıktı dosyasını `videoshowcase.webm` olarak kaydet

---

## 📊 Beklenen Sonuçlar

### Dosya Boyutu Karşılaştırması:
```
MP4 (H.264):  12 MB
WebM (VP9):    4-6 MB  (%50-60 tasarruf)
```

### Yükleme Süresi (3G'de):
```
MP4:  ~8-10 saniye
WebM: ~3-4 saniye
```

### Tarayıcı Desteği:
✓ Chrome/Edge (Chromium) - Native destek
✓ Firefox - Native destek
✓ Opera - Native destek
✗ Safari (eski versiyonlar) - MP4 fallback gerekli
✓ Safari 14+ - WebM desteği var

---

## 🔧 HTML Yapılandırması (Zaten Yapıldı)

```html
<video autoplay muted loop playsinline preload="auto">
  <!-- WebM öncelikli (modern tarayıcılar) -->
  <source src="assets/videoshowcase.webm" type="video/webm">
  <!-- MP4 fallback (tüm tarayıcılar) -->
  <source src="assets/videoshowcase.mp4" type="video/mp4">
</video>
```

**Nasıl Çalışır:**
1. Tarayıcı ilk source'u kontrol eder
2. WebM destekliyorsa onu yükler
3. Desteklemiyorsa MP4'e geçer

---

## ✅ Dönüştürme Sonrası Test

### 1. Dosya Kontrolü:
```bash
# Dosyanın oluştuğunu doğrula
dir 360sanayi\assets\videoshowcase.webm
```

### 2. Git Commit:
```bash
git add 360sanayi/assets/videoshowcase.webm
git commit -m "Add WebM video format for better performance"
git push
```

### 3. Tarayıcı Testi:
1. Sayfayı aç
2. F12 → Network sekmesi
3. `videoshowcase.webm` yüklendiğini gör
4. Yükleme süresini kontrol et

### 4. DevTools Validation:
```
F12 → Network → Filter: webm
✓ Status: 200 OK
✓ Size: ~4-6MB (MP4'ten küçük)
✓ Time: MP4'ten hızlı
```

---

## 🎯 Optimize Ayarlar

### FFmpeg Komut Satırı (Referans):
```bash
ffmpeg -i videoshowcase.mp4 \
  -vcodec libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -quality good \
  -cpu-used 4 \
  -acodec libopus \
  -b:a 128k \
  -strict experimental \
  videoshowcase.webm
```

### Parametre Açıklamaları:
- `-crf 30`: Kalite/boyut dengesi (28-32 arası ideal)
- `-b:v 0`: Variable bitrate (daha iyi sıkıştırma)
- `-quality good`: Hız/kalite dengesi
- `-cpu-used 4`: Encoding hızı (0-4 arası, 4 hızlı)
- `-acodec libopus`: Opus audio codec (daha iyi kalite)

---

## 🚀 Performans Metrikleri

### Lighthouse Testi:
1. F12 → Lighthouse
2. "Performance" testi çalıştır
3. Skorları karşılaştır:

**Öncesi (MP4 only):**
- Performance: 75-80
- First Contentful Paint: 2.5s

**Sonrası (WebM + MP4):**
- Performance: 85-90 ⬆️
- First Contentful Paint: 1.5s ⬇️

---

## 💡 İpuçları

### 1. Poster Kullanımı:
```html
<video poster="assets/video-poster.jpg" ...>
```
Video yüklenene kadar güzel bir kapak gösterir.

### 2. Lazy Loading (İleri Seviye):
Eğer video hala yavaşsa:
```javascript
// Intersection Observer ile lazy load
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    video.load();
    observer.disconnect();
  }
});
observer.observe(videoContainer);
```

### 3. CDN Kullanımı:
Video'yu CDN'e yükle (Cloudinary, Cloudflare Stream, vs.)
- Daha hızlı dağıtım
- Otomatik optimizasyon
- Adaptive bitrate streaming

---

## ❓ Sorun Giderme

### WebM Yüklenmiyor:
✓ MIME type kontrol et (server configuration)
✓ Dosya yolunu doğrila (`assets/videoshowcase.webm`)
✓ Tarayıcı konsolunda hata var mı kontrol et

### Çok Büyük Dosya:
✓ CRF değerini artır (35-40)
✓ Resolution düşür (1280x720)
✓ Frame rate düşür (24fps)

### Ses Yok:
✓ Audio codec doğru mu kontrol et (Opus)
✓ `-strict experimental` flag ekle
✓ Audio bitrate çok düşük değil mi kontrol et (min 96kbps)

---

## 📈 Sonraki Adımlar

1. ✓ WebM dosyası oluştur (yukarıdaki yöntemlerden biriyle)
2. ✓ `360sanayi/assets/` klasörüne kaydet
3. ✓ Tarayıcıda test et
4. ✓ Git'e commit et
5. ✓ Canlıya al

**Hazırsanız script'i çalıştırabilir veya online araç kullanabilirsiniz!** 🚀
