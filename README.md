# Kōsō — site v2

Site statique (HTML, CSS, JavaScript, sans build) du magasin Kōsō : carrelage, pierre, parquet, salle de bain, robinetterie.

## Pages
- `index.html` — accueil : héros « carreau par carreau », manifeste, univers, la maison (8 pièces), salle de bain, finitions, matières, accords, marques, showroom
- `materiautheque.html` — 306 matières filtrables par teinte et par maison, fiche matière, sélection d'échantillons (8 max)
- `marques.html` — 28 maisons par univers, fiche avec galerie et matières
- `contact.html` — formulaire de projet (reprend les échantillons choisis)

## À compléter
Coordonnées, horaires et e-mail : un seul endroit, `D.SITE` en haut de `js/main.js`.
Tant que `emailHref` est vide, les champs s'affichent en rouge hachuré et le formulaire n'ouvre pas de messagerie.

## Images
`assets/img/` reprend toutes les images de la première version : galeries de marques (`g/`, avec versions légères `s-`), 306 textures (`textures/`), rendus de la maison (`tour/`).
Données associées : `js/data.js`.

## Lancer en local
```
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000

## Autre
`portfolio/` — héros de portfolio autonome (« Creative Designer & Developer »), indépendant du site Kōsō.
