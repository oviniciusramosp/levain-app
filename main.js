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
const WEB3FORMS_KEY = 'PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE';

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
  const data = Object.fromEntries(new FormData(form));

  btn.disabled = true;
  status.className = 'modal__status';
  status.textContent = t('contact.sending', 'Sending…');

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: 'Levain - Support (Site)',
        from_name: 'Levain Site',
        name: data.name,
        email: data.email,
        message: data.message,
        botcheck: data.botcheck ? true : false,
      }),
    });
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
