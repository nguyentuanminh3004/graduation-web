import './style.css';
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyBFp5-x96sBEU3AePSgCx4L9zcm6Do3yvA",
  authDomain: "graduation-web-e3e7f.firebaseapp.com",
  projectId: "graduation-web-e3e7f",
  storageBucket: "graduation-web-e3e7f.firebasestorage.app",
  messagingSenderId: "778276971394",
  appId: "1:778276971394:web:ab38c82c3ec74a9aece59b"
};

const app = initializeApp(firebaseConfig);

/* ⭐ Force long-polling để không bị chặn ở mobile VN */
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

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

const storyImg = document.getElementById('story-img');
const storyNum = document.getElementById('story-num');
const storyTitle = document.getElementById('story-title');
const storyText = document.getElementById('story-text');
const storyPhoto = document.getElementById('story-photo');
const storyLetter = document.getElementById('story-letter');
const storyCaption = document.getElementById('story-caption');
const letterTypewriter = document.getElementById('letter-typewriter');

const cardExport = document.getElementById('card-export');
const cardDate = document.getElementById('card-date');

const gbName = document.getElementById('gb-name');
const gbMessage = document.getElementById('gb-message');
const gbSend = document.getElementById('gb-send');
const gbStatus = document.getElementById('gb-status');
const guestbookList = document.getElementById('guestbook-list');

/* NGÀY HÔM NAY */
const today = new Date();
const days = ['CHỦ NHẬT', 'THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7'];
cardDate.textContent = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

/* HẠT BAY BACKGROUND */
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

/* DỮ LIỆU SLIDE */
const slides = [
  { type: 'photo', img: '/assets/images/1.jpg', title: 'Ngày đầu gặp em', text: 'Kỷ niệm đầu tiên của chúng ta...' },
  { type: 'photo', img: '/assets/images/2.jpg', title: 'Những ngày rong chơi', text: 'Cười nói cả ngày không chán...' },
  { type: 'photo', img: '/assets/images/3.jpg', title: 'Đêm thức trắng ôn thi', text: 'Có em bên cạnh, khó mấy cũng qua...' },
  { type: 'photo', img: '/assets/images/4.jpg', title: 'Em đã lớn rồi', text: 'Ngày em khoác áo cử nhân xinh lung linh...' },
  { type: 'photo', img: '/assets/images/5.jpg', title: 'Còn nhiều chặng đường', text: 'Anh mong được đi cùng em mãi mãi...' },
  { type: 'letter' }
];

let currentSlide = 0;
let typewriterInterval = null;
let letterTyped = false;

const letterText = `Cảm ơn em vì đã đến bên anh.

Bốn năm qua, em đã cố gắng rất nhiều.
Anh thấy hết, và anh tự hào về em.

Hôm nay em khoác áo cử nhân,
xinh nhất trong mắt anh.

Chặng đường phía trước còn dài,
anh mong được đi cùng em.

Mãi yêu em.`;

/* CHUYỂN MÀN HÌNH */
function showScreen(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
  screen.classList.add('show');
}

/* HIỂN THỊ SLIDE */
function showSlide(index) {
  if (index < 0) index = 0;
  if (index >= slides.length) {
    showScreen(screenOutro);
    startHeartRain();
    return;
  }

  currentSlide = index;
  const slide = slides[index];

  storyNum.textContent = `${index + 1}/${slides.length}`;
  btnBack.disabled = index === 0;
  btnNext.textContent = index === slides.length - 1 ? 'Hoàn thành 💕' : 'Tiếp theo →';

  if (slide.type === 'photo') {
    storyPhoto.classList.remove('hidden');
    storyLetter.classList.remove('show');
    storyCaption.classList.remove('hidden');
    storyPhoto.classList.add('fading');

    setTimeout(() => {
      storyImg.src = slide.img;
      storyTitle.textContent = slide.title;
      storyText.textContent = slide.text;
      storyPhoto.classList.remove('fading');
    }, 200);
  } else if (slide.type === 'letter') {
    storyPhoto.classList.add('hidden');
    storyLetter.classList.add('show');
    storyCaption.classList.add('hidden');

    if (!letterTyped) {
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
  }
}

/* KIỂM TRA VOICE */
let voiceAvailable = true;

fetch('/assets/voice/voice.mp3', { method: 'HEAD' })
  .then(res => { if (!res.ok) throw new Error(); console.log('✅ Có voice'); })
  .catch(() => {
    console.log('⚠️ Không có voice');
    voiceAvailable = false;
    btnPlayVoice.style.opacity = '0.4';
    btnPlayVoice.style.pointerEvents = 'none';
    introTip.textContent = 'Chưa có voice — bấm "Bỏ qua" để xem tiếp nhé!';
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
      introTip.textContent = 'Không phát được — bấm "Bỏ qua" nhé!';
      btnSkip.classList.add('highlight');
    });
});

