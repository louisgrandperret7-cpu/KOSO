/* ==========================================================================
   KŌSŌ — Matériauthèque : filtres, fiche matière, échantillons
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const G = !!window.gsap && !D.reduced;

  const FAMS = [
    { id: 'clair', name: 'Blancs & clairs', c: '#ECE8E1', t: ['blanc', 'ivoire', 'gris clair'] },
    { id: 'beige', name: 'Beiges & grèges', c: '#CDBBA2', t: ['beige', 'sable', 'grège', 'miel'] },
    { id: 'taupe', name: 'Taupes', c: '#8E8073', t: ['taupe'] },
    { id: 'gris', name: 'Gris', c: '#9A9895', t: ['gris'] },
    { id: 'sombre', name: 'Gris foncés & noirs', c: '#3B3936', t: ['gris foncé', 'anthracite', 'noir'] },
    { id: 'terre', name: 'Terres & bruns', c: '#9A5B3F', t: ['brun', 'terre cuite', 'ocre', 'rouge'] },
    { id: 'couleur', name: 'Verts & bleus', c: '#3F6B66', t: ['vert', 'vert foncé', 'vert de gris', 'turquoise', 'bleu', 'bleu nuit'] }
  ];
  const famOf = t => (FAMS.find(f => f.t.includes(t.t)) || FAMS[3]).id;
  const ALL = D.textures.map(t => ({ ...t, fam: famOf(t), bn: D.brand(t.b)?.name || t.b, name: D.texName(t) }));
  const BIDS = [...new Set(ALL.map(t => t.b))];

  const st = { q: '', fam: new Set(), brand: new Set(), view: 'grid' };
  /* Filtres depuis l'adresse : ?marque=mutina&teinte=terre */
  const sp = new URLSearchParams(location.search);
  (sp.get('marque') || '').split(',').filter(b => BIDS.includes(b)).forEach(b => st.brand.add(b));
  (sp.get('teinte') || '').split(',').filter(f => FAMS.some(x => x.id === f)).forEach(f => st.fam.add(f));

  const famsEl = $('#fams'), brEl = $('#brands'), grid = $('#grid'), count = $('#count'), empty = $('#empty');
  famsEl.innerHTML = FAMS.map(f => `<button class="chip-f" type="button" data-fam="${f.id}" aria-pressed="${st.fam.has(f.id)}"><i style="background:${f.c}" aria-hidden="true"></i>${f.name}<sup>${ALL.filter(t => t.fam === f.id).length}</sup></button>`).join('');
  brEl.innerHTML = BIDS.map(b => `<button class="chip-f no-dot" type="button" data-brand="${b}" aria-pressed="${st.brand.has(b)}">${esc(D.brand(b)?.name || b)}<sup>${ALL.filter(t => t.b === b).length}</sup></button>`).join('');

  const PLUS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3v10M3 8h10"/></svg>';
  const CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const im = e.target; io.unobserve(im);
    im.src = im.dataset.src; im.onload = () => im.classList.remove('lz');
  }), { rootMargin: '400px 0px' }) : null;

  function filtered() {
    const q = st.q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return ALL.filter(t => (!st.fam.size || st.fam.has(t.fam)) && (!st.brand.size || st.brand.has(t.b)) &&
      (!q || `${t.name} ${t.bn} ${t.t}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)));
  }
  function render() {
    let L = filtered();
    if (st.view === 'dense') L = L.slice().sort((a, b) => FAMS.findIndex(f => f.id === a.fam) - FAMS.findIndex(f => f.id === b.fam) || lum(b.c) - lum(a.c));
    grid.classList.toggle('is-dense', st.view === 'dense');
    count.textContent = `${L.length} matière${L.length > 1 ? 's' : ''}`;
    empty.hidden = !!L.length;
    grid.innerHTML = L.map(t => `<div class="sw" data-f="${esc(t.f)}">
        <button class="sw-m" type="button" style="--c:${t.c}" aria-label="${esc(t.name)}, ${esc(t.bn)} — ouvrir la fiche">
          <img class="lz" data-src="assets/img/textures/${esc(t.f)}" alt="" width="390" height="390" decoding="async">
        </button>
        <button class="sw-add" type="button" aria-pressed="${D.samples.has(t.f)}" aria-label="${D.samples.has(t.f) ? 'Retirer' : 'Ajouter'} ${esc(t.name)} ${D.samples.has(t.f) ? 'des' : 'aux'} échantillons">${D.samples.has(t.f) ? CHECK : PLUS}</button>
        <div class="sw-b"><span class="sw-n">${esc(t.name)}</span><span class="sw-o">${esc(t.bn)} · ${esc(t.t)}</span></div>
      </div>`).join('');
    $$('img.lz', grid).forEach(im => io ? io.observe(im) : (im.src = im.dataset.src, im.classList.remove('lz')));
    if (G) gsap.from($$('.sw', grid).slice(0, 24), { opacity: 0, y: 16, duration: .6, ease: 'expo.out', stagger: .02 });
    const p = new URLSearchParams();
    if (st.brand.size) p.set('marque', [...st.brand].join(','));
    if (st.fam.size) p.set('teinte', [...st.fam].join(','));
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
    window.ScrollTrigger && ScrollTrigger.refresh();
  }
  const lum = h => parseInt(h.slice(1, 3), 16) * .3 + parseInt(h.slice(3, 5), 16) * .59 + parseInt(h.slice(5, 7), 16) * .11;

  const toggleSet = (set, v, btn) => { set.has(v) ? set.delete(v) : set.add(v); btn.setAttribute('aria-pressed', String(set.has(v))); render() };
  famsEl.addEventListener('click', e => { const b = e.target.closest('[data-fam]'); b && toggleSet(st.fam, b.dataset.fam, b) });
  brEl.addEventListener('click', e => { const b = e.target.closest('[data-brand]'); b && toggleSet(st.brand, b.dataset.brand, b) });
  let qt; $('#q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value; render() }, 120) });
  $$('[data-view]').forEach(b => b.addEventListener('click', () => { st.view = b.dataset.view; $$('[data-view]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); render() }));
  $('#reset').addEventListener('click', () => { st.fam.clear(); st.brand.clear(); st.q = ''; $('#q').value = ''; $$('.chip-f').forEach(c => c.setAttribute('aria-pressed', 'false')); render() });

  grid.addEventListener('click', e => {
    const sw = e.target.closest('.sw'); if (!sw) return;
    if (e.target.closest('.sw-add')) D.samples.toggle(sw.dataset.f);
    else if (e.target.closest('.sw-m')) open(sw.dataset.f, e.target.closest('.sw-m'));
  });

  /* ——— Fiche matière ——— */
  const dlg = $('#dlg'), din = $('#dlg-in');
  din.setAttribute('data-lenis-prevent', '');
  let opener = null;
  function open(f, from) {
    const t = ALL.find(x => x.f === f); if (!t) return;
    opener = from || opener;
    const rel = ALL.filter(x => x.f !== f && (x.b === t.b ? x.fam === t.fam : false)).slice(0, 8);
    const rel2 = rel.length < 4 ? rel.concat(ALL.filter(x => x.f !== f && x.fam === t.fam && x.b !== t.b).slice(0, 8 - rel.length)) : rel;
    const fam = FAMS.find(x => x.id === t.fam);
    const on = D.samples.has(f);
    din.innerHTML = `<button class="dlg-close" type="button" aria-label="Fermer la fiche">${D.ICON_X}</button>
      <div class="dlg-grid">
        <div class="dlg-media" style="--c:${t.c}"><img src="assets/img/textures/${esc(t.f)}" alt="${esc(t.name)} — ${esc(t.bn)}"></div>
        <div class="dlg-body">
          <p class="label label--muted">${esc(t.bn)} · ${esc(D.brand(t.b)?.origin || '')}</p>
          <h2 id="dlg-t" class="display h-3">${esc(t.name)}<span class="sq" aria-hidden="true"></span></h2>
          <p class="copy">${esc(D.brand(t.b)?.line || '')}</p>
          <dl class="dl">
            <dt>Teinte</dt><dd><span class="swatch-color"><i style="background:${t.c}" aria-hidden="true"></i>${esc(t.t)} · <span class="label label--muted" style="font-size:11px">${t.c}</span></span></dd>
            <dt>Famille</dt><dd>${esc(fam.name)}</dd>
            <dt>Maison</dt><dd><a href="carrelage.html#${t.b}" style="text-decoration:underline;text-underline-offset:3px">${esc(t.bn)}</a></dd>
            <dt>Formats</dt><dd>Sur demande au showroom</dd>
          </dl>
          <div class="dlg-acts">
            <button class="btn btn--solid" type="button" data-add aria-pressed="${on}">${on ? 'Dans vos échantillons' : 'Ajouter aux échantillons'} <span class="sq" aria-hidden="true"></span></button>
            <a class="btn" href="contact.html?type=echantillon">Parler de ce projet</a>
          </div>
          ${rel2.length ? `<div><p class="label label--muted" style="margin-bottom:12px">Dans le même esprit</p><div class="dlg-rel">${rel2.slice(0, 8).map(r => `<button type="button" data-open="${esc(r.f)}" aria-label="${esc(r.name)}, ${esc(r.bn)}" style="background:${r.c}"><img src="assets/img/textures/${esc(r.f)}" alt="" loading="lazy"></button>`).join('')}</div></div>` : ''}
        </div>
      </div>`;
    if (!dlg.open) { dlg.showModal(); D.lenis && D.lenis.stop() }
    din.scrollTop = 0;
    $('.dlg-close', din).focus();
    history.replaceState(null, '', location.pathname + location.search + '#' + encodeURIComponent(f));
  }
  const close = () => dlg.close();
  dlg.addEventListener('close', () => { D.lenis && D.lenis.start(); history.replaceState(null, '', location.pathname + location.search); opener && opener.focus({ preventScroll: true }) });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.dlg-close')) return close();
    const o = e.target.closest('[data-open]'); if (o) return open(o.dataset.open);
    const a = e.target.closest('[data-add]');
    if (a) { const f = decodeURIComponent(location.hash.slice(1)); const on = D.samples.toggle(f); a.setAttribute('aria-pressed', String(on)); a.firstChild.textContent = on ? 'Dans vos échantillons ' : 'Ajouter aux échantillons ' }
  });

  /* ——— Panier d'échantillons ——— */
  const tray = $('#tray'), tl = $('#tray-list'), tn = $('#tray-n');
  function syncTray() {
    const L = D.samples.list();
    tray.classList.toggle('is-on', !!L.length);
    tn.textContent = `${L.length}/${D.samples.MAX} échantillon${L.length > 1 ? 's' : ''}`;
    tl.innerHTML = L.map(f => { const t = ALL.find(x => x.f === f); return `<button type="button" data-rm="${esc(f)}" aria-label="Retirer ${esc(t.name)}" style="background:${t.c}"><img src="assets/img/textures/${esc(f)}" alt=""></button>` }).join('');
    $$('.sw', grid).forEach(sw => { const b = $('.sw-add', sw), on = D.samples.has(sw.dataset.f), n = $('.sw-n', sw).textContent; b.setAttribute('aria-pressed', String(on)); b.innerHTML = on ? CHECK : PLUS; b.setAttribute('aria-label', `${on ? 'Retirer' : 'Ajouter'} ${n} ${on ? 'des' : 'aux'} échantillons`) });
  }
  tl.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); b && D.samples.toggle(b.dataset.rm) });
  document.addEventListener('samples', syncTray);

  render(); syncTray();
  if (location.hash.length > 1) { const f = decodeURIComponent(location.hash.slice(1)); if (ALL.some(t => t.f === f)) setTimeout(() => open(f), 300) }
})();
