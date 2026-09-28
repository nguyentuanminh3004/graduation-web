import './style.css';

/* SUPABASE */
const SUPABASE_URL = 'https://jconxtoruslgcvfskluy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nq7ZbIGNTp1lRoraTFkelQ_egL5Sm8N';
const API_URL = `${SUPABASE_URL}/rest/v1/guestbook`;
const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

console.log('Web đã chạy!');

/* LẤY PHẦN TỬ */
const btnPlayVoice = document.getElementById('btn-play-voice');
const btnSkip = document.getElementById('btn-skip');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const btnRestart = document.getElementById('btn-restart');
const btnSave = document.getElementById('btn-save');
const btnGuestbook = document.getElementById('btn-guestbook');
const btnBackOutro = document.getElementById('btn-back-outro');

const voiceAudio = document.getElementById('voice-audio');
const introTip = document.getElementById('intro-tip');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

const screenIntro = document.getElementById('screen-intro');
const screenStory = document.getElementById('screen-story');
const screenOutro = document.getElementById('screen-outro');
const screenGuestbook = document.getElementById('screen-guestbook');

const cap3d = document.getElementById('cap-3d');
const book = document.getElementById('book');
const pages = document.querySelectorAll('.book-page');
const pageIndicator = document.getElementById('page-indicator');
const letterTypewriter = document.getElementById('letter-typewriter');
const btnCloseBook = document.getElementById('btn-close-book');

const cardExport = document.getElementById('card-export');
const cardDate = document.getElementById('card-date');

const gbName = document.getElementById('gb-name');
const gbMessage = document.getElementById('gb-message');
const gbSend = document.getElementById('gb-send');
const gbStatus = document.getElementById('gb-status');
const guestbookList = document.getElementById('guestbook-list');

const today = new Date();
const days = ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
cardDate.textContent = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

/* PARTICLES */
const particlesEl = document.getElementById('particles');
const PARTICLE_COUNT = window.innerWidth < 600 ? 20 : 40;
const COLORS = ['#ff6b9d', '#a855f7', '#00e5ff', '#ffd60a', '#ff2d95'];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (8 + Math.random() * 12) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  const size = 1 + Math.random() * 3;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  p.style.background = color;
  p.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
  particlesEl.appendChild(p);
}

/* PETALS */
const petalsEl = document.getElementById('petals');
const PETAL_COUNT = window.innerWidth < 600 ? 12 : 25;

for (let i = 0; i < PETAL_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (10 + Math.random() * 8) + 's';
  p.style.animationDelay = (Math.random() * 15) + 's';
  const size = 8 + Math.random() * 8;
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  petalsEl.appendChild(p);
}

/* NGHIÊNG THEO CHUỘT */
if (window.matchMedia('(hover: hover)').matches) {
  let capRotateY = 0;
  let capRotateX = -15;

  document.addEventListener('mousemove', (e) => {
    if (cap3d && screenIntro.classList.contains('show')) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      capRotateY = x * 25;
      capRotateX = -15 + y * 15;
    }
    if (book && screenStory.classList.contains('show')) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      book.style.transform = `rotateX(${12 - y * 6}deg) rotateY(${-30 + x * 12}deg)`;
    }
  });

  setInterval(() => {
    if (cap3d && screenIntro.classList.contains('show')) {
      cap3d.style.transform = `rotateX(${capRotateX}deg) rotateY(${capRotateY}deg)`;
    }
  }, 50);
}

/* CHUYỂN MÀN HÌNH */
function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
  screen.classList.add('show');
}

/* CUỐN SÁCH */
const TOTAL_PAGES = pages.length;
let currentPage = 0;
let isFlipping = false;
let letterTyped = false;
let typewriterInterval = null;

const letterText = `Cảm ơn em vì đã đến bên anh.

Bốn năm qua, em đã cố gắng rất nhiều.
Anh thấy hết, và anh tự hào về em.

Hôm nay em khoác áo cử nhân,
xinh nhất trong mắt anh.

Chặng đường phía trước còn dài,
anh mong được đi cùng em.

Mãi yêu em.`;

