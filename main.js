// Levain landing — progressive enhancement only. Page works without JS.

// 1) Navbar background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

// 2) Reveal on enter viewport
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 3) Count-up stats (fires once when the stats row is visible)
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1400, start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const countIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
  }
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

// 4) Subtle pointer tilt on the hero phone (desktop, motion-ok only)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tilt = document.querySelector('[data-tilt]');
if (tilt && !reduce && matchMedia('(pointer:fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', (ev) => {
    const r = hero.getBoundingClientRect();
    const dx = (ev.clientX - r.left) / r.width - 0.5;
    const dy = (ev.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg)`;
  });
  hero.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}
