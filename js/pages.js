/* ==========================================================================
   KŌSŌ — pages Carrelage, Salle de bain et Showroom
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const page = document.body.dataset.page;

  /* Groupes de marques par page */
  const GROUPS = {
    carrelage: [
      { t: 'Carrelage & céramique', l: "Grès cérame, faïence, zelliges et céramique d'auteur, pour les sols et les murs.", ids: ['mirage', 'mutina', '41zero42', 'fap', 'sant-agostino', 'wow', 'cerasarda', 'living-ceramics', '950', 'botteganove', 'sodai'] },
      { t: 'Pierre, terre cuite & mosaïque', l: 'Pierre naturelle, terre cuite faite main, marbre et mosaïque taillée.', ids: ['cotto-zero', 'fragmenti', 'friul-mosaic', 'la-pietra-compattata', 'lithea'] }
    ],
    bain: [
      { t: 'Meubles & vasques', l: 'Meubles suspendus ou posés, plans, vasques et miroirs.', ids: ['noorth', 'ideagroup', 'cielo'] },
      { t: 'Baignoires, receveurs & parois de douche', l: "Baignoires îlots, receveurs extra-plats et parois à l'italienne.", ids: ['disenia', 'vismara'] },
      { t: 'Robinetterie & douches', l: 'Mitigeurs, colonnes, pluies de tête et thermostatiques.', ids: ['fantini', 'ritmonio'] },
      { t: 'Radiateurs & sèche-serviettes', l: 'Le chauffage traité comme un objet de la pièce.', ids: ['irsap', 'antrax'] }
    ]
  };

  /* Photos d'une marque : la sélection (5 max) ou sa galerie */
  const photos = id => (D.picks && D.picks[id]) || (D.gallery[id] || []).map(g => ({ s: 'g/' + g.f, m: 'g/s-' + g.f, c: g.c })).slice(0, 5);
  const LAYOUT = { 5: ['big', '', '', '', ''], 4: ['big', 'wide', '', ''], 3: ['big', 'wide', 'wide'], 2: ['big', 'big'], 1: ['full'] };

  if (GROUPS[page]) {
    const root = $('#brands'), jump = $('#jump');
    const all = [];
    let html = '';
    GROUPS[page].forEach(g => {
      const withPh = g.ids.filter(id => photos(id).length), without = g.ids.filter(id => !photos(id).length);
      html += `<section class="bgroup" aria-labelledby="g-${all.length}">
        <header class="bgroup-h"><h2 id="g-${all.length}" class="display h-2">${esc(g.t)}</h2><p class="lede">${esc(g.l)}</p></header>`;
      withPh.forEach(id => {
        const b = D.brand(id), P = photos(id), L = LAYOUT[P.length];
        all.push(id);
        html += `<article class="bsec" id="${id}" aria-labelledby="h-${id}">
          <div class="bsec-h">
            <div><h3 id="h-${id}">${esc(b.name)}<span class="sq" aria-hidden="true"></span></h3><p class="label label--muted">${esc(b.origin)}</p></div>
            <p class="copy">${esc(b.line)}</p>
            <p class="bsec-a"><a class="link" href="contact.html?marque=${id}">Voir au showroom <span class="arr">→</span></a></p>
          </div>
          <div class="mosaic">${P.map((p, i) => `<button type="button" class="m ${L[i] ? 'm-' + L[i] : ''} rv" data-d="${(i * .05).toFixed(2)}" data-b="${id}" data-i="${i}" aria-label="Agrandir : ${esc(b.name)} — ${esc(p.c)}">
              <img src="assets/img/${i === 0 || L[i] ? p.s : p.m}" ${p.s.startsWith('g/') ? `srcset="assets/img/${p.m} 800w, assets/img/${p.s} 1345w" sizes="${i === 0 ? '(min-width:900px) 50vw, 100vw' : '(min-width:900px) 25vw, 50vw'}"` : ''} alt="" loading="lazy" decoding="async">
              <span class="m-c">${esc(p.c)}</span></button>`).join('')}</div>
        </article>`;
      });
      if (without.length) html += `<div class="also"><p class="label label--muted">Également au showroom</p><ul>${without.map(id => { const b = D.brand(id); all.push(id); return `<li id="${id}"><b>${esc(b.name)}</b><span class="label label--muted">${esc(b.origin)}</span><span>${esc(b.line)}</span></li>` }).join('')}</ul></div>`;
      html += '</section>';
    });
    root.innerHTML = html;
    const cx = $('#carreaux-grid');
    if (cx) cx.innerHTML = D.carreaux.map((c, i) => `<figure class="cx rv" data-d="${(i % 4 * .05).toFixed(2)}">
        <div class="cx-m"><img src="assets/img/textures/${esc(c.f)}" alt="Carreau ${esc(c.n)}, ${esc(D.brand(c.b).name)}" loading="lazy" decoding="async"></div>
        <figcaption><b>${esc(c.n)}</b><span class="label label--muted">${esc(D.brand(c.b).name)}</span></figcaption></figure>`).join('');
    jump.innerHTML = all.map(id => `<a class="chip-f no-dot" href="#${id}">${esc(D.brand(id).name)}</a>`).join('');

    /* ——— Visionneuse ——— */
    const dlg = $('#lb'), img = $('#lb-img'), cap = $('#lb-cap'), cnt = $('#lb-n');
    let cur = { b: '', i: 0 }, opener = null;
    const show = () => {
      const P = photos(cur.b), p = P[cur.i];
      img.src = 'assets/img/' + p.s; img.alt = `${D.brand(cur.b).name} — ${p.c}`;
      cap.textContent = `${D.brand(cur.b).name} — ${p.c}`;
      cnt.textContent = `${cur.i + 1} / ${P.length}`;
    };
    const step = d => { const n = photos(cur.b).length; cur.i = (cur.i + d + n) % n; show() };
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
