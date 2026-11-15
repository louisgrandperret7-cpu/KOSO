/* ==========================================================================
   KŌSŌ — Marques : filtre par univers, fiche maison avec galerie et matières
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const G = !!window.gsap && !D.reduced;
  const fil = $('#bfilter'), grid = $('#bgrid'), cnt = $('#bcount');
  let u = new URLSearchParams(location.search).get('u');
  if (!D.univers.some(x => x.id === u)) u = '';

  fil.innerHTML = `<button class="tab" type="button" data-u="" aria-pressed="${!u}">Toutes · ${D.brands.length}</button>` +
    D.univers.map(x => `<button class="tab" type="button" data-u="${x.id}" aria-pressed="${u === x.id}">${esc(x.short)} · ${D.brands.filter(b => b.univers.includes(x.id)).length}</button>`).join('');

  const texOf = id => D.textures.filter(t => t.b === id);
  function card(b) {
    const g = D.gallery[b.id] || [];
    const media = g.length
      ? g.slice(0, 2).map((x, i) => `<img src="assets/img/g/s-${x.f}" alt="${i ? '' : esc(b.name + ' — ' + x.c)}" loading="lazy" decoding="async">`).join('')
      : `<div class="bmono"><span class="sq" aria-hidden="true"></span><b>${esc(b.name)}</b><span class="label label--muted">${esc(b.origin)}</span></div>`;
    const n = texOf(b.id).length;
    return `<button class="bcard rv" type="button" data-b="${b.id}" id="${b.id}" aria-label="${esc(b.name)} — voir la fiche">
      <span class="bcard-m">${media}</span>
      <span class="bcard-h"><h2>${esc(b.name)}</h2><span class="label label--muted">${esc(b.origin)}</span></span>
      <p>${esc(b.line)}</p>
      <span class="label" style="color:var(--signal-ink)">${b.univers.map(x => D.univers.find(y => y.id === x).short).join(' · ')}${n ? ` · ${n} matières` : ''}</span>
    </button>`;
  }
  function render() {
    const L = D.brands.filter(b => !u || b.univers.includes(u));
    grid.innerHTML = L.map(card).join('');
    cnt.textContent = u ? `${D.univers.find(x => x.id === u).name} — ${D.univers.find(x => x.id === u).line}` : '';
    $$('.tab', fil).forEach(t => t.setAttribute('aria-pressed', String(t.dataset.u === u)));
    history.replaceState(null, '', location.pathname + (u ? '?u=' + u : '') + location.hash);
    D.reveal(grid);
    window.ScrollTrigger && ScrollTrigger.refresh();
  }
  fil.addEventListener('click', e => { const t = e.target.closest('.tab'); if (!t) return; u = t.dataset.u; render() });
  grid.addEventListener('click', e => { const c = e.target.closest('.bcard'); c && open(c.dataset.b, c) });

  const dlg = $('#dlg'), din = $('#dlg-in');
  din.setAttribute('data-lenis-prevent', '');
  let opener = null;
  function open(id, from) {
    const b = D.brand(id); if (!b) return;
    opener = from || document.getElementById(id);
    const g = D.gallery[id] || [], tx = texOf(id);
    const sibs = D.brands.filter(x => x.id !== id && x.univers.some(y => b.univers.includes(y))).slice(0, 6);
    din.innerHTML = `<button class="dlg-close" type="button" aria-label="Fermer la fiche">${D.ICON_X}</button>
      <div class="dlg-grid">
        <div class="dlg-media">${g.length
          ? `<div class="bgal">${g.map((x, i) => `<figure>${D.pic(x.f, `${b.name} — ${x.c}`, i ? '30vw' : '60vw')}<figcaption>${esc(x.c)}</figcaption></figure>`).join('')}</div>`
          : `<div class="bmono" style="position:relative;min-height:320px;height:100%"><span class="sq" aria-hidden="true"></span><b>${esc(b.name)}</b></div>`}</div>
        <div class="dlg-body">
          <p class="label label--muted">${esc(b.origin)} · ${b.univers.map(x => esc(D.univers.find(y => y.id === x).name)).join(' · ')}</p>
          <h2 id="dlg-t" class="display h-3">${esc(b.name)}<span class="sq" aria-hidden="true"></span></h2>
          <p class="lede">${esc(b.line)}</p>
          ${tx.length ? `<div><p class="label label--muted" style="margin-bottom:12px">${tx.length} matières dans la matériauthèque</p>
            <div class="dlg-rel">${tx.slice(0, 8).map(t => `<a href="materiautheque.html?marque=${id}#${encodeURIComponent(t.f)}" style="display:block;aspect-ratio:1;overflow:hidden;background:${t.c}" aria-label="${esc(D.texName(t))}"><img src="assets/img/textures/${esc(t.f)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></a>`).join('')}</div>
            <p style="margin-top:14px"><a class="link" href="materiautheque.html?marque=${id}">Toutes les matières ${esc(b.name)} <span class="arr">→</span></a></p></div>` : ''}
          <div class="dlg-acts"><a class="btn btn--solid" href="contact.html?marque=${id}">Voir ${esc(b.name)} au showroom <span class="sq" aria-hidden="true"></span></a></div>
          ${sibs.length ? `<div><p class="label label--muted" style="margin-bottom:8px">Dans le même univers</p><p style="display:flex;flex-wrap:wrap;gap:6px">${sibs.map(s => `<button class="tab" type="button" data-sib="${s.id}">${esc(s.name)}</button>`).join('')}</p></div>` : ''}
        </div>
      </div>`;
    if (!dlg.open) { dlg.showModal(); D.lenis && D.lenis.stop() }
    din.scrollTop = 0; $('.dlg-close', din).focus();
    history.replaceState(null, '', location.pathname + location.search + '#' + id);
  }
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.dlg-close')) return dlg.close();
    const s = e.target.closest('[data-sib]'); if (s) open(s.dataset.sib);
  });
  dlg.addEventListener('close', () => { D.lenis && D.lenis.start(); history.replaceState(null, '', location.pathname + location.search); opener && opener.focus({ preventScroll: true }) });

  render();
  const h = location.hash.slice(1);
  if (h && D.brand(h)) setTimeout(() => open(h), 300);
})();
