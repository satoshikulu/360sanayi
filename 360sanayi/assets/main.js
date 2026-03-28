// ===== 360 SANAYİ - Main JS =====

// ===== SPLASH SCREEN - HYBRID APPROACH =====
// SVG logo hemen görünür, video arka planda yüklenir
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const splashVideo = document.getElementById('splash-video');
  const splashSvgLogo = document.querySelector('.splash-svg-logo');
  
  if (!splash) return;

  let isSplashHidden = false;

  function hideSplash() { 
    if (isSplashHidden) return;
    isSplashHidden = true;
    splash.classList.add('hidden');
  }

  // Video yükleme durumu kontrolü
  if (splashVideo) {
    // Video hazır olduğunda (metadata yüklendi)
    splashVideo.addEventListener('loadedmetadata', () => {
      splashVideo.classList.add('ready');
      
      // SVG logoyu yavaşça gizle, videoyu göster
      if (splashSvgLogo) {
        splashSvgLogo.style.opacity = '0';
        splashSvgLogo.style.transition = 'opacity 0.4s ease';
      }
      
      // Kısa bir gecikme ile splash'i tamamen kapat
      // (video başladıktan sonra 0.8-1.2 saniye ideal)
      setTimeout(hideSplash, 1000);
    });
    
    // Video oynanmaya başladığında
    splashVideo.addEventListener('play', () => {
      console.log('Splash video playing...');
    });
    
    // Video bittiğinde
    splashVideo.addEventListener('ended', hideSplash);
    
    // Video hatası durumunda - SVG ile devam et
    splashVideo.addEventListener('error', (e) => {
      console.warn('Splash video load error, using SVG only:', e);
      if (splashSvgLogo) {
        splashSvgLogo.style.opacity = '1';
      }
      // Video yoksa sadece SVG göster, 1.5 saniye sonra kapat
      setTimeout(hideSplash, 1500);
    });
    
    // Güvenlik timeout'u - maksimum 2.5 saniye göster
    setTimeout(() => {
      hideSplash();
    }, 2500);
    
  } else {
    // Video elementi yoksa sadece SVG göster
    setTimeout(hideSplash, 1500);
  }
});

// Sticky header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu - only active on mobile
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  // Check if we're on mobile (screen width <= 900px)
  function isMobile() {
    return window.innerWidth <= 900;
  }
  
  hamburger.addEventListener('click', () => {
    // Only allow toggle on mobile devices
    if (!isMobile()) return;
    
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });
  
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });
  
  // Close menu on resize if switching to desktop
  window.addEventListener('resize', () => {
    if (!isMobile() && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    }
  });
}

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ===== PARTICLES =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '249,115,22' : '59,130,246'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== VIDEO TABS =====
const videoTabs = document.querySelectorAll('.video-tab');
const mainPlayer = document.getElementById('main-video-player');
const videoTitleEl = document.getElementById('video-title');

videoTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    videoTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (mainPlayer) mainPlayer.src = tab.dataset.video;
    if (videoTitleEl) videoTitleEl.textContent = tab.dataset.title;
  });
});

// ===== CİNEMATİK SHOWCASE =====
(function initCinematicShowcase() {
  const TOTAL    = 7;
  const DURATION = 5500;

  const scenes  = document.querySelectorAll('.cs-scene');
  const bgs     = document.querySelectorAll('.cs-bg');
  const dots    = document.querySelectorAll('.cs-dot');
  const progress = document.getElementById('cs-progress');
  const counter  = document.getElementById('cs-current');
  const btnPrev  = document.getElementById('cs-prev');
  const btnNext  = document.getElementById('cs-next');
  const btnPP    = document.getElementById('cs-playpause');

  if (!scenes.length) return;

  let current   = -1;   // -1 = henüz hiçbir sahne aktif değil
  let playing   = true;
  let elapsed   = 0;
  let lastTick  = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function activate(idx) {
    // Eskiyi kapat (current == -1 ise atla)
    if (current >= 0) {
      if (scenes[current]) scenes[current].classList.remove('active');
      if (bgs[current])    bgs[current].classList.remove('active');
      if (dots[current])   dots[current].classList.remove('active');
    }
    current = ((idx % TOTAL) + TOTAL) % TOTAL;
    elapsed = 0;
    if (scenes[current]) scenes[current].classList.add('active');
    if (bgs[current])    bgs[current].classList.add('active');
    if (dots[current])   dots[current].classList.add('active');
    if (counter)  counter.textContent = pad(current + 1);
    if (progress) progress.style.width = '0%';
  }

  function tick(ts) {
    if (!playing) return;
    if (!lastTick) lastTick = ts;
    elapsed += ts - lastTick;
    lastTick = ts;
    const pct = Math.min((elapsed / DURATION) * 100, 100);
    if (progress) progress.style.width = pct + '%';
    if (elapsed >= DURATION) { lastTick = null; activate(current + 1); }
    requestAnimationFrame(tick);
  }

  function play() {
    playing  = true;
    lastTick = null;
    if (btnPP) btnPP.innerHTML = '<i class="fas fa-pause"></i>';
    requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    if (btnPP) btnPP.innerHTML = '<i class="fas fa-play"></i>';
  }

  // Başlat
  activate(0);
  play();

  btnNext && btnNext.addEventListener('click', () => { activate(current + 1); lastTick = null; });
  btnPrev && btnPrev.addEventListener('click', () => { activate(current - 1); lastTick = null; });
  btnPP   && btnPP.addEventListener('click',   () => playing ? pause() : play());

  dots.forEach(dot => dot.addEventListener('click', () => {
    activate(parseInt(dot.dataset.index));
    lastTick = null;
  }));

  document.addEventListener('keydown', e => {
    const el = document.querySelector('.cinematic-showcase');
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top >= window.innerHeight || r.bottom <= 0) return;
    if (e.key === 'ArrowRight') { activate(current + 1); lastTick = null; }
    if (e.key === 'ArrowLeft')  { activate(current - 1); lastTick = null; }
    if (e.key === ' ')          { e.preventDefault(); playing ? pause() : play(); }
  });

  const showcase = document.querySelector('.cinematic-showcase');
  if (showcase) {
    let tx = 0;
    showcase.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    showcase.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { activate(dx < 0 ? current + 1 : current - 1); lastTick = null; }
    });
  }
})();

