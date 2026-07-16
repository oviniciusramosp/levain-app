/* Levain landing: language routing between the static pages (/, /pt/, /es/).
   Each page is fully translated at build time (see build.js); this script only
   (1) redirects to a previously chosen language, (2) suggests a switch when the
   browser language differs from the page, and (3) serves the few strings the
   contact form injects at runtime. */

(() => {
  const PATHS = { en: '/', 'pt-BR': '/pt/', es: '/es/' };
  const KEY_LANG = 'levain.lang';         // explicit user choice
  const KEY_DISMISS = 'levain.geoDismissed'; // suggestion dismissed

  const lang = document.documentElement.lang in PATHS ? document.documentElement.lang : 'en';

  // Contact-form status strings (set from JS, so not covered by the build).
  // English lives in main.js as the fallback.
  const MSGS = {
    'pt-BR': {
      'contact.sending': 'Enviando…',
      'contact.ok': 'Mensagem enviada! Responderemos por e-mail em breve.',
      'contact.err': 'Algo deu errado. Tente novamente.',
    },
    es: {
      'contact.sending': 'Enviando…',
      'contact.ok': '¡Mensaje enviado! Te responderemos por correo pronto.',
      'contact.err': 'Algo salió mal. Inténtalo de nuevo.',
    },
  };
  window.LevainI18n = {
    t: (key, fallback) => (MSGS[lang] && MSGS[lang][key] != null ? MSGS[lang][key] : fallback),
    get lang() { return lang; },
  };

  const go = (l) => {
    localStorage.setItem(KEY_LANG, l);
    if (l !== lang) location.href = PATHS[l];
  };

  const sel = document.getElementById('langSelect');
  if (sel) {
    sel.value = lang;
    sel.addEventListener('change', () => go(sel.value));
  }

  // Explicit earlier choice wins: send the visitor to their language.
  const saved = localStorage.getItem(KEY_LANG);
  if (saved && PATHS[saved] && saved !== lang) {
    location.replace(PATHS[saved]);
    return;
  }

  // Otherwise, if the browser language differs from the page, suggest (never force).
  const normalize = (l) => {
    l = (l || '').toLowerCase();
    if (l.startsWith('pt')) return 'pt-BR';
    if (l.startsWith('es')) return 'es';
    return 'en';
  };
  const suggest = normalize(navigator.language || (navigator.languages || [])[0]);
  if (saved || suggest === lang || localStorage.getItem(KEY_DISMISS)) return;

  const BANNER = {
    'pt-BR': { msg: 'Prefere ver este site em Português?', go: 'Mudar para Português', close: 'Fechar' },
    en: { msg: 'Would you prefer to view this site in English?', go: 'Switch to English', close: 'Close' },
    es: { msg: '¿Prefieres ver este sitio en Español?', go: 'Cambiar a Español', close: 'Cerrar' },
  };

  const banner = document.createElement('div');
  banner.className = 'lang-banner';
  banner.setAttribute('role', 'region');
  banner.innerHTML =
    `<span class="lang-banner__msg">🌐 ${BANNER[suggest].msg}</span>` +
    `<button class="lang-banner__go" type="button">${BANNER[suggest].go}</button>` +
    `<button class="lang-banner__x" type="button" aria-label="${BANNER[suggest].close}">✕</button>`;
  document.body.appendChild(banner);

  const hide = () => {
    banner.classList.remove('show');
    document.documentElement.classList.remove('banner-open');
  };
  banner.querySelector('.lang-banner__go').addEventListener('click', () => go(suggest));
  banner.querySelector('.lang-banner__x').addEventListener('click', () => {
    localStorage.setItem(KEY_DISMISS, '1');
    hide();
  });
  requestAnimationFrame(() => {
    banner.classList.add('show');
    document.documentElement.classList.add('banner-open');
  });
})();