voiceAudio.addEventListener('play', () => { if (!bgMusic.paused) bgMusic.volume = 0.08; });
voiceAudio.addEventListener('pause', () => { bgMusic.volume = 0.3; });
voiceAudio.addEventListener('ended', () => {
  bgMusic.volume = 0.3;
  btnPlayVoice.textContent = '▶';
  btnPlayVoice.classList.remove('playing');
  introTip.textContent = 'Xong rồi, xem tiếp nhé 💕';
  setTimeout(() => { showScreen(screenStory); showSlide(0); }, 1200);
});

btnSkip.addEventListener('click', () => {
  startMusicIfNeeded();
  if (!voiceAudio.paused) voiceAudio.pause();
  showScreen(screenStory);
  showSlide(0);
});

btnNext.addEventListener('click', () => showSlide(currentSlide + 1));
btnBack.addEventListener('click', () => showSlide(currentSlide - 1));

btnRestart.addEventListener('click', () => {
  showScreen(screenIntro);
  currentSlide = 0;
  voiceAudio.currentTime = 0;
  btnPlayVoice.textContent = '▶';
  btnPlayVoice.classList.remove('playing');
  introTip.textContent = 'Bấm play để nghe lời nhắn 💌';
  letterTyped = false;
  clearInterval(typewriterInterval);
  stopHeartRain();
});

