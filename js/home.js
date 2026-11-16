/* ==========================================================================
   KŌSŌ — Accueil
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const G = !!(window.gsap && window.ScrollTrigger) && !D.reduced;
  const small = () => innerWidth < 760;
  const cap = f => { for (const [id, list] of Object.entries(D.gallery)) { const g = list.find(x => x.f === f); if (g) return `${D.brand(id)?.name || id} — ${g.c}` } return '' };

  /* ——————————————————————————————————————————————
     1. Héros : la visite de la maison Kōsō en vidéo
        (une seule lecture, arrêt sur la dernière image)
     —————————————————————————————————————————————— */
  const slides = $$('#slides img'), rn = $('#room-name'), pb = $('#slides-pause');
  let si = 0, st = null, sPaused = D.reduced;
  const show = i => {
    si = (i + slides.length) % slides.length;
    const next = slides[si];
    next.loading = 'eager';
    slides.forEach(im => im.classList.toggle('is-on', im === next));
    rn.textContent = next.dataset.room;
    slides[(si + 1) % slides.length].loading = 'eager';
  };
  const run = () => { clearInterval(st); if (!sPaused) st = setInterval(() => show(si + 1), 4500) };
  const setPaused = p => {
    sPaused = p; run();
    pb.setAttribute('aria-label', p ? 'Relancer le diaporama' : 'Mettre le diaporama en pause');
    pb.innerHTML = D.SVG[p ? 'play' : 'pause'];
  };
  pb.addEventListener('click', () => setPaused(!sPaused));
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(st) : run());
  setPaused(sPaused);
  const soc = $('#social-links');
  if (soc) soc.innerHTML = D.SITE.socials.map(([n, ic, h]) => `<li><a href="${h || '#'}" aria-label="${n}"${h ? ' rel="noopener" target="_blank"' : ''}>${D.SVG[ic]}</a></li>`).join('');
  if (G) gsap.to('.hero-content, .room-chip', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: '35% top', end: 'bottom top', scrub: true } });

  /* ——————————————————————————————————————————————
     2. Manifeste : les mots s'allument au fil du scroll
     —————————————————————————————————————————————— */
  const mt = $('#manif-text');
  mt.innerHTML = mt.textContent.split(/\s+/).map(w => `<span class="mw">${esc(w)}</span>`).join(' ');
  if (G) gsap.to($$('.mw', mt), { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: mt, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  else $$('.mw', mt).forEach(w => w.style.opacity = 1);

  if (G) $$('[data-count-to]').forEach(el => {
    const n = +el.dataset.countTo, o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v) });
  });

})();
