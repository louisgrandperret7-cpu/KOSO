/* ==========================================================================
   KŌSŌ — socle commun : coordonnées, en-tête, menu, pied de page,
   défilement doux, révélations au scroll, échantillons.
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO || (window.KOSO = {});
  const doc = document.documentElement;
  doc.classList.remove('no-js');

  /* ——— Coordonnées : à compléter ici, une seule fois ——— */
  D.SITE = {
    address: '[Adresse du showroom]',
    city: '[Code postal, Ville]',
    phone: '[Téléphone]',
    phoneHref: '',                 // ex. '+33300000000'
    email: '[Adresse e-mail]',
    emailHref: '',                 // ex. 'contact@koso.fr' : active l'envoi du formulaire
    instagram: '[Compte Instagram]',
    instagramHref: '',
    hours: [['Lundi', '[Horaires]'], ['Mardi — Vendredi', '[Horaires]'], ['Samedi', '[Horaires]'], ['Dimanche', 'Fermé']]
  };

  const mm = q => { try { return matchMedia(q).matches } catch (e) { return false } };
  D.reduced = mm('(prefers-reduced-motion: reduce)');
  if (D.reduced) doc.classList.add('reduced');
  D.touch = mm('(hover: none)');
  D.$ = (s, r = document) => r.querySelector(s);
  D.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  D.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  D.img = (dir, f) => `assets/img/${dir}/${f}`;
  /* Photo de marque avec version légère pour mobile */
  D.pic = (f, alt, sizes = '100vw', extra = '') =>
    `<img src="assets/img/g/${f}" srcset="assets/img/g/s-${f} 800w, assets/img/g/${f} 1345w" sizes="${sizes}" alt="${D.esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
  D.brand = id => (D.brands || []).find(b => b.id === id);

  const ph = v => /^\[.*\]$/.test(v) ? `<span class="ph">${D.esc(v)}</span>` : D.esc(v);
  D.ph = ph;

  /* ——— Échantillons (mémorisés sur cet appareil) ——— */
  const KEY = 'koso.samples';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch (e) { return [] } };
  let samples = read().filter(f => (D.textures || []).some(t => t.f === f));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(samples)) } catch (e) {} ; document.dispatchEvent(new CustomEvent('samples')) };
  D.samples = {
    MAX: 8,
    list: () => samples.slice(),
    has: f => samples.includes(f),
    toggle(f) {
      if (samples.includes(f)) samples = samples.filter(x => x !== f);
      else { if (samples.length >= this.MAX) { D.toast(`${this.MAX} échantillons maximum par demande`); return false } samples.push(f) }
      save(); return samples.includes(f);
    },
    clear() { samples = []; save() }
  };
  D.tex = f => (D.textures || []).find(t => t.f === f);
  D.texName = t => t.n || (t.b === 'mirage' ? 'Glocal ' + t.t : t.t);

  /* ——— Gabarits partagés ——— */
  const page = document.body.dataset.page || '';
  const NAV = [
    ['materiautheque.html', 'Matériauthèque', 'materiautheque', '306 matières'],
    ['marques.html', 'Marques', 'marques', '28 maisons'],
    ['index.html#maison', 'La maison', 'maison', 'Visite'],
    ['index.html#salle-de-bain', 'Salle de bain', 'bain', 'Ambiances'],
    ['index.html#showroom', 'Showroom', 'showroom', 'Venir']
  ];
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  D.ICON_X = X;

  const hdr = document.createElement('header');
  hdr.className = 'hdr';
  hdr.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html" aria-label="Kōsō, accueil">KŌSŌ<span class="sq" aria-hidden="true"></span><small aria-hidden="true">構想</small></a>
    <nav class="nav" aria-label="Navigation principale">${NAV.map(([h, l, id]) => `<a href="${h}"${page === id ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="hdr-r">
      <a class="tray-btn" href="contact.html#echantillons" hidden><span>Échantillons</span><b data-count>0</b></a>
      <a class="btn btn--sm" href="contact.html"${page === 'contact' ? ' aria-current="page"' : ''}>Votre projet <span class="sq" aria-hidden="true"></span></a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><i aria-hidden="true"></i><span>Menu</span></button>
    </div></div>`;
  const menu = document.createElement('div');
  menu.className = 'menu'; menu.id = 'menu';
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = `<nav aria-label="Menu mobile">${[['index.html', 'Accueil', 'accueil', 'Kōsō'], ...NAV, ['contact.html', 'Contact', 'contact', 'Votre projet']].map(([h, l, id, n]) => `<a href="${h}"${page === id ? ' aria-current="page"' : ''}>${l}<span>${n}</span></a>`).join('')}</nav>
    <div class="menu-foot"><span class="label" style="color:var(--bone)">Showroom</span><span>${ph(D.SITE.address)}</span><span>${ph(D.SITE.city)}</span><span>${ph(D.SITE.phone)}</span></div>`;
  document.body.prepend(menu);
  document.body.prepend(hdr);
  const skip = document.createElement('a'); skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Aller au contenu';
  document.body.prepend(skip);

  const foot = document.createElement('footer');
  foot.className = 'foot';
  foot.innerHTML = `<div class="wrap">
    <div class="foot-top">
      <p class="foot-lead">Toucher la matière <em>avant</em> de choisir.</p>
      <div class="foot-cols">
        <div><span class="label">Showroom</span><ul><li>${ph(D.SITE.address)}</li><li>${ph(D.SITE.city)}</li><li><a href="index.html#showroom">Horaires &amp; accès</a></li></ul></div>
        <div><span class="label">Contact</span><ul>
          <li>${D.SITE.phoneHref ? `<a href="tel:${D.SITE.phoneHref}">${D.esc(D.SITE.phone)}</a>` : ph(D.SITE.phone)}</li>
          <li>${D.SITE.emailHref ? `<a href="mailto:${D.SITE.emailHref}">${D.esc(D.SITE.email)}</a>` : ph(D.SITE.email)}</li>
          <li>${D.SITE.instagramHref ? `<a href="${D.SITE.instagramHref}" rel="noopener">${D.esc(D.SITE.instagram)}</a>` : ph(D.SITE.instagram)}</li></ul></div>
        <div><span class="label">Explorer</span><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="contact.html">Contact</a></li></ul></div>
      </div>
    </div>
    <div class="foot-wm" aria-hidden="true">KŌSŌ<span class="sq"></span></div>
    <div class="foot-base"><span>© ${new Date().getFullYear()} Kōsō — L'art de la matière</span><span>Carrelage · Pierre · Parquet · Bain · Robinetterie</span><span>構想 — la conception d'une vision</span></div>
  </div>`;
  document.body.append(foot);

  /* Champs [data-site] dans les pages */
  D.$$('[data-site]').forEach(el => {
    const k = el.dataset.site;
    if (k === 'hours') el.innerHTML = D.SITE.hours.map(([d, h]) => `<span>${d}</span><span>${ph(h)}</span>`).join('');
    else el.innerHTML = ph(D.SITE[k] || '');
  });

  /* ——— Petit message ——— */
  let toastEl;
  D.toast = msg => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);transform:translateX(-50%);z-index:300;background:var(--ink);color:var(--bone);padding:12px 18px;font-size:14px;max-width:calc(100% - 32px);opacity:0;transition:opacity .3s;pointer-events:none';
      document.body.append(toastEl);
    }
    toastEl.textContent = msg; toastEl.style.opacity = '1';
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.style.opacity = '0', 2600);
  };

  /* ——— Compteur d'échantillons dans l'en-tête ——— */
  const trayBtn = D.$('.tray-btn', hdr);
  const syncCount = () => { const n = samples.length; trayBtn.hidden = !n; D.$('[data-count]', trayBtn).textContent = n; trayBtn.setAttribute('aria-label', `${n} échantillon${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`) };
  document.addEventListener('samples', syncCount); syncCount();

  /* ——— Menu mobile ——— */
  const mbtn = D.$('.menu-btn', hdr);
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    hdr.classList.toggle('menu-on', open);
    mbtn.setAttribute('aria-expanded', String(open));
    D.$('span', mbtn).textContent = open ? 'Fermer' : 'Menu';
    document.body.classList.toggle('is-locked', open);
    if (D.lenis) open ? D.lenis.stop() : D.lenis.start();
    if (open) setTimeout(() => D.$('a', menu).focus(), 300); else mbtn.focus({ preventScroll: true });
  };
  mbtn.addEventListener('click', () => setMenu(mbtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false) });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    if (e.key === 'Tab' && menu.classList.contains('is-open')) {
      const f = [mbtn, ...D.$$('a', menu)]; const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
    }
  });

  /* ——— En-tête : transparent sur héros sombre, masqué en descendant ——— */
  const over = document.body.dataset.hdr === 'over';
  let lastY = 0;
  const onScroll = y => {
    const heroH = over ? (D.$('[data-hero]')?.offsetHeight || innerHeight) - 80 : 40;
    hdr.classList.toggle('is-over', over && y < heroH);
    hdr.classList.toggle('is-solid', y >= heroH);
    const hide = y > lastY && y > 400 && !menu.classList.contains('is-open');
    hdr.classList.toggle('is-hidden', hide);
    doc.classList.toggle('hdr-hidden', hide);
    lastY = y;
  };
  onScroll(scrollY);

  /* ——— Défilement doux + GSAP ——— */
  const hasG = !!(window.gsap && window.ScrollTrigger);
  if (hasG) gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !D.reduced && !D.touch) {
    D.lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    D.lenis.on('scroll', ({ scroll }) => { onScroll(scroll); hasG && ScrollTrigger.update() });
    if (hasG) { gsap.ticker.add(t => D.lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0) }
    else { const raf = t => { D.lenis.raf(t); requestAnimationFrame(raf) }; requestAnimationFrame(raf) }
    /* ancres internes */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href*="#"]'); if (!a) return;
      const u = new URL(a.href, location.href);
      if (u.pathname !== location.pathname || !u.hash || u.hash === '#') return;
      const t = document.getElementById(decodeURIComponent(u.hash.slice(1))); if (!t) return;
      e.preventDefault(); D.lenis.scrollTo(t, { offset: -70 }); history.replaceState(null, '', u.hash);
    });
  } else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  /* Découpe en mots pour les titres [data-split] */
  D.split = el => {
    if (el.dataset.done) return D.$$('.w>span', el);
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.append(' '); return }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = p; w.append(i); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('sq')) walk(n);
      });
    };
    walk(el); el.dataset.done = '1';
    return D.$$('.w>span', el);
  };

  D.reveal = (root = document) => {
    if (!hasG || D.reduced) { D.$$('.rv,.img-rv', root).forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; e.style.clipPath = 'none' }); return }
    D.$$('[data-split]:not([data-done])', root).forEach(el => {
      const ws = D.split(el);
      gsap.from(ws, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    D.$$('.rv:not([data-rv])', root).forEach(el => {
      el.dataset.rv = 1;
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: (+el.dataset.d || 0), scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    D.$$('.img-rv:not([data-rv])', root).forEach(el => {
      el.dataset.rv = 1;
      const im = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' });
      if (im) tl.from(im, { scale: 1.25, duration: 1.8, ease: 'expo.out' }, 0);
    });
    D.$$('[data-par]', root).forEach(el => {
      const v = +el.dataset.par || 10;
      gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  };

  /* Les pages appellent KOSO.ready(fn) une fois les gabarits en place */
  D.ready = fn => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());
  D.ready(() => {
    D.reveal();
    addEventListener('load', () => hasG && ScrollTrigger.refresh());
  });
})();
