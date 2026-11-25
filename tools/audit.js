(() => {
  const cyr = /[\u0410-\u044f\u0401\u0451]/;
  const untranslated = [];
  document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && cyr.test(el.textContent || '')) untranslated.push([key, el.textContent.trim().slice(0, 40)]);
    const ph = el.getAttribute('data-i18n-placeholder');
    if (ph && cyr.test(el.getAttribute('placeholder') || '')) untranslated.push([ph, el.getAttribute('placeholder')]);
    const al = el.getAttribute('data-i18n-aria-label');
    if (al && cyr.test(el.getAttribute('aria-label') || '')) untranslated.push([al, el.getAttribute('aria-label')]);
  });
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
  const dupes = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  const missingAnchors = [...new Set([...document.querySelectorAll('a[href^="#"]')]
    .map(a => a.getAttribute('href'))
    .filter(h => h !== '#' && !document.getElementById(h.slice(1))))];
  const imgsNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
  const h1 = document.querySelectorAll('h1').length;
  return {
    lang: document.documentElement.lang,
    untranslated,
    dupes,
    missingAnchors,
    imgsNoAlt,
    h1Count: h1,
    title: document.title,
    metaDesc: document.querySelector('meta[name="description"]').content.slice(0, 60)
  };
})()
