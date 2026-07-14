/* Levain landing — i18n + IP-based language suggestion (Apple-style banner).
   Static site: default = browser language; geo lookup only *suggests* a switch.
   English is captured from the DOM (the HTML is the source of truth for en). */

(() => {
  const LANGS = ['pt-BR', 'en', 'es'];
  const NAMES = { 'pt-BR': 'Português', en: 'English', es: 'Español' };
  const KEY_LANG = 'levain.lang';         // explicit user choice
  const KEY_GEO = 'levain.geoDismissed';  // suggestion dismissed

  // Only pt-BR and es need translating; en is read from the page.
  const T = {
    'pt-BR': {
      'nav.home': 'Início', 'nav.features': 'Recursos', 'nav.faq': 'Dúvidas', 'nav.contact': 'Contato', 'nav.download': 'Baixar App',
      'hero.rating': 'Amado por padeiros caseiros · <b>★ 4.8</b>',
      'hero.h1': 'Faça pão de fermentação natural.<br /><span class="hl">Sem achismo.</span>',
      'hero.sub': 'Aprenda fermentação natural num curso estilo Duolingo — com embasamento científico e a vivência de padeiros experientes e cientistas da fermentação. E deixe as ferramentas inteligentes tirarem o achismo de cada fornada.',
      'store.small': 'Baixe na',
      'how.label': 'Como funciona',
      'how.h2': 'Três passos até seu<br /><span class="hl">primeiro pão perfeito</span>',
      'how.sub': 'Da primeira aula ao pão na mesa, o Levain te guia em cada etapa.',
      'how.s1t': 'Aprenda a arte',
      'how.s1d': 'Comece pelo curso estilo Duolingo — aulas curtas em vídeo, com base científica e a experiência de padeiros de verdade, te levam do zero à confiança.',
      'how.s2t': 'Crie o seu levain',
      'how.s2d': 'Monte e mantenha um fermento saudável. O Levain acompanha cada alimentação e mostra o pico exato — a hora certa de assar.',
      'how.s3t': 'Asse de tudo',
      'how.s3d': 'Siga qualquer receita com timers guiados — pães, pizzas, focaccias e mais. Quentinho, crocante e inconfundivelmente seu.',
      'beyond.label': 'Além da receita',
      'beyond.h2': 'Feito para te tornar<br /><span class="hl">um padeiro melhor</span>',
      'beyond.f1t': 'Curso completo com vídeos',
      'beyond.f1d': '27 aulas em 5 módulos, com vídeo — dos ingredientes e do fermento ao método e à solução de problemas, no estilo Duolingo.',
      'beyond.f2t': 'Ferramentas para o seu levain',
      'beyond.f2d': 'Acompanhe as alimentações, receba a previsão de pico (até com geladeira) e acerte cada processo com calculadoras e timers — precisão sem achismo.',
      'beyond.f3t': 'Receitas do iniciante ao avançado',
      'beyond.f3d': 'Uma biblioteca que vai do seu primeiro pão às fórmulas mais avançadas — cada uma com modo de fornada guiado e timers inteligentes.',
      'beyond.f4t': 'Zero desperdício, além do pão',
      'beyond.f4d': 'Aproveite cada grama do fermento — pizzas, focaccias, cookies e muito mais. Sem descarte, tudo delicioso.',
      'faq.label': 'Tem dúvidas?', 'faq.h2': 'Dúvidas',
      'faq.q1': 'O que é o Levain, exatamente?',
      'faq.a1': 'O companheiro completo da fermentação natural: um curso completo, um monitor de fermento vivo, uma biblioteca de receitas com modo de fornada guiado e um kit de calculadoras e timers — tudo reunido em um app acolhedor e offline.',
      'faq.q2': 'Sou totalmente iniciante — isso é pra mim?',
      'faq.a2': 'Com certeza. O curso começa na sua primeira alimentação e explica o <em>porquê</em>, não só o passo a passo. Junte com as receitas para iniciantes e o Levain te leva até o seu primeiro pão.',
      'faq.q3': 'Como funciona a previsão de pico?',
      'faq.a3': 'O Levain considera a proporção da alimentação, a temperatura ambiente e se o fermento está na bancada ou na geladeira, e então mostra uma curva de crescimento ao vivo com o momento do pico — a hora certa de assar.',
      'faq.q4': 'Funciona mesmo offline?',
      'faq.a4': '100%. Sem conta, sem nuvem, sem rastreamento. Cada aula, receita e ferramenta vem com o app e fica no seu dispositivo — funciona até no avião, sem sinal nenhum.',
      'faq.q5': 'Qual a diferença entre Grátis e Premium?',
      'faq.a5': 'O plano Grátis inclui o monitor de fermento, o primeiro módulo do curso, algumas receitas essenciais e a calculadora de hidratação. O Premium libera o curso completo de 27 aulas, as 15 receitas com modo de fornada, a calculadora de pico, o diário e todas as ferramentas — com 7 dias grátis (US$ 14,99/mês ou US$ 99,99/ano).',
      'faq.q6': 'Quais dispositivos são compatíveis?',
      'faq.a6': 'iPhone com iOS 16 ou superior, em Inglês, Português e Espanhol. O Levain segue automaticamente o tema claro ou escuro do sistema.',
      'contact.title': 'Fale com a gente',
      'contact.sub': 'Dúvidas, bugs ou ideias? Mande uma mensagem que respondemos por e-mail.',
      'contact.name': 'Nome', 'contact.email': 'E-mail', 'contact.message': 'Mensagem',
      'contact.send': 'Enviar mensagem', 'contact.sending': 'Enviando…',
      'contact.ok': 'Mensagem enviada! Responderemos por e-mail em breve.',
      'contact.err': 'Algo deu errado. Tente novamente.',
      'footer.tagline': 'Transforme um pote de farinha e água<br />em algo que vale a pena compartilhar.',
      'footer.legal': 'Legal', 'footer.privacy': 'Política de Privacidade', 'footer.terms': 'Termos de Uso',
      'footer.contact': 'Contato', 'footer.support': 'Suporte', 'footer.language': 'Idioma',
      'footer.copyright': '© 2026 Levain. Todos os direitos reservados.',
      // mockups
      'm.course': 'Curso', 'm.videoTag': 'Aula em vídeo · 4 min', 'm.coLesson': 'Por que fermentação natural?',
      'm.co1': 'Os três ingredientes', 'm.co2': 'Farinha & proteína', 'm.co3': 'Água & hidratação',
      'm.recipes': 'Receitas', 'm.all': 'Todas', 'm.beginner': 'Iniciante', 'm.rustic': 'Rústico',
      'm.hydration75': '75% hidratação', 'm.countryLoaf': 'Pão Rústico Clássico', 'm.countryMeta': '⏱ 24h · ● Intermediário',
      'm.seededRye': 'Centeio com Sementes', 'm.softSandwich': 'Pão de Forma Macio',
      'm.morning': 'Bom dia, Vini', 'm.warm': 'vamos assar algo quentinho', 'm.toPeak': 'até o pico',
      'm.almostReady': 'Quase pronto', 'm.peaking': 'Seu fermento está no pico', 'm.fed': 'Alimentado há 6h · Pico em ~2h',
      'm.feed': 'Alimentar', 'm.discard': 'Descarte', 'm.bake': 'Assar',
      'm.continue': 'Continuar curso', 'm.lessonTitle': 'O Fermento — Montando um Levain',
      'm.doughy': 'Doughy · <span>fermento de centeio</span>',
      'm.bakeMode': 'Modo fornada', 'm.bulkStep': 'Passo 3 de 8 · Fermentação em bloco',
      'm.autolyse': 'Autólise', 'm.mixSalt': 'Misturar &amp; sal', 'm.stretchFold': 'Dobras', 'm.shape': 'Modelar', 'm.now': 'agora',
      'm.bakeLogged': 'Fornada registrada!', 'm.countryToday': 'Pão Rústico · hoje',
      'm.crust': 'Crosta', 'm.crumb': 'Miolo', 'm.streak4': 'Sequência de 4', 'm.keepGoing': 'continue assim',
    },
    es: {
      'nav.home': 'Inicio', 'nav.features': 'Funciones', 'nav.faq': 'Preguntas', 'nav.contact': 'Contacto', 'nav.download': 'Descargar App',
      'hero.rating': 'Amado por panaderos caseros · <b>★ 4.8</b>',
      'hero.h1': 'Haz pan de masa madre.<br /><span class="hl">Sin adivinar.</span>',
      'hero.sub': 'Aprende masa madre con un curso al estilo Duolingo — con base científica y la experiencia de panaderos expertos e investigadores de la fermentación. Y deja que las herramientas inteligentes le quiten la adivinación a cada horneada.',
      'store.small': 'Descárgalo en el',
      'how.label': 'Cómo funciona',
      'how.h2': 'Tres pasos hasta tu<br /><span class="hl">primer pan perfecto</span>',
      'how.sub': 'De la primera lección al pan en la mesa, Levain te acompaña en cada paso.',
      'how.s1t': 'Aprende el oficio',
      'how.s1d': 'Empieza por el curso al estilo Duolingo — lecciones cortas en vídeo, con base científica y la experiencia de panaderos de verdad, te llevan de cero a la confianza.',
      'how.s2t': 'Crea tu fermento',
      'how.s2d': 'Crea y mantén un fermento saludable. Levain sigue cada alimentación y muestra el punto máximo exacto — el momento justo para hornear.',
      'how.s3t': 'Hornéalo todo',
      'how.s3d': 'Sigue cualquier receta con temporizadores guiados — panes, pizzas, focaccias y más. Calentito, crujiente e inconfundiblemente tuyo.',
      'beyond.label': 'Más allá de la receta',
      'beyond.h2': 'Hecho para convertirte<br /><span class="hl">en mejor panadero</span>',
      'beyond.f1t': 'Curso completo con vídeos',
      'beyond.f1d': '27 lecciones en 5 módulos, con vídeo — desde los ingredientes y el fermento hasta el método y la solución de problemas, al estilo Duolingo.',
      'beyond.f2t': 'Herramientas para tu fermento',
      'beyond.f2d': 'Sigue las alimentaciones, recibe la estimación del punto máximo (incluso con nevera) y ajusta cada proceso con calculadoras y temporizadores — precisión sin adivinar.',
      'beyond.f3t': 'Recetas de principiante a avanzado',
      'beyond.f3d': 'Una biblioteca que va desde tu primer pan hasta las fórmulas más avanzadas — cada una con modo de horneado guiado y temporizadores inteligentes.',
      'beyond.f4t': 'Cero desperdicio, más que pan',
      'beyond.f4d': 'Aprovecha cada gramo de fermento — pizzas, focaccias, galletas y mucho más. Sin descartes, todo delicioso.',
      'faq.label': '¿Tienes dudas?', 'faq.h2': 'Preguntas frecuentes',
      'faq.q1': '¿Qué es exactamente Levain?',
      'faq.a1': 'El compañero todo-en-uno de la masa madre: un curso completo, un monitor de fermento vivo, una biblioteca de recetas con modo de horneado guiado y un kit de calculadoras y temporizadores — todo reunido en una app cálida y sin conexión.',
      'faq.q2': 'Soy principiante total — ¿es para mí?',
      'faq.a2': 'Claro que sí. El curso empieza desde tu primera alimentación y explica el <em>porqué</em>, no solo los pasos. Combínalo con las recetas para principiantes y Levain te acompaña hasta tu primer pan.',
      'faq.q3': '¿Cómo funciona la estimación del punto máximo?',
      'faq.a3': 'Levain tiene en cuenta la proporción de alimentación, la temperatura ambiente y si el fermento está en la encimera o en la nevera, y muestra una curva de crecimiento en vivo con el momento del punto máximo — el momento ideal para hornear.',
      'faq.q4': '¿Funciona de verdad sin conexión?',
      'faq.a4': '100%. Sin cuenta, sin nube, sin rastreo. Cada lección, receta y herramienta viene con la app y vive en tu dispositivo — funciona hasta en un avión sin señal.',
      'faq.q5': '¿Cuál es la diferencia entre Gratis y Premium?',
      'faq.a5': 'El plan Gratis incluye el monitor de fermento, el primer módulo del curso, algunas recetas esenciales y la calculadora de hidratación. Premium desbloquea el curso completo de 27 lecciones, las 15 recetas con modo de horneado, la calculadora de punto máximo, el diario y todas las herramientas — con 7 días gratis (US$ 14,99/mes o US$ 99,99/año).',
      'faq.q6': '¿Qué dispositivos son compatibles?',
      'faq.a6': 'iPhone con iOS 16 o superior, en Inglés, Português y Español. Levain sigue automáticamente el tema claro u oscuro del sistema.',
      'contact.title': 'Hablemos',
      'contact.sub': '¿Dudas, errores o ideas? Envía un mensaje y te respondemos por correo.',
      'contact.name': 'Nombre', 'contact.email': 'Correo', 'contact.message': 'Mensaje',
      'contact.send': 'Enviar mensaje', 'contact.sending': 'Enviando…',
      'contact.ok': '¡Mensaje enviado! Te responderemos por correo pronto.',
      'contact.err': 'Algo salió mal. Inténtalo de nuevo.',
      'footer.tagline': 'Convierte un frasco de harina y agua<br />en algo que vale la pena compartir.',
      'footer.legal': 'Legal', 'footer.privacy': 'Política de Privacidad', 'footer.terms': 'Términos de Servicio',
      'footer.contact': 'Contacto', 'footer.support': 'Soporte', 'footer.language': 'Idioma',
      'footer.copyright': '© 2026 Levain. Todos los derechos reservados.',
      // mockups
      'm.course': 'Curso', 'm.videoTag': 'Lección en vídeo · 4 min', 'm.coLesson': '¿Por qué masa madre?',
      'm.co1': 'Los tres ingredientes', 'm.co2': 'Harina y proteína', 'm.co3': 'Agua e hidratación',
      'm.recipes': 'Recetas', 'm.all': 'Todas', 'm.beginner': 'Principiante', 'm.rustic': 'Rústico',
      'm.hydration75': '75% hidratación', 'm.countryLoaf': 'Pan de Campo Clásico', 'm.countryMeta': '⏱ 24h · ● Intermedio',
      'm.seededRye': 'Centeno con Semillas', 'm.softSandwich': 'Pan de Molde Suave',
      'm.morning': 'Buenos días, Vini', 'm.warm': 'horneemos algo calentito', 'm.toPeak': 'al punto',
      'm.almostReady': 'Casi listo', 'm.peaking': 'Tu fermento está en su punto', 'm.fed': 'Alimentado hace 6h · Punto en ~2h',
      'm.feed': 'Alimentar', 'm.discard': 'Descarte', 'm.bake': 'Hornear',
      'm.continue': 'Seguir curso', 'm.lessonTitle': 'El Fermento — Armando un Levain',
      'm.doughy': 'Doughy · <span>fermento de centeno</span>',
      'm.bakeMode': 'Modo horneado', 'm.bulkStep': 'Paso 3 de 8 · Fermentación en bloque',
      'm.autolyse': 'Autólisis', 'm.mixSalt': 'Mezclar y sal', 'm.stretchFold': 'Pliegues', 'm.shape': 'Formar', 'm.now': 'ahora',
      'm.bakeLogged': '¡Horneada registrada!', 'm.countryToday': 'Pan de Campo · hoy',
      'm.crust': 'Corteza', 'm.crumb': 'Miga', 'm.streak4': 'Racha de 4', 'm.keepGoing': 'sigue así',
    },
  };

  // Country → language (only the languages we support). Others fall back to en.
  const PT = ['BR', 'PT', 'AO', 'MZ'];
  const ES = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR'];
  const countryToLang = (cc) => (PT.includes(cc) ? 'pt-BR' : ES.includes(cc) ? 'es' : 'en');

  const els = document.querySelectorAll('[data-i18n]');
  const legalLinks = document.querySelectorAll('[data-doc]');
  const docSuffix = { 'pt-BR': 'pt-br', en: 'en', es: 'es' };
  const LEGAL_BASE = 'https://oviniciusramosp.github.io/bread-legal/legal';

  // Capture English originals straight from the DOM.
  const EN = {};
  els.forEach((el) => { EN[el.getAttribute('data-i18n')] = el.innerHTML; });

  // Icon-only controls carry their label in aria-label — translate that too.
  const ariaEls = document.querySelectorAll('[data-i18n-aria]');
  const EN_ARIA = {};
  ariaEls.forEach((el) => { EN_ARIA[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });

  const normalize = (l) => {
    l = (l || '').toLowerCase();
    if (l.startsWith('pt')) return 'pt-BR';
    if (l.startsWith('es')) return 'es';
    return 'en';
  };

  function apply(lang) {
    const dict = lang === 'en' ? EN : T[lang];
    els.forEach((el) => {
      const k = el.getAttribute('data-i18n');
      const v = dict[k] != null ? dict[k] : EN[k];
      if (v == null) return;
      if (/[<&]/.test(v)) el.innerHTML = v; else el.textContent = v;
    });
    ariaEls.forEach((el) => {
      const k = el.getAttribute('data-i18n-aria');
      const v = dict[k] != null ? dict[k] : EN_ARIA[k];
      if (v != null) el.setAttribute('aria-label', v);
    });
    legalLinks.forEach((a) => {
      a.href = `${LEGAL_BASE}/${a.getAttribute('data-doc')}-${docSuffix[lang]}.html`;
    });
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : lang;
    const sel = document.getElementById('langSelect');
    if (sel && sel.value !== lang) sel.value = lang;
    // Hero screenshots: light variant per language (es falls back to en).
    const shotDir = { 'pt-BR': 'pt-br', en: 'en', es: 'en' }[lang] || 'en';
    document.querySelectorAll('.shot').forEach((img) => {
      img.src = `assets/screenshots/${shotDir}/${img.dataset.shot}-light.png`;
    });
    current = lang;
  }

  function choose(lang) { // explicit user pick
    localStorage.setItem(KEY_LANG, lang);
    apply(lang);
    hideBanner();
  }

  // ---- initial language: saved choice, else browser ----
  const saved = localStorage.getItem(KEY_LANG);
  let current = saved && LANGS.includes(saved) ? saved : normalize(navigator.language || (navigator.languages || [])[0]);
  apply(current);

  // Runtime lookup for strings not present in the DOM (modal status messages).
  // For 'en' there is no dictionary, so the caller's fallback is used.
  window.LevainI18n = {
    t(key, fallback) {
      const dict = T[current];
      return dict && dict[key] != null ? dict[key] : fallback;
    },
    get lang() { return current; },
  };

  // footer dropdown
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = current;
    langSelect.addEventListener('change', () => choose(langSelect.value));
  }

  // ---- Apple-style geo suggestion banner ----
  let banner;
  function hideBanner() { if (banner) banner.classList.remove('show'); document.documentElement.classList.remove('banner-open'); }

  function showBanner(suggest) {
    banner = document.createElement('div');
    banner.className = 'lang-banner';
    banner.setAttribute('role', 'region');
    banner.innerHTML =
      `<span class="lang-banner__msg">🌐 ${BANNER[suggest].msg}</span>` +
      `<button class="lang-banner__go" type="button">${BANNER[suggest].go}</button>` +
      `<button class="lang-banner__x" type="button" aria-label="${BANNER[suggest].close}">✕</button>`;
    document.body.appendChild(banner);
    banner.querySelector('.lang-banner__go').addEventListener('click', () => choose(suggest));
    banner.querySelector('.lang-banner__x').addEventListener('click', () => {
      localStorage.setItem(KEY_GEO, '1'); hideBanner();
    });
    requestAnimationFrame(() => {
      banner.classList.add('show');
      document.documentElement.classList.add('banner-open');
    });
  }

  const BANNER = {
    'pt-BR': { msg: 'Prefere ver este site em Português?', go: 'Mudar para Português', close: 'Fechar' },
    en: { msg: 'Would you prefer to view this site in English?', go: 'Switch to English', close: 'Close' },
    es: { msg: '¿Prefieres ver este sitio en Español?', go: 'Cambiar a Español', close: 'Cerrar' },
  };

  // Detect country, trying a couple of free CORS endpoints (one may be blocked/down).
  async function detectCountry() {
    const sources = [
      ['https://ipwho.is/?fields=country_code', (j) => j.country_code],
      ['https://get.geojs.io/v1/ip/country.json', (j) => j.country],
    ];
    for (const [url, pick] of sources) {
      try {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 3000);
        const r = await fetch(url, { signal: ctrl.signal });
        clearTimeout(to);
        const cc = (pick(await r.json()) || '').toUpperCase();
        if (cc) return cc;
      } catch (e) { /* try next source */ }
    }
    return null;
  }

  // Only suggest if the user hasn't picked a language and hasn't dismissed before.
  if (!saved && !localStorage.getItem(KEY_GEO)) {
    detectCountry().then((cc) => {
      if (!cc) return; // geo unavailable → no banner, page already in browser language
      const suggest = countryToLang(cc);
      if (suggest !== current) showBanner(suggest);
    });
  }
})();
