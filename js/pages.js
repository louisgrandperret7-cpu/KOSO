/* ==========================================================================
   KŌSŌ — pages Carrelage, Salle de bain et Showroom
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const page = document.body.dataset.page;

  /* Marques de la page, dans l'ordre alphabétique, rangées par famille */
  const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  const cmp = (a, b) => norm(a.name).localeCompare(norm(b.name), 'fr', { numeric: true });
  const photos = b => (b.ph || []).map(p => ({ s: `b/${b.id}-${p.n}.jpg`, m: `b/s-${b.id}-${p.n}.jpg`, w: p.w || 2400, mw: p.mw || 1200, c: p.c }));
  D.photosOf = photos;

  if (D.groups && D.groups[page]) {
    const root = $('#brands'), jump = $('#jump');
    const mine = D.brands.filter(b => b.page === page).sort(cmp);
    let html = '', gi = 0;
    D.groups[page].forEach(g => {
      const list = mine.filter(b => b.group === g.id); if (!list.length) return;
      const withPh = list.filter(b => (b.ph || []).length), without = list.filter(b => !(b.ph || []).length);
      html += `<section class="bgroup" aria-labelledby="g-${gi}">
        <header class="bgroup-h"><h2 id="g-${gi}" class="sec-t">${esc(g.t)}</h2><p class="lede">${esc(g.l)}</p></header>`; gi++;
      withPh.forEach(b => {
        const P = photos(b);
        html += `<article class="bsec" id="${b.id}" aria-labelledby="h-${b.id}">
          <div class="bsec-h">
            <div><h3 id="h-${b.id}">${esc(b.name)}<span class="sq" aria-hidden="true"></span></h3><p class="label label--muted">${esc(b.place)}</p></div>
            <p class="copy">${esc(b.story)}</p>
            <p class="bsec-a"><a class="link" href="contact.html?marque=${b.id}">Voir au showroom <span class="arr">→</span></a></p>
          </div>
          <div class="pc pc-n${P.length}">${P.map((p, i) => `<figure class="pc-i${i === 0 && P.length % 2 ? ' pc-big' : ''} rv" data-d="${(i * .05).toFixed(2)}">
              <button type="button" class="m" data-b="${b.id}" data-i="${i}" aria-label="Agrandir : ${esc(b.name)} — ${esc(p.c)}"><img src="assets/img/${p.s}" srcset="assets/img/${p.m} ${p.mw}w, assets/img/${p.s} ${p.w}w" sizes="${i === 0 && P.length % 2 ? '(min-width:900px) 62vw, 100vw' : '(min-width:900px) 31vw, 50vw'}" alt="" loading="lazy" decoding="async"></button>
              <figcaption>${esc(p.c)}</figcaption></figure>`).join('')}</div>
        </article>`;
      });
      if (without.length) html += `<div class="also"><p class="label label--muted">Également au showroom</p><ul>${without.map(b => `<li id="${b.id}"><b>${esc(b.name)}</b><span class="label label--muted">${esc(b.place)}</span><span>${esc(b.story)}</span></li>`).join('')}</ul></div>`;
      html += '</section>';
    });
    root.innerHTML = html;
    const cx = $('#carreaux-grid');
    if (cx) cx.innerHTML = (D.carreaux || []).map((c, i) => `<figure class="cx rv" data-d="${(i % 4 * .05).toFixed(2)}">
        <div class="cx-m"><img src="assets/img/t/${esc(c.f)}" alt="Carreau ${esc(c.n)}, ${esc(D.brand(c.b).name)}" loading="lazy" decoding="async"></div>
        <figcaption><b>${esc(c.n)}</b><span class="label label--muted">${esc(D.brand(c.b).name)}</span></figcaption></figure>`).join('');
    jump.innerHTML = mine.map(b => `<a href="#${b.id}">${esc(b.name)}</a>`).join('');

    /* ——— Visionneuse ——— */
    const dlg = $('#lb'), img = $('#lb-img'), cap = $('#lb-cap'), cnt = $('#lb-n');
    let cur = { b: '', i: 0 }, opener = null;
    const show = () => {
      const B = D.brand(cur.b), P = photos(B), p = P[cur.i];
      img.src = 'assets/img/' + p.s; img.alt = `${B.name} — ${p.c}`;
      cap.textContent = `${B.name} — ${p.c}`;
      cnt.textContent = `${cur.i + 1} / ${P.length}`;
    };
    const step = d => { const n = photos(D.brand(cur.b)).length; cur.i = (cur.i + d + n) % n; show() };
    root.addEventListener('click', e => {
      const m = e.target.closest('.m'); if (!m) return;
      opener = m; cur = { b: m.dataset.b, i: +m.dataset.i }; show();
      dlg.showModal(); D.lenis && D.lenis.stop();
    });
    $('#lb-prev').addEventListener('click', () => step(-1));
    $('#lb-next').addEventListener('click', () => step(1));
    $('#lb-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close() });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1) });
    dlg.addEventListener('close', () => { D.lenis && D.lenis.start(); opener && opener.focus({ preventScroll: true }) });
  }

  /* ——— Showroom : photos déposées dans assets/img/showroom/ ——— */
  if (page === 'showroom') {
    const grid = $('#sr-photos'), N = 6;
    grid.innerHTML = Array.from({ length: N }, (_, i) => `<figure class="srp${i === 0 ? ' srp-big' : ''}" data-n="${i + 1}"><div class="srp-ph"><span class="todo">Photo du showroom à ajouter</span><small>assets/img/showroom/showroom-${i + 1}.jpg</small></div></figure>`).join('');
    $$('.srp', grid).forEach(f => {
      const im = new Image();
      im.onload = () => { im.alt = `Showroom Kōsō, vue ${f.dataset.n}`; f.innerHTML = ''; f.append(im) };
      im.src = `assets/img/showroom/showroom-${f.dataset.n}.jpg`;
    });
  }
})();
