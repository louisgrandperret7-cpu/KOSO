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
     1. Héros : l'image se pose carreau par carreau
     —————————————————————————————————————————————— */
  const SLIDES = ['mirage-1.jpg', 'listone-giordano-2.jpg', 'fap-2.jpg', 'wow-1.jpg', 'mirage-3.jpg'];
  const tilesEl = $('#tiles'), capEl = $('#hero-cap'), progEl = $('#hero-prog'), pauseBtn = $('#hero-pause');
  const preload = {};
  const src = f => `assets/img/g/${small() ? 's-' : ''}${f}`;
  const load = f => preload[f] || (preload[f] = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src(f) }));
  let tiles = [], cur = 0, timer = null, paused = D.reduced, dims = null;

  progEl.innerHTML = SLIDES.map(() => '<span><i></i></span>').join('');
  const bars = $$('i', progEl);

  function build() {
    const W = tilesEl.clientWidth, H = tilesEl.clientHeight;
    const size = W < 760 ? 74 : W < 1200 ? 110 : 132;
    const cols = Math.max(4, Math.round(W / size)), rows = Math.max(5, Math.round(H / size));
    tilesEl.style.setProperty('--cols', cols); tilesEl.style.setProperty('--rows', rows);
    tilesEl.style.setProperty('--joint', '2px');
    tilesEl.innerHTML = '<div class="tile"></div>'.repeat(cols * rows);
    tiles = $$('.tile', tilesEl).map((el, k) => ({ el, c: k % cols, r: Math.floor(k / cols) }));
    dims = { W, H, cols, rows };
    paint(SLIDES[cur], true);
  }
  function geo(img) {
    const { W, H } = dims, s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    return { bw: img.naturalWidth * s, bh: img.naturalHeight * s, ox: (img.naturalWidth * s - W) / 2, oy: (img.naturalHeight * s - H) / 2 };
  }
  function layer(t, f, g) {
    const i = document.createElement('i');
    i.style.backgroundImage = `url("${src(f)}")`;
    i.style.setProperty('--bw', g.bw + 'px'); i.style.setProperty('--bh', g.bh + 'px');
    i.style.backgroundPosition = `${-(t.el.offsetLeft + g.ox)}px ${-(t.el.offsetTop + g.oy)}px`;
    t.el.append(i); return i;
  }
  async function paint(f, instant) {
    const img = await load(f); if (!img) return;
    const g = geo(img);
    const layers = tiles.map(t => layer(t, f, g));
    capEl.textContent = cap(f);
    if (instant || !G) { tiles.forEach(t => { while (t.el.children.length > 1) t.el.firstChild.remove() }); return }
    const { cols, rows } = dims, cx = (cols - 1) / 2, cy = (rows - 1) / 2;
    const order = tiles.map(t => Math.hypot(t.c - cx, (t.r - cy) * 1.2) + Math.random() * .9);
    const mx = Math.max(...order);
    gsap.fromTo(layers, { opacity: 0, scale: .4, rotate: () => (Math.random() - .5) * 20 }, {
      opacity: 1, scale: 1, rotate: 0, duration: .9, ease: 'expo.out',
      delay: i => order[i] / mx * 1.1,
      onComplete() { tiles.forEach(t => { while (t.el.children.length > 1) t.el.firstChild.remove() }) }
    });
  }
  function go(n) {
    cur = (n + SLIDES.length) % SLIDES.length;
    paint(SLIDES[cur]);
    load(SLIDES[(cur + 1) % SLIDES.length]);
    tick();
  }
  function tick() {
    clearTimeout(timer);
    bars.forEach((b, i) => { b.style.transition = 'none'; b.style.transform = `scaleX(${i < cur ? 1 : 0})` });
    if (paused) return;
    const b = bars[cur]; void b.offsetWidth;
    b.style.transition = 'transform 6.5s linear'; b.style.transform = 'scaleX(1)';
    timer = setTimeout(() => go(cur + 1), 6500);
  }
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-label', paused ? 'Relancer le diaporama' : 'Mettre le diaporama en pause');
    pauseBtn.innerHTML = paused
      ? '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>'
      : '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.2" height="12"/><rect x="9.8" y="2" width="3.2" height="12"/></svg>';
    tick();
  });
  if (D.reduced) { paused = false; pauseBtn.click() } // mouvement réduit : diaporama à l'arrêt
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else tick() });

  build();
  let rw = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - rw) < 40) return; rw = innerWidth; clearTimeout(build._t); build._t = setTimeout(build, 200) });

  /* Entrée : les mots du titre montent, puis le diaporama démarre */
  const title = $('[data-hero-title]');
  if (G) {
    const ws = D.split(title);
    const tl = gsap.timeline({ delay: .2 });
    tl.from(tiles.map(t => t.el), { opacity: 0, scale: .6, duration: 1, ease: 'expo.out', stagger: { each: .006, from: 'center', grid: [dims.rows, dims.cols] } })
      .from(ws, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: .07 }, .45)
      .from('.hero-in .lede, .hero-in .label, .hero-ctas .btn, .hero-meta .wrap > *', { opacity: 0, y: 18, duration: .9, ease: 'expo.out', stagger: .06 }, .8)
      .add(tick, 1.2);
    /* Au scroll, les joints s'ouvrent : le carrelage se « décolle » */
    gsap.to(tilesEl, { '--joint': '14px', scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-in .wrap', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
  } else tick();
  load(SLIDES[1]);

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

  /* ——————————————————————————————————————————————
     3. Univers : liste + image qui suit le curseur
     —————————————————————————————————————————————— */
  const UIMG = { ceramique: 'mutina-2.jpg', mineral: 'cotto-zero-1.jpg', parquet: 'listone-giordano-2.jpg', murs: 'orac-1.jpg', bain: 'cielo-2.jpg', robinetterie: 'fantini-4.jpg', chauffage: 'irsap-2.jpg' };
  const uni = $('#uni-list'), flt = $('#uni-float');
  uni.innerHTML = D.univers.map((u, i) => {
    const n = D.brands.filter(b => b.univers.includes(u.id)).length;
    return `<a class="uni-row rv" href="marques.html?u=${u.id}" data-u="${u.id}">
      <span class="idx">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(u.name)}</h3>
      <p>${esc(u.line)}</p>
      <span class="arr" aria-hidden="true">→</span>
      <span class="uni-thumb">${D.pic(UIMG[u.id], u.name, '90vw')}</span>
      <span class="sr">${n} marques</span></a>`;
  }).join('');
  flt.innerHTML = D.univers.map(u => `<img src="assets/img/g/s-${UIMG[u.id]}" alt="" data-u="${u.id}">`).join('');
  if (!D.touch) {
    let fx = 0, fy = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => { fx += (tx - fx) * .14; fy += (ty - fy) * .14; flt.style.transform = `translate(${fx}px,${fy}px)`; raf = requestAnimationFrame(loop) };
    uni.addEventListener('pointermove', e => { const r = flt.getBoundingClientRect(); tx = e.clientX + 28; ty = e.clientY - r.height / 2; if (tx + r.width > innerWidth) tx = e.clientX - r.width - 28 });
    uni.addEventListener('pointerover', e => {
      const row = e.target.closest('.uni-row'); if (!row) return;
      $$('img', flt).forEach(i => i.classList.toggle('is-on', i.dataset.u === row.dataset.u));
      flt.style.opacity = ''; flt.classList.add('is-on');
      if (!raf) { fx = tx; fy = ty; loop() }
    });
    uni.addEventListener('pointerleave', () => { flt.classList.remove('is-on'); cancelAnimationFrame(raf); raf = 0 });
    flt.style.transform = 'translate(-999px,-999px)';
  }

  /* ——————————————————————————————————————————————
     4. La maison : pièces en défilement horizontal
     —————————————————————————————————————————————— */
  const track = $('#house-track');
  track.innerHTML = D.house.map((r, i) => `
    <article class="room" aria-label="${esc(r.name)}">
      <div class="room-m">
        <img src="assets/img/tour/${r.id}.jpg" srcset="assets/img/tour/s-${r.id}.jpg 960w, assets/img/tour/${r.id}.jpg 1600w" sizes="(min-width:1200px) 1100px, 86vw" alt="Rendu de la maison Kōsō : ${esc(r.name.toLowerCase())}" loading="lazy" decoding="async">
        <span class="room-n label"><span class="idx" style="color:inherit">${String(i + 1).padStart(2, '0')}/${String(D.house.length).padStart(2, '0')}</span> ${esc(r.name)}</span>
      </div>
      <div class="room-b">
        <div><h3>${esc(r.title)}</h3>${r.line ? `<p style="margin-top:10px">${esc(r.line)}</p>` : '<p style="margin-top:10px">Chaque matière de cette maison est disponible au showroom.</p>'}</div>
        <ul class="spots">${r.spots.map(s => `<li class="spot"><span class="label">${esc(s.k)}</span><b>${esc(s.n)}</b><span style="font-size:13px;color:#A79E93">${esc(s.s)}</span></li>`).join('')}</ul>
      </div>
    </article>`).join('');
  const house = $('#maison');
  if (G) {
    const mmq = gsap.matchMedia();
    mmq.add('(min-width: 900px)', () => {
      house.classList.add('is-pinned');
      const dist = () => track.scrollWidth - innerWidth;
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: house, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => $('#house-bar').style.transform = `scaleX(${s.progress})` } });
      $$('.room-m img', track).forEach(im => gsap.to(im, { scale: 1, xPercent: -3, ease: 'none', scrollTrigger: { trigger: im.closest('.room'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
      return () => { house.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'x' }) };
    });
  } else $$('.room-m img', track).forEach(im => im.style.transform = 'none');

  /* ——————————————————————————————————————————————
     5. Salle de bain : ambiances
     —————————————————————————————————————————————— */
  const ambM = $('#amb-media'), ambT = $('#amb-tabs'), ambP = $('#amb-panel');
  ambM.innerHTML = D.ambiances.map((a, i) => D.pic(a.img, `Ambiance ${a.name} — ${cap(a.img)}`, '(min-width:1000px) 55vw, 100vw', i ? '' : 'class="is-on"')).join('');
  ambT.innerHTML = D.ambiances.map((a, i) => `<button class="tab" role="tab" id="amb-${a.id}" aria-selected="${!i}" tabindex="${i ? -1 : 0}" aria-controls="amb-panel">${esc(a.name)}</button>`).join('');
  const setAmb = i => {
    const a = D.ambiances[i];
    $$('.tab', ambT).forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1 });
    $$('img', ambM).forEach((im, j) => im.classList.toggle('is-on', i === j));
    ambP.setAttribute('aria-labelledby', 'amb-' + a.id);
    ambP.innerHTML = `<h3>${esc(a.name)}<span class="sq" aria-hidden="true"></span></h3><p class="lede">${esc(a.line)}</p>
      <dl class="dl">${a.items.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <p class="label label--muted">Photo : ${esc(cap(a.img))}</p>
      <p style="display:flex;flex-wrap:wrap;gap:10px"><a class="btn btn--solid" href="contact.html?type=sdb&amp;ambiance=${a.id}">Créer cette salle de bain <span class="sq" aria-hidden="true"></span></a><a class="link" href="marques.html#${a.brand}">${esc(D.brand(a.brand)?.name || '')} <span class="arr">→</span></a></p>`;
    if (G) gsap.from(ambP.children, { opacity: 0, y: 14, duration: .6, ease: 'expo.out', stagger: .04 });
  };
  ambT.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) setAmb($$('.tab', ambT).indexOf(b)) });
  ambT.addEventListener('keydown', e => {
    const bs = $$('.tab', ambT), i = bs.indexOf(document.activeElement); if (i < 0) return;
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : null;
    if (n === null) return; e.preventDefault(); const k = (n + bs.length) % bs.length; bs[k].focus(); setAmb(k);
  });
  setAmb(0);

  /* ——————————————————————————————————————————————
     6. Robinetterie : finitions
     —————————————————————————————————————————————— */
  const finM = $('#fin-media'), finL = $('#fin-list');
  finM.innerHTML = D.finishes.map((f, i) => D.pic(f.img, `Finition ${f.name} — ${f.ref}`, '(min-width:900px) 45vw, 100vw', i ? '' : 'class="is-on"')).join('');
  finL.innerHTML = D.finishes.map((f, i) => `<button class="fin-item" type="button" aria-pressed="${!i}">
      <span class="chip" style="--a:${f.css[0]};--b:${f.css[1]};--c:${f.css[2]}" aria-hidden="true"></span>
      <span><h3>${esc(f.name)}</h3><p>${esc(f.line)}</p></span>
      <span class="label">${esc(f.ref.split(' — ')[0])}</span></button>`).join('');
  finL.addEventListener('click', e => {
    const b = e.target.closest('.fin-item'); if (!b) return;
    const i = $$('.fin-item', finL).indexOf(b);
    $$('.fin-item', finL).forEach((x, j) => x.setAttribute('aria-pressed', String(i === j)));
    $$('img', finM).forEach((im, j) => im.classList.toggle('is-on', i === j));
  });

  /* ——————————————————————————————————————————————
     7. Matériauthèque : deux bandeaux de matières
     —————————————————————————————————————————————— */
  const mq = $('#mq');
  const pick = (k, n) => { const a = D.textures.filter((_, i) => i % 3 === k); for (let i = a.length - 1; i > 0; i--) { const j = (i * 7919 + k * 31) % (i + 1);[a[i], a[j]] = [a[j], a[i]] } return a.slice(0, n) };
  const row = list => `<div class="mq-row">${[...list, ...list].map((t, i) => `<a class="mq-cell" href="materiautheque.html#${encodeURIComponent(t.f)}" ${i >= list.length ? 'aria-hidden="true" tabindex="-1"' : ''} style="background:${t.c}"><img src="assets/img/textures/${t.f}" alt="${esc(D.texName(t))}, ${esc(D.brand(t.b)?.name || '')}" loading="lazy" decoding="async"><span>${esc(D.texName(t))}</span></a>`).join('')}</div>`;
  mq.innerHTML = row(pick(0, 18)) + row(pick(1, 18));
  if (G) {
    const rows = $$('.mq-row', mq), pos = [0, 0], dir = [-1, 1];
    let vel = 0, hover = false;
    mq.addEventListener('pointerenter', () => hover = true); mq.addEventListener('pointerleave', () => hover = false);
    ScrollTrigger.create({ trigger: mq, start: 'top bottom', end: 'bottom top', onUpdate: s => vel = Math.min(Math.abs(s.getVelocity()) / 220, 14) });
    gsap.ticker.add((t, dt) => {
      vel *= .92;
      rows.forEach((r, i) => {
        const half = r.scrollWidth / 2; if (!half) return;
        pos[i] += dir[i] * (hover ? .15 : (.5 + vel)) * dt / 16;
        if (pos[i] <= -half) pos[i] += half; if (pos[i] > 0) pos[i] -= half;
        r.style.transform = `translate3d(${pos[i]}px,0,0)`;
      });
    });
  }

  /* ——————————————————————————————————————————————
     8. Accords
     —————————————————————————————————————————————— */
  $('#acc').innerHTML = D.accords.map(a => `
    <article class="acc-card rv">
      <div class="acc-comp">
        ${a.imgs.map(f => `<figure>${D.pic(f, cap(f), '(min-width:800px) 30vw, 60vw')}</figure>`).join('')}
        <div class="acc-chips" aria-hidden="true">${a.colors.map(c => `<i style="background:${c}"></i>`).join('')}</div>
      </div>
      <div class="acc-h"><h3>${esc(a.name)}</h3><span class="label label--muted">${a.formats.map(esc).join(' · ')}</span></div>
      <p>${esc(a.line)}</p>
      <p class="label label--muted">${a.brands.map(b => `<a href="marques.html#${b}" style="text-decoration:underline;text-underline-offset:3px">${esc(D.brand(b)?.name || b)}</a>`).join(' · ')}</p>
    </article>`).join('');

  /* ——————————————————————————————————————————————
     9. Marques & showroom
     —————————————————————————————————————————————— */
  $('#brandwall').innerHTML = D.brands.map(b => `<a href="marques.html#${b.id}">${esc(b.name)}<span>${esc(b.origin.split(',').pop().trim())}</span></a>`).join('');
  $('#spaces').innerHTML = D.showroom.spaces.map((s, i) => `<div class="space rv" data-d="${i * .06}"><span class="idx">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.line)}</p></div>`).join('');
  $('#steps').innerHTML = D.showroom.steps.map((s, i) => `<div class="step rv"><span class="idx">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.name)}</h3><p>${esc(s.line)}</p></div>`).join('');
})();
