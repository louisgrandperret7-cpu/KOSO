/* ==========================================================================
   KŌSŌ — Accueil : diaporama pleine largeur
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
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

  /* Les marques, de A à Z */
  const az = $('#az');
  if (az && D.brands) {
    const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const list = [...D.brands].sort((a, b) => norm(a.name).localeCompare(norm(b.name), 'fr', { numeric: true }));
    const groups = [];
    list.forEach(b => { const k = /\d/.test(norm(b.name)[0]) ? '0–9' : norm(b.name)[0].toUpperCase(); const g = groups[groups.length - 1]; (g && g.k === k) ? g.l.push(b) : groups.push({ k, l: [b] }) });
    az.innerHTML = groups.map(g => `<div class="az-g rv"><p class="az-letter" aria-hidden="true">${g.k}</p>${g.l.map(b => `<a href="${b.page === 'carrelage' ? 'carrelage' : b.page}.html#${b.id}"><span class="az-n">${esc(b.name)}</span></a>`).join('')}</div>`).join('');
  }
})();