/* NÚT LƯU THIỆP */
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
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
      windowHeight: 1000
    });

    const link = document.createElement('a');
    link.download = `chuc-mung-tot-nghiep-${today.getDate()}-${today.getMonth() + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    btnSave.textContent = '✅ Đã lưu!';
    setTimeout(() => { btnSave.textContent = originalText; btnSave.disabled = false; }, 2000);
  } catch (err) {
    console.log('Lỗi:', err);
    btnSave.textContent = '❌ Lỗi, thử lại';
    setTimeout(() => { btnSave.textContent = originalText; btnSave.disabled = false; }, 2000);
  }
});

/* NHẠC NỀN */
bgMusic.volume = 0.3;
let musicAvailable = true;
let musicStarted = false;

fetch('/assets/music/song.mp3', { method: 'HEAD' })
  .then(res => { if (!res.ok) throw new Error(); console.log('✅ Có nhạc nền'); })
  .catch(() => {
    console.log('⚠️ Không có nhạc nền');
    musicAvailable = false;
    musicToggle.style.display = 'none';
  });

function startMusicIfNeeded() {
  if (musicStarted || !musicAvailable) return;
  musicStarted = true;
  bgMusic.play()
    .then(() => {
      musicToggle.textContent = '🔊';
      musicToggle.classList.add('playing');
    })
    .catch(() => { });
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

/* MƯA TIM */
let heartRainRunning = false;
let heartRainRAF = null;

function startHeartRain() {
  if (heartRainRunning) return;
  heartRainRunning = true;

  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const hearts = [];
  const HEART_COLORS = ['#ff6b9d', '#ec4899', '#f472b6', '#a855f7', '#fbcfe8', '#fbbf24'];

  function drawHeart(x, y, size, color, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 100, size / 100);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-50, -20, -100, 30, 0, 100);
    ctx.bezierCurveTo(100, 30, 50, -20, 0, 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function createHeart() {
    return {
      x: Math.random() * canvas.offsetWidth,
      y: -50,
      size: 15 + Math.random() * 30,
      speed: 0.8 + Math.random() * 1.8,
      rotation: (Math.random() - 0.5) * 0.8,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      opacity: 0.6 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03
    };
  }

  let lastSpawn = 0;
  const SPAWN_INTERVAL = 180;

  function animate(timestamp) {
    if (!heartRainRunning) return;
    heartRainRAF = requestAnimationFrame(animate);

    if (timestamp - lastSpawn > SPAWN_INTERVAL) {
      hearts.push(createHeart());
      lastSpawn = timestamp;
    }

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.speed;
      h.wobble += h.wobbleSpeed;
      h.x += Math.sin(h.wobble) * 0.6;
      h.rotation += h.rotationSpeed;

      if (h.y > canvas.offsetHeight + 60) {
        hearts.splice(i, 1);
        continue;
      }
      drawHeart(h.x, h.y, h.size, h.color, h.rotation, h.opacity);
    }
  }

  heartRainRAF = requestAnimationFrame(animate);

  setTimeout(() => {
    for (let i = 0; i < 20; i++) {
      const h = createHeart();
      h.y = canvas.offsetHeight + Math.random() * 100;
      h.speed = -(2 + Math.random() * 3);
      hearts.push(h);
    }
  }, 200);
}

function stopHeartRain() {
  heartRainRunning = false;
  if (heartRainRAF) cancelAnimationFrame(heartRainRAF);
  const canvas = document.getElementById('heart-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* GUESTBOOK */
const CACHE_KEY = 'guestbook_cache_v2';
let guestbookLoading = false;

btnGuestbook.addEventListener('click', () => {
  stopHeartRain();
  showScreen(screenGuestbook);

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const items = JSON.parse(cached);
      if (items.length > 0) renderGuestbook(items);
    } catch (e) {
      console.log('Cache lỗi:', e);
    }
  }

  loadGuestbook();
});

btnBackOutro.addEventListener('click', () => {
  showScreen(screenOutro);
  startHeartRain();
});

gbSend.addEventListener('click', () => {
  const name = gbName.value.trim();
  const message = gbMessage.value.trim();

  if (!name) {
    gbStatus.textContent = '⚠️ Bạn chưa nhập tên';
    gbStatus.style.color = '#ff6b6b';
    return;
  }
  if (!message) {
    gbStatus.textContent = '⚠️ Bạn chưa nhập lời chúc';
    gbStatus.style.color = '#ff6b6b';
    return;
  }

  gbStatus.textContent = '✅ Đã gửi lời chúc!';
  gbStatus.style.color = '#2dd4bf';

  const savedName = name;
  const savedMessage = message;
  const savedTime = new Date();

  gbName.value = '';
  gbMessage.value = '';

  if (window.confetti) {
    window.confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff6b9d', '#a855f7', '#00e5ff', '#ffd60a']
    });
  }

  const newItem = {
    name: savedName,
    message: savedMessage,
    createdAt: savedTime.toISOString()
  };
  addToLocalCache(newItem);

  addDoc(collection(db, 'guestbook'), {
    name: savedName,
    message: savedMessage,
    createdAt: savedTime
  })
    .then(() => {
      console.log('✅ Đã lưu vào Firebase');
      setTimeout(() => loadGuestbook(true), 1500);
    })
    .catch((err) => {
      console.error('❌ Lỗi lưu Firebase:', err);
      gbStatus.textContent = '⚠️ Đã lưu tạm, sẽ đồng bộ sau';
      gbStatus.style.color = '#fbbf24';
    });

  setTimeout(() => { gbStatus.textContent = ''; }, 3000);
});

function addToLocalCache(item) {
  let cache = [];
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  } catch (e) {
    cache = [];
  }

  const isDuplicate = cache.some(c =>
    c.name === item.name &&
    c.message === item.message &&
    Math.abs(new Date(c.createdAt) - new Date(item.createdAt)) < 5000
  );
  if (isDuplicate) return;

  cache.unshift(item);
  cache = cache.slice(0, 50);

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) { }
}

async function loadGuestbook(forceReload = false) {
  if (guestbookLoading) return;
  guestbookLoading = true;

  if (!localStorage.getItem(CACHE_KEY)) {
    guestbookList.innerHTML = '<p class="gb-loading">Đang tải lời chúc...</p>';
  }

  const timeoutId = setTimeout(() => {
    guestbookLoading = false;
    if (!localStorage.getItem(CACHE_KEY)) {
      guestbookList.innerHTML = `
        <p class="gb-loading">⚠️ Mạng chậm, chưa tải được</p>
        <button id="gb-retry-btn" class="gb-refresh-btn">🔄 Thử lại</button>
      `;
      const retryBtn = document.getElementById('gb-retry-btn');
      if (retryBtn) retryBtn.addEventListener('click', () => loadGuestbook(true));
    }
  }, 20000);

  try {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    clearTimeout(timeoutId);
    guestbookLoading = false;

    const items = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let createdAt = new Date().toISOString();

      if (data.createdAt) {
        if (typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate().toISOString();
        } else if (data.createdAt instanceof Date) {
          createdAt = data.createdAt.toISOString();
        } else if (data.createdAt.seconds) {
          createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (typeof data.createdAt === 'string') {
          createdAt = data.createdAt;
        }
      }

      items.push({
        name: data.name || 'Ẩn danh',
        message: data.message || '',
        createdAt
      });
    });

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    } catch (e) { }

    renderGuestbook(items);
  } catch (err) {
    clearTimeout(timeoutId);
    guestbookLoading = false;
    console.error('❌ Lỗi load:', err);

    if (!localStorage.getItem(CACHE_KEY)) {
      guestbookList.innerHTML = `
        <p class="gb-loading">❌ Không tải được lời chúc</p>
        <button id="gb-retry-btn" class="gb-refresh-btn">🔄 Thử lại</button>
      `;
      const retryBtn = document.getElementById('gb-retry-btn');
      if (retryBtn) retryBtn.addEventListener('click', () => loadGuestbook(true));
    }
  }
}

function renderGuestbook(items) {
  guestbookList.innerHTML = '';

  if (!items || items.length === 0) {
    guestbookList.innerHTML = '<p class="gb-loading">Chưa có lời chúc nào. Hãy là người đầu tiên! 💕</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gb-card';
    const timeStr = formatTime(item.createdAt);

    card.innerHTML = `
      <div class="gb-card-name">
        💕 ${escapeHtml(item.name)}
        <span class="gb-card-time">${timeStr}</span>
      </div>
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
  } catch (e) {
    return 'vừa xong';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* Nút refresh */
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

console.log('✅ Web ready!');