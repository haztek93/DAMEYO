# DAMEYO — Site Vitrine

Site vitrine pour le fast-food **Dameyo** — 34 Bd de Nesles, 77420 Champs-sur-Marne.

---

## Structure du projet

```
dameyo/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   ├── style.css         → Composants principaux (variables, navbar, hero, sections)
│   │   ├── animations.css    → Keyframes et classes .reveal
│   │   └── responsive.css    → Media queries (1024 / 768 / 480 / 1400px)
│   │
│   ├── js/
│   │   ├── navbar.js         → Scroll, burger mobile, lien actif
│   │   ├── animations.js     → Scroll reveal + slide desktop après vidéo
│   │   └── main.js           → Onglets menu, smooth scroll, année footer
│   │
│   └── images/
│       ├── logo/
│       │   ├── logo.png
│       │   └── logo_transparent.png  ← utilisé dans le site
│       ├── hero/
│       │   ├── hero.mp4              ← vidéo d'accueil (10s, 1920×1080)
│       │   └── hero.jpg              ← fallback si vidéo non supportée
│       ├── menu/
│       │   ├── burgers1.png
│       │   ├── burgers2.png
│       │   ├── sandwichs.png
│       │   ├── salades.png
│       │   ├── fingers.jpg
│       │   └── desserts.jpg
│       └── offers/
│           ├── offre1.png
│           └── offre2.png
│
└── README.md
```

---

## Charte graphique

| Élément     | Valeur      |
|-------------|-------------|
| Noir        | `#111111`   |
| Sombre      | `#1a1a1a`   |
| Or / Accent | `#F5A623`   |
| Vert        | `#8DC63F`   |
| Font titres | Bebas Neue  |
| Font corps  | Barlow      |

---

## Comportement du Hero

### Desktop (> 768px)
1. Vidéo plein écran tourne **1 fois** (10 secondes)
2. Le track glisse automatiquement → slide "Le Goût Qui Claque"
3. Le texte, le badge Halal et le bouton s'animent en séquence

### Mobile (≤ 768px)
- Vidéo en haut (40vh) + texte + badge Halal en bas
- Tout visible d'emblée, aucune transition
- Adapté à tous les formats portrait

---

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Vidéo + slide animé "Le Goût Qui Claque" + badge Halal |
| 2 | Intro | 3 blocs (Burgers, Finger Foods, Desserts) |
| 3 | Menu | 5 onglets : Burgers / Sandwichs / Salades / Finger Foods / Desserts |
| 4 | Offres | Affiches promotionnelles |
| 5 | Avis Google | 3 avis manuels + lien vers Google Maps |
| 6 | Contact | Adresse, horaires, téléphone, réseaux + carte Google Maps |
| 7 | Footer | Logo, copyright, liens |

---

## Personnalisations

### Mettre à jour Google Maps
1. Allez sur **maps.google.com** → cherchez votre adresse
2. Cliquez **Partager** › **Intégrer une carte**
3. Copiez le `src` de l'iframe
4. Remplacez le `src` dans `index.html` (section `#contact`)

### Liens réseaux sociaux
Dans `index.html`, section `#contact` :
```html
<a href="https://instagram.com/VOTRE_COMPTE" class="social-btn">Instagram</a>
<a href="https://facebook.com/VOTRE_PAGE"    class="social-btn">Facebook</a>
```

### Avis Google
Les avis sont intégrés manuellement dans `index.html`.
Pour des avis en temps réel : Google Places API ou widget Elfsight (~5€/mois).

---

## Mise en production

Le site est **100 % statique** — aucune dépendance serveur.
Déposez simplement le dossier sur votre hébergeur (OVH, Infomaniak, o2switch…).
