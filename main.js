// Levain landing — progressive enhancement. Page works without JS (FAQ uses native <details>).

// Navbar background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

// Reveal on enter viewport
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// FAQ: keep only one item open at a time
const items = document.querySelectorAll('.qa');
items.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
}));

/* ── Contact modal ──────────────────────────────────────────────
   The form posts to Web3Forms, which holds the destination address
   server-side — the site never exposes an email address.
   Get a key at https://web3forms.com (free) and paste it below. */
const WEB3FORMS_KEY = '7971e1c6-68d7-45c1-8677-47343c0cafa8';

const modal = document.getElementById('contactModal');
const form = document.getElementById('contactForm');
const status = document.getElementById('contactStatus');
let lastFocused = null;

const t = (key, fallback) => (window.LevainI18n ? window.LevainI18n.t(key, fallback) : fallback);

function openModal(e) {
  if (e) e.preventDefault();
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  status.textContent = '';
  status.className = 'modal__status';
  modal.querySelector('input[name="name"]').focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-contact]').forEach((el) => el.addEventListener('click', openModal));
modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const btn = form.querySelector('.modal__submit');

  btn.disabled = true;
  status.className = 'modal__status';
  status.textContent = t('contact.sending', 'Sending…');

  // Send as FormData (multipart): a CORS "simple request", so no preflight.
  // A JSON body would trigger an OPTIONS preflight, which the API rejects.
  const fd = new FormData(form);
  fd.append('access_key', WEB3FORMS_KEY);
  fd.append('subject', 'Levain - Support (Site)');
  fd.append('from_name', 'Levain Site');

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'failed');

    form.reset();
    status.className = 'modal__status ok';
    status.textContent = t('contact.ok', 'Message sent! We’ll reply by email soon.');
  } catch (err) {
    status.className = 'modal__status err';
    status.textContent = t('contact.err', 'Something went wrong. Please try again.');
  } finally {
    btn.disabled = false;
  }
});
