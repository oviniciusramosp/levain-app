/* Generates the static pt/ and es/ pages from index.html (the English source).
   Usage: node build.js
   Run after any edit to index.html or translations.js, then commit the output. */

const fs = require('fs');
const path = require('path');
const { HEAD, T } = require('./translations');

const SITE = 'https://levain-app.com';
const src = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const stripTags = (s) => s.replace(/<[^>]+>/g, '');

function jsonLd(lang) {
  const h = HEAD[lang];
  const t = T[lang];
  const faq = [1, 2, 3, 4, 5, 6].map((i) => ({
    '@type': 'Question',
    name: stripTags(t[`faq.q${i}`]),
    acceptedAnswer: { '@type': 'Answer', text: stripTags(t[`faq.a${i}`]) },
  }));
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Levain',
        description: h.siteSchemaDescription,
        inLanguage: ['en', 'pt-BR', 'es'],
        publisher: { '@id': `${SITE}/#org` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE}/#org`,
        name: 'Levain',
        url: `${SITE}/`,
        logo: `${SITE}/assets/icon.png`,
        sameAs: ['https://www.instagram.com/levain.app', 'https://www.tiktok.com/@levain.app'],
      },
      {
        '@type': 'MobileApplication',
        '@id': `${SITE}/#app`,
        name: 'Levain',
        operatingSystem: 'iOS 16.0 or later',
        applicationCategory: 'LifestyleApplication',
        url: `${SITE}/`,
        image: `${SITE}/assets/icon.png`,
        description: h.appSchemaDescription,
        inLanguage: ['en', 'pt-BR', 'es'],
        author: { '@id': `${SITE}/#org` },
        offers: [
          { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Premium (monthly)', price: '14.99', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Premium (yearly)', price: '99.99', priceCurrency: 'USD' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE}${h.path}#faq`,
        inLanguage: lang,
        mainEntity: faq,
      },
    ],
  };
  return JSON.stringify(data, null, 2);
}

function buildPage(lang) {
  const h = HEAD[lang];
  const t = T[lang];
  const url = `${SITE}${h.path}`;
  let html = src;

  // <html lang>
  html = html.replace('<html lang="en">', `<html lang="${lang}">`);

  // Head: title, descriptions, canonical, og/twitter, locale
  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${h.title.replace(/&/g, '&amp;')}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${h.metaDescription}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${h.title.replace(/&/g, '&amp;')}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${h.ogDescription}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${h.ogImageAlt}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${h.title.replace(/&/g, '&amp;')}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${h.twitterDescription}$2`);

  // og:locale: page locale becomes primary, en_US moves to the alternates
  html = html.replace(
    /<meta property="og:locale" content="en_US" \/>\n(\s*)<meta property="og:locale:alternate" content="pt_BR" \/>\n\s*<meta property="og:locale:alternate" content="es_ES" \/>/,
    (m, indent) => {
      const others = ['en_US', 'pt_BR', 'es_ES'].filter((l) => l !== h.locale);
      return `<meta property="og:locale" content="${h.locale}" />\n${indent}` +
        others.map((l) => `<meta property="og:locale:alternate" content="${l}" />`).join(`\n${indent}`);
    }
  );

  // JSON-LD: replace the whole block
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${jsonLd(lang)}\n  </script>`
  );

  // Body copy: swap innerHTML of every [data-i18n] element present in the dict
  // (footer.support is aria-only, footer.language has no element; both handled below)
  const NO_ELEMENT = new Set(['footer.support', 'footer.language']);
  for (const [key, value] of Object.entries(t)) {
    if (NO_ELEMENT.has(key)) continue;
    const re = new RegExp(`(<(\\w+)[^>]*\\bdata-i18n="${key.replace('.', '\\.')}"[^>]*>)[\\s\\S]*?(</\\2>)`, 'g');
    if (!re.test(html)) console.warn(`[${lang}] data-i18n key not found in HTML: ${key}`);
    re.lastIndex = 0;
    html = html.replace(re, `$1${value}$3`);
  }

  // aria-label on icon-only controls
  html = html.replace(/(data-i18n-aria="footer.support" aria-label=")[^"]*(")/, `$1${t['footer.support']}$2`);

  // Legal docs per language
  html = html.replace(/-en\.html/g, `-${h.legalSuffix}.html`);

  // Hero screenshots + alt text
  html = html.replace(/\/assets\/screenshots\/en\//g, `/assets/screenshots/${h.shotsDir}/`);
  html = html
    .replace('alt="Levain home screen with sourdough starter status and course progress"', `alt="${h.altShot01}"`)
    .replace('alt="Levain recipe screen showing a guided sourdough bake"', `alt="${h.altShot02}"`);

  // Language selector: preselect this page's language (works without JS)
  html = html
    .replace('<option value="en" selected>', '<option value="en">')
    .replace(`<option value="${lang}">`, `<option value="${lang}" selected>`);

  const outDir = path.join(__dirname, h.path.replaceAll('/', ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`built ${h.path}index.html`);
}

Object.keys(HEAD).forEach(buildPage);