function updateBookUI() {
  if (currentPage === 0) {
    pageIndicator.textContent = 'Bìa';
  } else if (currentPage === TOTAL_PAGES - 1) {
    pageIndicator.textContent = 'Trang cuối';
  } else {
    pageIndicator.textContent = `${currentPage}/${TOTAL_PAGES - 2}`;
  }

  btnBack.disabled = currentPage === 0;
  btnNext.textContent = currentPage === TOTAL_PAGES - 1 ? 'Đóng sách 📖' : 'Trang sau →';
}

function flipNext() {
  if (isFlipping) return;

  if (currentPage === TOTAL_PAGES - 1) {
    closeBook();
    return;
  }

  if (currentPage >= TOTAL_PAGES) return;

  isFlipping = true;
  pages[currentPage].classList.add('flipped');
  currentPage++;

  if (currentPage === 6 && !letterTyped) {
    setTimeout(startTypewriter, 500);
  }

  setTimeout(() => {
    isFlipping = false;
    updateBookUI();
  }, 1000);
}

function flipPrev() {
  if (isFlipping) return;
  if (currentPage <= 0) return;

  isFlipping = true;
  currentPage--;
  pages[currentPage].classList.remove('flipped');

  setTimeout(() => {
    isFlipping = false;
    updateBookUI();
  }, 1000);
}

pages.forEach((page, i) => {
  page.addEventListener('click', () => {
    if (isFlipping) return;
    if (i === currentPage) flipNext();
    else if (i === currentPage - 1) flipPrev();
  });
});

function startTypewriter() {
  if (letterTyped) return;
  letterTyped = true;
  letterTypewriter.textContent = '';
  let i = 0;
  clearInterval(typewriterInterval);
  typewriterInterval = setInterval(() => {
    letterTypewriter.textContent = letterText.slice(0, i);
    i++;
    if (i > letterText.length) clearInterval(typewriterInterval);
  }, 45);
}

btnNext.addEventListener('click', flipNext);
btnBack.addEventListener('click', flipPrev);

/* ĐÓNG SÁCH */
let isClosingBook = false;

function closeBook() {
  if (isClosingBook) return;
  isClosingBook = true;
  isFlipping = true;

  book.classList.add('closing');

  const totalP = TOTAL_PAGES;
  for (let i = totalP - 1; i >= 0; i--) {
    const delay = (totalP - i) * 120;
    setTimeout(() => {
      pages[i].classList.remove('flipped');
    }, delay);
  }

  setTimeout(() => {
    book.classList.remove('closing');
    isClosingBook = false;
    isFlipping = false;
    currentPage = 0;
    updateBookUI();

    showScreen(screenOutro);
    startFireworks();
  }, totalP * 120 + 900);
}

if (btnCloseBook) {
  btnCloseBook.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBook();
  });
}

/* VOICE */
let voiceAvailable = true;

fetch('/assets/voice/voice.mp3', { method: 'HEAD' })
  .then(res => { if (!res.ok) throw new Error(); console.log('✅ Có voice'); })
  .catch(() => {
    voiceAvailable = false;
    btnPlayVoice.style.opacity = '0.4';
    btnPlayVoice.style.pointerEvents = 'none';
    introTip.textContent = 'Chưa có voice — bấm "Mở sách" để xem tiếp nhé!';
    btnSkip.classList.add('highlight');
  });

btnPlayVoice.addEventListener('click', () => {
  startMusicIfNeeded();
  if (!voiceAvailable) return;

  if (!voiceAudio.paused && voiceAudio.currentTime > 0) {
    voiceAudio.pause();
    btnPlayVoice.textContent = '▶';
    btnPlayVoice.classList.remove('playing');
    introTip.textContent = 'Bấm play để nghe tiếp 💌';
    return;
  }

  voiceAudio.play()
    .then(() => {
      btnPlayVoice.textContent = '⏸';
      btnPlayVoice.classList.add('playing');
      introTip.textContent = 'Đang phát... 🎧';
    })
    .catch(() => {
      introTip.textContent = 'Không phát được — bấm "Mở sách" nhé!';
      btnSkip.classList.add('highlight');
    });
});

