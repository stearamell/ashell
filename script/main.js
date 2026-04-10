/* ============================================================
   jenni BIRTHDAY - main.js
   ============================================================ */

const TOTAL_SLIDES = 8;
let currentSlide = 1;
let seqIndex = 0;
const seqTotal = 5;

/* ---- Star Canvas ---- */
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({ length: 220 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  r: Math.random() * 1.6 + 0.2,
  alpha: Math.random(),
  speed: Math.random() * 0.006 + 0.002,
  dir: Math.random() > 0.5 ? 1 : -1
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed * s.dir;
    if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,200,230,${s.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* ---- Cursor Sparkle ---- */
document.addEventListener('mousemove', e => {
  if (Math.random() > 0.72) {
    const el = document.createElement('div');
    el.className = 'cursor-spark';
    const size = (Math.random() * 7 + 3) + 'px';
    el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size};height:${size};
      background:${['#ff69b4','#ffd700','#c084fc','#ffb3d9','#fff'][Math.floor(Math.random()*5)]};`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 560);
  }
});

/* ---- Floating Particles ---- */
const pContainer = document.getElementById('particles');
const pColors = ['#ff69b4','#ffd700','#c084fc','#ffb3d9','#ff9de2','#ffe4f3','#7dd1c8'];

function spawnParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = (Math.random() * 7 + 3) + 'px';
  p.style.cssText = `left:${Math.random()*100}vw;width:${size};height:${size};
    background:${pColors[Math.floor(Math.random()*pColors.length)]};
    animation-duration:${Math.random()*8+6}s;
    animation-delay:${Math.random()*3}s;`;
  pContainer.appendChild(p);
  setTimeout(() => p.remove(), 13000);
}
setInterval(spawnParticle, 380);
for (let i = 0; i < 18; i++) setTimeout(spawnParticle, i * 180);

/* ---- Confetti ---- */
function launchConfetti(count = 90) {
  const colors = ['#ff69b4','#ffd700','#c084fc','#ff9de2','#7dd175','#63b3ed','#ffb347','#ff8c00'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      const w = (Math.random() * 9 + 4) + 'px';
      const h = (Math.random() * 13 + 6) + 'px';
      c.style.cssText = `left:${Math.random()*100}vw;width:${w};height:${h};
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${Math.random()*2+2.5}s;
        animation-delay:${Math.random()*0.8}s;
        transform:rotate(${Math.random()*360}deg);`;
      document.getElementById('confetti-container').appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 30);
  }
}

/* ---- Fireworks (slide 7) ---- */
function launchFireworks() {
  const fw = document.getElementById('fireworks');
  if (!fw) return;
  const colors = ['#ff69b4','#ffd700','#c084fc','#7dd1c8','#ff9de2','#63b3ed'];
  for (let b = 0; b < 6; b++) {
    setTimeout(() => {
      const cx = 10 + Math.random() * 80;
      const cy = 10 + Math.random() * 50;
      for (let p = 0; p < 18; p++) {
        const dot = document.createElement('div');
        dot.className = 'firework';
        const angle = (p / 18) * Math.PI * 2;
        const dist = 60 + Math.random() * 60;
        const tx = `translateX(${Math.cos(angle)*dist}px)`;
        const ty = `translateY(${Math.sin(angle)*dist}px)`;
        dot.style.cssText = `left:${cx}vw;top:${cy}vh;background:${colors[Math.floor(Math.random()*colors.length)]};
          --tx:${tx};--ty:${ty};animation-duration:${0.8+Math.random()*0.6}s;animation-delay:${b*0.25}s;`;
        fw.appendChild(dot);
        setTimeout(() => dot.remove(), 2000);
      }
    }, b * 280);
  }
}

/* ---- Progress Dots ---- */
function buildDots() {
  const container = document.getElementById('progressDots');
  container.innerHTML = '';
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const d = document.createElement('div');
    d.className = 'pdot' + (i === currentSlide ? ' active' : '');
    d.onclick = () => goToSlide(i);
    container.appendChild(d);
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.pdot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i + 1 === currentSlide);
  });
}

/* ---- Slide Navigation ---- */
function goToSlide(n) {
  if (n < 1 || n > TOTAL_SLIDES) return;

  // Hide current
  const cur = document.getElementById(`slide-${currentSlide}`);
  if (cur) {
    cur.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    cur.style.opacity = '0';
    cur.style.transform = n > currentSlide ? 'translateX(-40px)' : 'translateX(40px)';
    cur.classList.remove('active');
    setTimeout(() => {
      cur.style.transform = '';
      cur.style.transition = '';
    }, 460);
  }

  currentSlide = n;
  updateDots();

  // Show next after slight delay
  setTimeout(() => {
    const next = document.getElementById(`slide-${currentSlide}`);
    if (!next) return;
    next.style.opacity = '0';
    next.style.transform = n > (n - 1) ? 'translateX(40px)' : 'translateX(-40px)';
    next.classList.add('active');
    next.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    requestAnimationFrame(() => {
      next.style.opacity = '1';
      next.style.transform = 'translateX(0)';
    });
    setTimeout(() => {
      next.style.transition = '';
    }, 460);

    // Per-slide hooks
    onSlideEnter(currentSlide);
  }, 250);
}

function nextSlide() {
  if (currentSlide < TOTAL_SLIDES) goToSlide(currentSlide + 1);
}

/* ---- Per-slide enter hooks ---- */
function onSlideEnter(n) {
  if (n === 6) {
    // Restart balloon animations
    document.querySelectorAll('.balloon').forEach(b => {
      b.style.animation = 'none';
      void b.offsetWidth;
      b.style.animation = '';
    });
  }
  if (n === 7) {
    setTimeout(launchFireworks, 1500);
    setTimeout(() => launchConfetti(60), 2000);
  }
  if (n === 8) {
    setTimeout(() => launchConfetti(120), 400);
  }
  // reset seq on slide 5
  if (n === 5) {
    seqIndex = 0;
    resetSeq();
  }
}

/* ---- Skip animation ---- */
function skipAnimation() {
  // Just go to the next slide immediately
  nextSlide();
}

/* ---- Sequence (slide 5) ---- */
const seqIds = ['seq1','seq2','seq3','seq4','seq5'];

function resetSeq() {
  seqIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });
  document.getElementById('seqNextBtn').classList.remove('hidden');
  document.getElementById('slideNextBtn').classList.add('hidden');
  // Show first
  showSeqItem(0);
}

function showSeqItem(idx) {
  const el = document.getElementById(seqIds[idx]);
  if (!el) return;
  el.classList.remove('hidden');
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px) scale(0.92)';
  el.style.transition = 'all 0.55s cubic-bezier(0.34,1.4,0.64,1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    });
  });
  // Tilt the smile on last item
  if (idx === 4) {
    setTimeout(() => {
      const sm = document.querySelector('.tilt-smile');
      if (sm) sm.classList.add('tilted');
    }, 800);
  }
}

function nextSeq() {
  // Hide current visible
  const cur = document.getElementById(seqIds[seqIndex]);
  if (cur) {
    cur.style.transition = 'all 0.4s ease';
    cur.style.opacity = '0';
    cur.style.transform = 'translateY(-20px)';
    setTimeout(() => { cur.classList.add('hidden'); cur.style.transform = ''; }, 420);
  }

  seqIndex++;
  if (seqIndex < seqTotal) {
    setTimeout(() => showSeqItem(seqIndex), 450);
    if (seqIndex === seqTotal - 1) {
      // Last item — swap buttons
      setTimeout(() => {
        document.getElementById('seqNextBtn').classList.add('hidden');
        document.getElementById('slideNextBtn').classList.remove('hidden');
      }, 500);
    }
  }
}

/* ---- Replay ---- */
function replayAll() {
  seqIndex = 0;
  launchConfetti(60);
  goToSlide(1);
  // Restart music
  const song = document.querySelector('.song');
  if (song) { song.currentTime = 0; song.play().catch(() => {}); }
}

/* ---- SweetAlert + Boot ---- */
window.addEventListener('load', () => {
  buildDots();

  Swal.fire({
    title: '🎂 Surprise untuk jenni sesill!',
    html: '<p style="color:rgba(255,255,255,0.75);font-family:Quicksand,sans-serif;font-size:1rem">Ada sesuatu yang spesial untukmu 💕<br>Mau buka hadiah ini?</p>',
    background: 'rgba(18,8,36,0.97)',
    color: '#fff',
    showCancelButton: true,
    confirmButtonText: 'Buka! 🎉',
    cancelButtonText: 'Nanti aja',
    confirmButtonColor: '#ff69b4',
    cancelButtonColor: 'rgba(255,255,255,0.08)',
    backdrop: 'rgba(8,4,18,0.88)',
    customClass: {
      popup: 'swal2-popup-custom',
      title: 'swal2-title-custom',
    }
  }).then(result => {
    if (result.isConfirmed) {
      const song = document.querySelector('.song');
      if (song) song.play().catch(() => {});
    }
    // Show slide 1 with animation
    const s1 = document.getElementById('slide-1');
    if (s1) {
      s1.style.opacity = '0';
      s1.classList.add('active');
      requestAnimationFrame(() => {
        s1.style.transition = 'opacity 0.8s ease';
        s1.style.opacity = '1';
        setTimeout(() => { s1.style.transition = ''; }, 850);
      });
    }
    onSlideEnter(1);
  });
});
