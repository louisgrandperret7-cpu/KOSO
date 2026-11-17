# Kōsō — site v2

Site statique (HTML, CSS, JavaScript, sans build) du magasin Kōsō : carrelage, pierre, parquet, salle de bain, robinetterie.

## Pages
- `index.html` — accueil : héros en diaporama, présentation et chiffres clés
- `carrelage.html` — les marques de carrelage, pierre et mosaïque, 5 photos par marque (visionneuse au clic)
- `salle-de-bain.html` — meubles, vasques, baignoires, receveurs, parois, robinetterie, sèche-serviettes
- `showroom.html` — photos, adresse et horaires
- `contact.html` — formulaire de projet

## Photos du showroom
Déposer les photos dans `assets/img/showroom/` sous les noms `showroom-1.jpg` à `showroom-6.jpg` (la 1 est la grande). Elles remplacent automatiquement les emplacements.

## À compléter
Coordonnées, horaires et e-mail : un seul endroit, `D.SITE` en haut de `js/main.js`.
Tant que `emailHref` est vide, les champs s'affichent en rouge hachuré et le formulaire n'ouvre pas de messagerie.

## Images
`assets/img/` reprend toutes les images de la première version : galeries de marques (`g/`, avec versions légères `s-`), textures et carreaux (`textures/`).
Données associées : `js/data.js`.

## Lancer en local
```
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000