voiceAudio.addEventListener('play', () => { if (!bgMusic.paused) bgMusic.volume = 0.08; });
voiceAudio.addEventListener('pause', () => { bgMusic.volume = 0.3; });
voiceAudio.addEventListener('ended', () => {
  bgMusic.volume = 0.3;
  btnPlayVoice.textContent = '▶';
  btnPlayVoice.classList.remove('playing');
  introTip.textContent = 'Xong rồi, mở sách nhé 💕';
  setTimeout(() => openBook(), 1200);
});

btnSkip.addEventListener('click', () => {
  startMusicIfNeeded();
  if (!voiceAudio.paused) voiceAudio.pause();
  openBook();
});

function openBook() {
  showScreen(screenStory);
  pages.forEach(page => page.classList.remove('flipped'));
  book.classList.remove('closing');
  currentPage = 0;
  letterTyped = false;
  clearInterval(typewriterInterval);
  letterTypewriter.textContent = '';
  updateBookUI();
}

btnRestart.addEventListener('click', () => {
  showScreen(screenIntro);
  stopFireworks();
  voiceAudio.currentTime = 0;
  btnPlayVoice.textContent = '▶';
  btnPlayVoice.classList.remove('playing');
  introTip.textContent = 'Bấm play để nghe lời nhắn 💌';

  pages.forEach(page => page.classList.remove('flipped'));
  book.classList.remove('closing');
  currentPage = 0;
  letterTyped = false;
  clearInterval(typewriterInterval);
  letterTypewriter.textContent = '';
  updateBookUI();
});

