# Kōsō — site du showroom

Site statique (HTML, CSS, JavaScript, sans outil de build) du showroom Kōsō, 104 rue Saint-Dizier, 54000 Nancy : carrelage, parquet, salle de bain.

## Pages
- `index.html` : diaporama de photos, bandeau de définition qui défile, présentation, liste des marques de A à Z
- `carrelage.html` : sélection de carreaux, puis chaque marque avec son origine en deux lignes et 5 photos (agrandissement au clic)
- `salle-de-bain.html` : meubles, baignoires, receveurs, parois de douche, robinetterie, radiateurs
- `showroom.html` : photos, adresse et horaires
- `contact.html` : formulaire de projet

## Marques
La liste vient de la liste manuscrite du magasin. Tout est dans `js/data.js` (généré), une entrée par marque : nom, famille, lieu, origine en deux lignes, photos.
Les origines sont rédigées à partir des sites officiels des marques. Les marques dont le site n'était pas accessible (Cotto Zero, La Pietra Compattata, Listone Giordano, Orac Decor, Sōdai) reprennent les informations de la première version du site.

## Photos
`assets/img/b/` : photos des marques, `<marque>-<n>.jpg` (grande) et `s-<marque>-<n>.jpg` (mobile). `assets/img/t/` : carreaux de la sélection.
Les photos viennent des sites et catalogues des marques ; les plus petites ont été agrandies par IA (Real-ESRGAN).

## Photos du showroom
Déposer les photos dans `assets/img/showroom/` sous les noms `showroom-1.jpg` à `showroom-6.jpg` (la 1 est la grande). Elles remplacent automatiquement les emplacements.

## À compléter
Téléphone, e-mail, horaires et liens des réseaux sociaux : un seul endroit, `D.SITE` en haut de `js/main.js`.
Tant que `emailHref` est vide, les champs s'affichent en rouge hachuré et le formulaire n'ouvre pas de messagerie.

## Lancer en local
```
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000