// ===== VIDEO MODAL =====
function openVideoModal(src) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-video-iframe');
  if (!modal || !iframe) return;
  iframe.src = src + '?autoplay=1';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-video-iframe');
  if (!modal || !iframe) return;
  iframe.src = '';
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoModal();
});

// ===== HERO VIDEO LOADING & OPTIMIZATION =====
(function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-video-local');
  if (!heroVideo) return;
  
  const loadingEl = heroVideo.parentElement.querySelector('.video-loading');
  const errorEl = heroVideo.parentElement.querySelector('.video-error');
  let loadTimeout;
  let isLoaded = false;
  
  // Videoyu başlat - splashscreen kapanınca çalışır
  function startVideoLoading() {
    // Hızlı başlatma için timeout - splashscreen kapandıktan 1s sonra
    loadTimeout = setTimeout(() => {
      if (!isLoaded) {
        console.log('Force showing video after splash ended');
        showVideo();
      }
    }, 1000);
  }
  
  // Video gösterme fonksiyonu
  function showVideo() {
    if (isLoaded) return;
    isLoaded = true;
    
    if (loadingEl) {
      loadingEl.classList.add('hidden');
      console.log('Hero video loaded successfully');
    }
    
    // Video elementine loaded class ekle (CSS opacity transition için)
    heroVideo.classList.add('loaded');
    
    // Video'nun 0:00'dan başladığını garanti et
    heroVideo.currentTime = 0;
    
    console.log('Video shown from position:', heroVideo.currentTime);
  }
  
  // Video yüklendiğinde loading'i gizle
  heroVideo.addEventListener('loadeddata', () => {
    clearTimeout(loadTimeout);
    showVideo();
  });
  
  // Video metadata yüklendiğinde (daha hızlı ilk gösterim)
  heroVideo.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded, duration:', heroVideo.duration);
    // İlk frame'i göster
    if (heroVideo.readyState >= 1) {
      showVideo();
    }
  });
  
  // Video canplaythrough - yeterli veri yüklendi
  heroVideo.addEventListener('canplaythrough', () => {
    console.log('Video can play through');
    showVideo();
  });
  
  // Video hatası durumunda
  heroVideo.addEventListener('error', (e) => {
    clearTimeout(loadTimeout);
    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) errorEl.style.display = 'block';
    console.error('Hero video loading error:', e);
  });
  
  // Splashscreen'in kapanmasını bekle
  function waitForSplashThenStartVideo() {
    const splash = document.getElementById('splash');
    
    if (splash && !splash.classList.contains('hidden')) {
      // Splashscreen hala görünüyorsa, kapanışını bekle
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            if (splash.classList.contains('hidden')) {
              observer.disconnect();
              // Splash kapandıktan sonra video yükleme başlat
              setTimeout(startVideoLoading, 300);
            }
          }
        });
      });
      
      observer.observe(splash, { attributes: true });
    } else {
      // Splashscreen zaten kapalıysa hemen başlat
      startVideoLoading();
    }
  }
  
  // Sayfa yüklendiğinde splashscreen'i bekle
  waitForSplashThenStartVideo();
})();

// ===== CONTACT PAGE - ROBOT ARM ANIMATION =====
(function initContactPageAnimations() {
  const robotArmDecoration = document.querySelector('.robot-arm-decoration');
  if (!robotArmDecoration) return;
  
  // Intersection Observer ile görünür olunca animasyonu başlat
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        robotArmDecoration.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(robotArmDecoration);
})();



