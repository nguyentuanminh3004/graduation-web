import confetti from 'canvas-confetti';
import './style.css';

/* ============ 1. LOADING BAR ============ */
const progress = document.getElementById('progress');
const loader = document.getElementById('loader');
let p = 0;
const loadingInterval = setInterval(() => {
  p += Math.random() * 15;
  if (p >= 100) {
    p = 100;
    clearInterval(loadingInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }, 400);
  }
  progress.style.width = p + '%';
}, 200);

/* ============ 2. OPEN GIFT ============ */
const giftScreen = document.getElementById('gift-screen');
const openBtn = document.getElementById('open-btn');
const bgm = document.getElementById('bgm');

// Bảng màu vibrant dùng chung
const VIBRANT_COLORS = ['#ff2d95', '#a855f7', '#00e5ff', '#ffd60a', '#ff6b6b', '#2dd4bf'];

openBtn.addEventListener('click', () => {
  // Phát nhạc
  bgm.volume = 0.4;
  bgm.play().catch(e => console.log('Autoplay bị chặn:', e));

  // Confetti nổ
  burstConfetti();

  // Ẩn màn hình quà
  giftScreen.style.transition = 'opacity .8s';
  giftScreen.style.opacity = '0';
  setTimeout(() => giftScreen.classList.add('hidden'), 800);
});

function burstConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: VIBRANT_COLORS
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: VIBRANT_COLORS
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* ============ 3. TIMELINE SCROLL ANIMATION ============ */
const timelineItems = document.querySelectorAll('.timeline-item');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });
timelineItems.forEach(el => io.observe(el));

/* ============ 4. TYPEWRITER LETTER ============ */
const letterText = `Gửi cậu — người bạn tuyệt vời nhất,

Chúc mừng cậu đã chính thức trở thành Tân Cử Nhân!
Bốn năm qua, cậu đã đi một chặng đường thật dài và thật đẹp.
Mình tin rằng những gì cậu học được không chỉ là kiến thức,
mà còn là bản lĩnh, là tình bạn, là những ký ức không thể nào quên.

Phía trước là một bầu trời mới rộng lớn hơn.
Hãy cứ bay cao, bay xa, và tỏa sáng theo cách riêng của cậu.

Chúc cậu thành công trên con đường mình chọn!`;

const typeEl = document.getElementById('typewriter');
let typeStarted = false;

const typeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !typeStarted) {
      typeStarted = true;
      let i = 0;
      const interval = setInterval(() => {
        typeEl.textContent = letterText.slice(0, i);
        i++;
        if (i > letterText.length) clearInterval(interval);
      }, 40);
    }
  });
}, { threshold: 0.3 });
typeObserver.observe(typeEl);

/* ============ 5. FIREWORKS ============ */
document.getElementById('fireworks-btn').addEventListener('click', () => {
  const duration = 5000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 8,
      startVelocity: 40,
      spread: 360,
      ticks: 80,
      origin: { x: Math.random(), y: Math.random() * 0.6 },
      colors: VIBRANT_COLORS
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
});

/* ============ 6. GALLERY CLICK ============ */
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    const win = window.open('');
    win.document.write(`<img src="${img.src}" style="width:100%;height:100vh;object-fit:contain;background:#000;">`);
  });
});

/* ============ 7. PARTICLES BACKGROUND (VIBRANT) ============ */
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = window.innerWidth < 600 ? 25 : 45;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (8 + Math.random() * 12) + 's';
  particle.style.animationDelay = (Math.random() * 10) + 's';

  const size = 1 + Math.random() * 3;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';

  const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
  particle.style.background = color;
  particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

  particleContainer.appendChild(particle);
}

/* ============ 8. MUSIC TOGGLE ============ */
const musicBtn = document.getElementById('music-toggle');
musicBtn.addEventListener('click', () => {
  if (bgm.paused) {
    bgm.play().catch(e => console.log(e));
    musicBtn.textContent = '🔊';
  } else {
    bgm.pause();
    musicBtn.textContent = '🔇';
  }
});
/* ============ 9. LAZY LOAD 3D SCENE ============ */
// Chỉ load Three.js trên desktop + có WebGL + không bật reduced motion
const shouldLoad3D =
  window.innerWidth > 768 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (shouldLoad3D) {
  // Đợi page load xong + idle → mới tải Three.js
  // → không chặn load trang
  const load3D = () => {
    import('./three-scene.js')
      .then((module) => module.init3DCap())
      .catch((err) => console.log('3D scene bỏ qua:', err));
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(load3D, { timeout: 2000 });
  } else {
    setTimeout(load3D, 1000);
  }
}

/* ============ 10. CSS 3D TILT cho Timeline & Gallery ============ */
// Chỉ áp dụng trên desktop có chuột
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const tiltElements = document.querySelectorAll('.timeline-card, .gallery-item');

  tiltElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateY = x * 18;   // Ngang
      const rotateX = -y * 18;  // Dọc

      el.style.transform = `
        perspective(1000px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ============ 11. 3D FLIP cho lá thư ============ */
const letterCard = document.querySelector('.letter-card');
if (letterCard) {
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Lật thư sau khi cuộn vào 0.5s
        setTimeout(() => letterCard.classList.add('flipped'), 500);
        // Lật lại về ban đầu sau 3.5s
        setTimeout(() => letterCard.classList.remove('flipped'), 4000);
        letterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  letterObserver.observe(letterCard);
}