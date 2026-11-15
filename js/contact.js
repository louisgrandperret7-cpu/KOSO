/* ==========================================================================
   KŌSŌ — Contact : type de projet, échantillons, validation, envoi
   L'envoi ouvre la messagerie du visiteur (mailto) vers KOSO.SITE.emailHref.
   Pour un envoi direct, brancher ici un service de formulaire (Formspree…).
   ========================================================================== */
(function () {
  'use strict';
  const D = window.KOSO, $ = D.$, $$ = D.$$, esc = D.esc;
  const TYPES = ['Rénovation', 'Construction neuve', 'Salle de bain', 'Cuisine', 'Extérieur & terrasse', 'Rendez-vous au showroom', 'Demande d’échantillons', 'Professionnel / architecte'];
  const PRESET = { rdv: 'Rendez-vous au showroom', sdb: 'Salle de bain', echantillon: 'Demande d’échantillons' };
  const sp = new URLSearchParams(location.search);
  const chosen = new Set();
  if (PRESET[sp.get('type')]) chosen.add(PRESET[sp.get('type')]);
  if (D.samples.list().length) chosen.add(PRESET.echantillon);

  const msg = $('#msg');
  const amb = (D.ambiances || []).find(a => a.id === sp.get('ambiance'));
  const br = D.brand(sp.get('marque') || '');
  if (amb) msg.value = `Je souhaite créer une salle de bain dans l'esprit « ${amb.name} ».\n`;
  if (br) msg.value = `Je souhaite voir la maison ${br.name} au showroom.\n`;

  const types = $('#types');
  types.innerHTML = TYPES.map(t => `<button class="pill" type="button" aria-pressed="${chosen.has(t)}">${esc(t)}</button>`).join('');
  types.addEventListener('click', e => {
    const b = e.target.closest('.pill'); if (!b) return;
    const t = b.textContent; chosen.has(t) ? chosen.delete(t) : chosen.add(t);
    b.setAttribute('aria-pressed', String(chosen.has(t))); setErr('type', '');
  });

  const sEl = $('#samples'), sHelp = $('#samples-help');
  const syncS = () => {
    const L = D.samples.list().map(D.tex).filter(Boolean);
    sEl.innerHTML = L.map(t => `<span><img src="assets/img/textures/${esc(t.f)}" alt="">${esc(D.texName(t))} · ${esc(D.brand(t.b)?.name || '')}<button type="button" data-rm="${esc(t.f)}" aria-label="Retirer ${esc(D.texName(t))}" style="margin-left:4px;font-size:18px;line-height:1;padding:0 4px">×</button></span>`).join('');
    sHelp.innerHTML = L.length ? `${L.length}/${D.samples.MAX} — <a class="link" href="materiautheque.html">en ajouter</a>` : `Aucun pour l'instant. <a class="link" href="materiautheque.html">Choisir dans la matériauthèque <span class="arr">→</span></a>`;
  };
  sEl.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); b && D.samples.toggle(b.dataset.rm) });
  document.addEventListener('samples', syncS); syncS();

  function setErr(id, text) {
    const el = $('#' + id + '-err'); if (!el) return;
    el.hidden = !text; el.textContent = text;
    const f = el.closest('.f'); f && f.classList.toggle('is-bad', !!text);
    const inp = $('#' + id); inp && inp.setAttribute('aria-invalid', String(!!text));
  }
  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Indiquez votre nom.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Vérifiez l’adresse e-mail (ex. nom@domaine.fr).'
  };
  Object.keys(rules).forEach(k => $('#' + k).addEventListener('blur', e => e.target.value && setErr(k, rules[k](e.target.value))));
  Object.keys(rules).forEach(k => $('#' + k).addEventListener('input', e => $('#' + k + '-err').hidden || setErr(k, rules[k](e.target.value))));

  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const errs = [];
    if (!chosen.size) { setErr('type', 'Choisissez au moins un type de projet.'); errs.push(types.querySelector('.pill')) }
    Object.keys(rules).forEach(k => { const m = rules[k]($('#' + k).value); setErr(k, m); m && errs.push($('#' + k)) });
    const rg = $('#rgpd'); setErr('rgpd', rg.checked ? '' : 'Merci d’accepter pour que nous puissions vous répondre.'); rg.checked || errs.push(rg);
    if (errs.length) { errs[0].focus(); return }

    const S = D.samples.list().map(D.tex).filter(Boolean);
    const body = [
      `Projet : ${[...chosen].join(', ')}`,
      `Nom : ${$('#name').value}`, `E-mail : ${$('#email').value}`, `Téléphone : ${$('#tel').value || '—'}`,
      `Ville : ${$('#ville').value || '—'}`, `Budget : ${$('#budget').value}`,
      S.length ? `Échantillons :\n${S.map(t => `  – ${D.texName(t)} (${D.brand(t.b)?.name})`).join('\n')}` : '',
      '', $('#msg').value
    ].filter(x => x !== '').join('\n');
    const to = D.SITE.emailHref;
    if (to) location.href = `mailto:${to}?subject=${encodeURIComponent('Projet Kōsō — ' + $('#name').value)}&body=${encodeURIComponent(body)}`;
    const form = $('#form');
    form.innerHTML = `<div class="form-done" role="status" tabindex="-1">
      <p class="label" style="color:var(--signal-ink)">Demande prête</p>
      <p class="display h-2">Merci, ${esc($('#name').value.split(' ')[0])}.</p>
      <p class="lede">${to ? 'Votre messagerie s’ouvre avec la demande pré-remplie : il ne reste qu’à l’envoyer. Nous revenons vers vous sous 48 h ouvrées.' : 'Nous revenons vers vous sous 48 h ouvrées.'}</p>
      ${to ? '' : '<p class="todo" style="white-space:normal;display:inline-block">Envoi à configurer : renseignez emailHref dans js/main.js (ou branchez un service de formulaire dans js/contact.js).</p>'}
      <p><a class="btn" href="index.html">Retour à l’accueil</a></p></div>`;
    $('.form-done', form).focus();
  });
})();
