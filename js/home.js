/* ==========================================================================
   KŌSŌ — Accueil : diaporama pleine largeur
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$;
  const slides = $$('#slides img'), rn = $('#room-name'), rr = $('#room-ref'), pb = $('#slides-pause'), dots = $('#sl-dots');
  dots.innerHTML = slides.map(() => '<i></i>').join('');
  let si = 0, st = null, paused = D.reduced;
  const show = i => {
    si = (i + slides.length) % slides.length;
    const next = slides[si];
    next.loading = 'eager'; slides[(si + 1) % slides.length].loading = 'eager';
    slides.forEach(im => im.classList.toggle('is-on', im === next));
    $$('i', dots).forEach((d, k) => d.classList.toggle('is-on', k === si));
    rn.textContent = next.dataset.room; rr.textContent = next.dataset.ref;
  };
  const run = () => { clearInterval(st); if (!paused) st = setInterval(() => show(si + 1), 5000) };
  const setPaused = p => {
    paused = p; run();
    pb.setAttribute('aria-label', p ? 'Relancer le diaporama' : 'Mettre le diaporama en pause');
    pb.innerHTML = D.SVG[p ? 'play' : 'pause'];
  };
  $('#sl-prev').addEventListener('click', () => { show(si - 1); run() });
  $('#sl-next').addEventListener('click', () => { show(si + 1); run() });
  pb.addEventListener('click', () => setPaused(!paused));
  /* glisser du doigt sur mobile */
  let x0 = null;
  $('.slider').addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  $('.slider').addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { show(si + (dx < 0 ? 1 : -1)); run() } x0 = null });
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(st) : run());
  show(0); setPaused(paused);
})();
