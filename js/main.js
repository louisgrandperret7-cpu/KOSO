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
    address: '104 rue Saint-Dizier',
    city: '54000 Nancy',
    phone: '[Téléphone]',
    phoneHref: '',                 // ex. '+33300000000'
    email: '[Adresse e-mail]',
    emailHref: '',                 // ex. 'contact@koso.fr' : active l'envoi du formulaire
    instagram: '[Compte Instagram]',
    instagramHref: '',
    /* Réseaux affichés dans le héros : [nom, icône Phosphor, lien] */
    socials: [['Instagram', 'instagram', ''], ['Facebook', 'facebook', ''], ['Pinterest', 'pinterest', '']],
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
    `<img src="assets/img/g/${f}" srcset="assets/img/g/s-${f} 1200w, assets/img/g/${f} 2880w" sizes="${sizes}" alt="${D.esc(alt)}" loading="lazy" decoding="async" ${extra}>`;
  D.brand = id => (D.brands || []).find(b => b.id === id);

  const ph = v => /^\[.*\]$/.test(v) ? `<span class="todo">${D.esc(v)}</span>` : D.esc(v);
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
    ['carrelage.html', 'Carrelage', 'carrelage', 'Sols & murs'],
    ['salle-de-bain.html', 'Salle de bain', 'bain', 'Meubles, douches, baignoires'],
    ['showroom.html', 'Showroom', 'showroom', 'Horaires & adresse'],
    ['contact.html', 'Contact', 'contact', 'Votre projet']
  ];
  /* Icônes dessinées dans la page (aucune bibliothèque externe) */
  const ic = (d, fill) => `<svg viewBox="0 0 24 24" width="1em" height="1em" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${d}</svg>`;
  D.SVG = {
    instagram: ic('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>'),
    facebook: ic('<path d="M13.6 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.6 1.6-1.6h1.7V3.9a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.5v3.2h2.7v8h3.4z"/>', true),
    pinterest: ic('<path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.18-5s-.3-.6-.3-1.49c0-1.4.81-2.44 1.82-2.44.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.88 3.15-4.59 0-2.4-1.73-4.08-4.19-4.08-2.85 0-4.53 2.14-4.53 4.35 0 .86.33 1.79.75 2.29.08.1.09.19.07.29l-.28 1.14c-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.3-6.06 6.62-6.06 3.47 0 6.17 2.47 6.17 5.78 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.25 2.62A10 10 0 1 0 12 2z"/>', true),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowUp: ic('<path d="M7 17L17 7M8 7h9v9"/>'),
    calendar: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    pause: ic('<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>', true),
    play: ic('<path d="M7 4.5v15l12.5-7.5z"/>', true),
    pin: ic('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    phone: ic('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    left: ic('<path d="M15 5l-7 7 7 7"/>'),
    right: ic('<path d="M9 5l7 7-7 7"/>')
  };
  /* [data-ic="nom"] dans le HTML reçoit l'icône correspondante */
  const fillIcons = (root = document) => root.querySelectorAll('[data-ic]').forEach(el => { el.innerHTML = D.SVG[el.dataset.ic] || ''; el.setAttribute('aria-hidden', 'true') });
  D.fillIcons = fillIcons;
  const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  D.ICON_X = X;

  const CTX = { accueil: "L'art du carreau", carrelage: 'Carrelage', bain: 'Salle de bain', showroom: 'Le showroom', contact: 'Contact' };
  const hdr = document.createElement('header');
  hdr.className = 'hdr';
  hdr.innerHTML = `<div class="hdr-in">
    <a class="logo" href="index.html" aria-label="Kōsō, accueil">Kōsō<span class="sq" aria-hidden="true"></span></a>
    <nav class="nav" aria-label="Navigation principale">${NAV.map(([h, l, id]) => `<a href="${h}"${page === id ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="hdr-r">
      <a class="hdr-ic" href="showroom.html" aria-label="Adresse du showroom">${D.SVG.pin}</a>
      <a class="hdr-ic" href="contact.html" aria-label="Nous contacter">${D.SVG.phone}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><i aria-hidden="true"></i></button>
    </div></div>`;
  /* Bandeau à cases, collant en haut de l'écran (comme sur les sites de céramistes italiens) */
  const bar = document.createElement('div');
  bar.className = 'subbar';
  bar.innerHTML = `<a class="subbar-t" href="${page === 'accueil' ? 'carrelage.html' : 'index.html'}">${CTX[page] || 'Kōsō'}</a>
    <a class="subbar-c" href="contact.html?type=rdv">Prendre rendez-vous</a>
    <a class="subbar-c" href="showroom.html">Horaires &amp; adresse</a>`;
  const menu = document.createElement('div');
  menu.className = 'menu'; menu.id = 'menu';
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = `<nav aria-label="Menu mobile">${[['index.html', 'Accueil', 'accueil'], ...NAV].map(([h, l, id]) => `<a href="${h}"${page === id ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="menu-foot"><span>${ph(D.SITE.address)}</span><span>${ph(D.SITE.city)}</span><span>${ph(D.SITE.phone)}</span></div>`;
  document.body.prepend(menu);
  document.body.prepend(bar);
  document.body.prepend(hdr);
  const skip = document.createElement('a'); skip.className = 'skip'; skip.href = '#main'; skip.textContent = 'Aller au contenu';
  document.body.prepend(skip);

  const foot = document.createElement('footer');
  foot.className = 'foot';
  const soc = D.SITE.socials.map(([n, icn, h]) => `<a href="${h || '#'}" aria-label="${n}"${h ? ' rel="noopener" target="_blank"' : ''}>${D.SVG[icn]}</a>`).join('');
  foot.innerHTML = `<div class="foot-in">
    <a class="foot-logo" href="index.html" aria-label="Kōsō, accueil">Kōsō<span class="sq" aria-hidden="true"></span></a>
    <div class="foot-col"><p class="foot-h"><span class="ko">Kōsō</span></p><ul><li><a href="index.html">Accueil</a></li>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>
    <div class="foot-col"><p class="foot-h">Showroom</p><ul><li>${ph(D.SITE.address)}</li><li>${ph(D.SITE.city)}</li><li><a href="showroom.html">Horaires</a></li></ul></div>
    <div class="foot-col"><p class="foot-h">Contact</p><ul>
      <li>${D.SITE.phoneHref ? `<a href="tel:${D.SITE.phoneHref}">${D.esc(D.SITE.phone)}</a>` : ph(D.SITE.phone)}</li>
      <li>${D.SITE.emailHref ? `<a href="mailto:${D.SITE.emailHref}">${D.esc(D.SITE.email)}</a>` : ph(D.SITE.email)}</li></ul></div>
    <div class="foot-col foot-soc"><p class="foot-h">Suivez-nous</p><div class="socials">${soc}</div></div>
  </div>
  <div class="foot-base"><span>© ${new Date().getFullYear()} <span class="ko">Kōsō</span> — L'art du carreau</span><span>Carrelage · Pierre · Parquet · Salle de bain</span></div>`;
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

  /* ——— Menu mobile ——— */
  const mbtn = D.$('.menu-btn', hdr);
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    hdr.classList.toggle('menu-on', open);
    mbtn.setAttribute('aria-expanded', String(open));
    mbtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
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

  const onScroll = () => {};

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
    fillIcons();
    D.reveal();
    addEventListener('load', () => hasG && ScrollTrigger.refresh());
  });
})();