/* LƯU THIỆP */
btnSave.addEventListener('click', async () => {
  const originalText = btnSave.textContent;
  btnSave.textContent = '⏳ Đang tạo thiệp...';
  btnSave.disabled = true;

  try {
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    if (document.fonts && document.fonts.ready) await document.fonts.ready;

    const canvas = await window.html2canvas(cardExport, {
      backgroundColor: null, scale: 2, useCORS: true, logging: false,
      windowWidth: 800, windowHeight: 1000
    });

    const link = document.createElement('a');
    link.download = `chuc-mung-tot-nghiep-${today.getDate()}-${today.getMonth() + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    btnSave.textContent = '✅ Đã lưu!';
    setTimeout(() => { btnSave.textContent = originalText; btnSave.disabled = false; }, 2000);
  } catch (err) {
    btnSave.textContent = '❌ Lỗi, thử lại';
    setTimeout(() => { btnSave.textContent = originalText; btnSave.disabled = false; }, 2000);
  }
});

/* NHẠC NỀN */
bgMusic.volume = 0.3;
let musicAvailable = true;
let musicStarted = false;

fetch('/assets/music/song.mp3', { method: 'HEAD' })
  .then(res => { if (!res.ok) throw new Error(); })
  .catch(() => {
    musicAvailable = false;
    musicToggle.style.display = 'none';
  });

function startMusicIfNeeded() {
  if (musicStarted || !musicAvailable) return;
  musicStarted = true;
  bgMusic.play().then(() => {
    musicToggle.textContent = '🔊';
    musicToggle.classList.add('playing');
  }).catch(() => { });
}

musicToggle.addEventListener('click', () => {
  if (!musicAvailable) return;
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicToggle.textContent = '🔊';
      musicToggle.classList.add('playing');
      musicStarted = true;
    }).catch(() => { });
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔇';
    musicToggle.classList.remove('playing');
  }
});

/* PHÁO HOA */
let fireworksRunning = false;
let fireworksRAF = null;

function startFireworks() {
  if (fireworksRunning) return;
  fireworksRunning = true;

  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const isMobile = window.innerWidth < 600;
  const rockets = [];
  const particles = [];

  const PALETTES = [
    ['#ff6b9d', '#ff2d95', '#ffb6d5'],
    ['#a855f7', '#c084fc', '#e9d5ff'],
    ['#ffd60a', '#ffb800', '#fff3b0'],
    ['#00e5ff', '#22d3ee', '#a5f3fc'],
    ['#ff6b6b', '#ffa500', '#ffd700'],
    ['#ffffff', '#ffe4ec', '#ffd1dc']
  ];

  function launchRocket(targetX, targetY, palette) {
    const startX = targetX + (Math.random() - 0.5) * 60;
    const startY = canvas.offsetHeight + 20;
    return { startX, startY, targetX, targetY, palette, t: 0, duration: 55 + Math.random() * 20 };
  }

  function explode(x, y, palette) {
    const count = isMobile ? 45 : 75;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.5 + Math.random() * 4.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1, decay: 0.012 + Math.random() * 0.01,
        size: 1.5 + Math.random() * 2,
        gravity: 0.06, friction: 0.98, sparkle: false
      });
    }
    const sparkleCount = isMobile ? 12 : 25;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color: '#fff', alpha: 1,
        decay: 0.006 + Math.random() * 0.008,
        size: 1 + Math.random() * 1.5,
        gravity: 0.02, friction: 0.99, sparkle: true
      });
    }
  }

  let lastLaunch = 0;
  const LAUNCH_INTERVAL = isMobile ? 1900 : 1300;

  function animate(timestamp) {
    if (!fireworksRunning) return;
    fireworksRAF = requestAnimationFrame(animate);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    ctx.globalCompositeOperation = 'source-over';

    if (timestamp - lastLaunch > LAUNCH_INTERVAL) {
      const tx = canvas.offsetWidth * (0.15 + Math.random() * 0.7);
      const ty = canvas.offsetHeight * (0.1 + Math.random() * 0.45);
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      rockets.push(launchRocket(tx, ty, palette));
      lastLaunch = timestamp;
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.t++;
      const progress = r.t / r.duration;
      if (progress >= 1) {
        explode(r.targetX, r.targetY, r.palette);
        rockets.splice(i, 1);
        continue;
      }
      const x = r.startX + (r.targetX - r.startX) * progress;
      const y = r.startY + (r.targetY - r.startY) * progress;

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#ffd60a';
      ctx.shadowColor = '#ffd60a';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y + 6, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > canvas.offsetHeight + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.sparkle ? p.alpha * (0.4 + Math.random() * 0.6) : p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.sparkle ? 15 : 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  fireworksRAF = requestAnimationFrame(animate);

  setTimeout(() => {
    rockets.push(launchRocket(canvas.offsetWidth * 0.3, canvas.offsetHeight * 0.3, PALETTES[0]));
  }, 200);
  setTimeout(() => {
    rockets.push(launchRocket(canvas.offsetWidth * 0.7, canvas.offsetHeight * 0.25, PALETTES[1]));
  }, 700);
}

function stopFireworks() {
  fireworksRunning = false;
  if (fireworksRAF) cancelAnimationFrame(fireworksRAF);
  const canvas = document.getElementById('fireworks-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* GUESTBOOK */
const CACHE_KEY = 'guestbook_cache_sb';
let guestbookLoading = false;

btnGuestbook.addEventListener('click', () => {
  stopFireworks();
  showScreen(screenGuestbook);
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const items = JSON.parse(cached);
      if (items.length > 0) renderGuestbook(items);
    } catch (e) { }
  }
  loadGuestbook();
});

btnBackOutro.addEventListener('click', () => {
  showScreen(screenOutro);
  startFireworks();
});

gbSend.addEventListener('click', async () => {
  const name = gbName.value.trim();
  const message = gbMessage.value.trim();

  if (!name) { gbStatus.textContent = '⚠️ Bạn chưa nhập tên'; gbStatus.style.color = '#ff6b6b'; return; }
  if (!message) { gbStatus.textContent = '⚠️ Bạn chưa nhập lời chúc'; gbStatus.style.color = '#ff6b6b'; return; }

  gbSend.disabled = true;
  gbSend.textContent = '⏳ Đang gửi...';
  gbStatus.textContent = '';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ name, message })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    gbStatus.textContent = '✅ Đã gửi lời chúc!';
    gbStatus.style.color = '#2dd4bf';
    gbName.value = '';
    gbMessage.value = '';

    if (window.confetti) {
      window.confetti({
        particleCount: 50, spread: 70, origin: { y: 0.7 },
        colors: ['#ff6b9d', '#a855f7', '#00e5ff', '#ffd60a']
      });
    }
    setTimeout(() => loadGuestbook(true), 800);
  } catch (err) {
    console.error('❌ Lỗi gửi:', err);
    gbStatus.textContent = '❌ Lỗi gửi, thử lại sau';
    gbStatus.style.color = '#ff6b6b';
  } finally {
    gbSend.textContent = 'Gửi lời chúc 💌';
    gbSend.disabled = false;
    setTimeout(() => { gbStatus.textContent = ''; }, 3000);
  }
});

async function loadGuestbook(forceReload = false) {
  if (guestbookLoading) return;
  guestbookLoading = true;

  if (!localStorage.getItem(CACHE_KEY)) {
    guestbookList.innerHTML = '<p class="gb-loading">Đang tải lời chúc...</p>';
  }

  const timeoutId = setTimeout(() => {
    guestbookLoading = false;
    if (!localStorage.getItem(CACHE_KEY)) {
      guestbookList.innerHTML = `<p class="gb-loading">⚠️ Mạng chậm</p>
        <button id="gb-retry-btn" class="gb-refresh-btn">🔄 Thử lại</button>`;
      document.getElementById('gb-retry-btn')?.addEventListener('click', () => loadGuestbook(true));
    }
  }, 15000);

  try {
    const res = await fetch(`${API_URL}?select=*&order=created_at.desc&limit=100`, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    clearTimeout(timeoutId);
    guestbookLoading = false;

    const normalized = items.map(m => ({
      name: m.name || 'Ẩn danh',
      message: m.message || '',
      createdAt: m.created_at || new Date().toISOString()
    }));

    try { localStorage.setItem(CACHE_KEY, JSON.stringify(normalized)); } catch (e) { }
    renderGuestbook(normalized);
  } catch (err) {
    clearTimeout(timeoutId);
    guestbookLoading = false;
    console.error('❌ Lỗi load:', err);

    if (!localStorage.getItem(CACHE_KEY)) {
      guestbookList.innerHTML = `<p class="gb-loading">❌ Không tải được</p>
        <button id="gb-retry-btn" class="gb-refresh-btn">🔄 Thử lại</button>`;
      document.getElementById('gb-retry-btn')?.addEventListener('click', () => loadGuestbook(true));
    }
  }
}

function renderGuestbook(items) {
  guestbookList.innerHTML = '';
  if (!items || items.length === 0) {
    guestbookList.innerHTML = '<p class="gb-loading">Chưa có lời chúc nào. Hãy là người đầu tiên! 💕</p>';
    return;
  }
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gb-card';
    const timeStr = formatTime(item.createdAt);
    card.innerHTML = `
      <div class="gb-card-name">💕 ${escapeHtml(item.name)}<span class="gb-card-time">${timeStr}</span></div>
      <div class="gb-card-message">${escapeHtml(item.message)}</div>
    `;
    guestbookList.appendChild(card);
  });
}

function formatTime(isoString) {
  try {
    const d = new Date(isoString);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 0 || diff < 60) return 'vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch (e) { return 'vừa xong'; }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const refreshBtn = document.getElementById('gb-refresh-fixed');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    refreshBtn.textContent = '⏳ Đang tải...';
    refreshBtn.disabled = true;
    loadGuestbook(true).finally(() => {
      refreshBtn.textContent = '🔄 Tải lại lời chúc';
      refreshBtn.disabled = false;
    });
  });
}

console.log('✅ Web ready! (Sách 3D với shell + page thickness)');