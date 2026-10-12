# DashboardPersonnel

DashboardPersonnel est un tableau de bord quotidien interactif regroupant l’ensemble de mes informations et outils essentiels : la météo locale en direct, la gestion des tâches quotidiennes, l'agenda intelligent avec catégorisation automatique, les raccourcis vers mes sites fréquemment utilisés, et le suivi en temps réel des Canadiens de Montréal. Le projet combine un frontend dynamique, des services proxy serverless et une persistance locale pour offrir une expérience rapide, fluide et structurée au quotidien.

## Aperçu du projet

DashboardPersonnel est une application web dynamique composée d’un **frontend HTML/CSS/JavaScript** qui interroge des API externes et s'appuie sur une infrastructure légère par **Cloudflare Workers**.

Le projet inclut :
- une vue d'ensemble quotidienne centralisée (météo, agenda intelligent, To-Do list, raccourcis),
- un module complet d'informations et statistiques sur les Canadiens de Montréal,
- un système de gestion de tâches et de liens personnalisables sauvegardés localement,
- un déploiement complet sur GitHub Pages.

---

## Fonctionnalités principales

### 🔹 Fonctionnalités du MVP

- **Météo en direct** : affichage rapide de la température, du ressenti, des précipitations et du vent pour Montréal.
- **Gestionnaire de tâches** : ajout, suppression, édition via menu contextuel et calcul de la progression quotidienne avec sauvegarde automatique (`localStorage`).
- **Agenda intelligent (iCal)** : récupération des événements via un Cloudflare Worker, avec détection automatique et intelligente des catégories (Cours, Examens, Labs, Sport, Perso) grâce à des expressions régulières (Regex) et des badges visuels personnalisés avec bordure violette.
- **Prochain match des Canadiens** : suivi du match à venir avec logo des équipes, compte à rebours et détails de la rencontre.
- **Raccourcis rapides** : grille de liens vers les sites fréquemment utilisés.
- **Design responsive et adapté au mobile** : mise en page fluide à colonne unique optimisée pour une lecture claire et ergonomique sur smartphone, tout en s'adaptant aux écrans de bureau.
- **Déploiement complet sur GitHub Pages**, accessible publiquement.

### 🔹 Fonctionnalités techniques

- Persistance des données utilisateur (tâches, liens) via l'API Web Storage (`localStorage`).
- Intégration d'un **Cloudflare Worker** agissant comme proxy sécurisé pour le flux iCal (`.ics`) de Google Calendar.
- Gestion des erreurs et replis visuels en cas de problème réseau avec les API.
- Code structuré par modules (architecture propre séparant la logique des widgets et le rendu).

---

## Technologies utilisées

| Catégorie | Technologies |
|---|---|
| **Frontend** | HTML, CSS (Media Queries, Flexbox, Grid), JavaScript (Modules ES6) |
| **Parsing & Données** | `ical.js` (flux iCal) |
| **APIs & Backend** | Open-Meteo API, NHL Official API, Cloudflare Workers |
| **Stockage** | Web Storage API (`localStorage`) |
| **Déploiement** | GitHub Pages |
| **Outils** | Git, GitHub, Markdown |

---

## Structure du projet

```plaintext
DashboardPerso/
│
├── index.html
├── assets/
│   ├── icon/
│   └── icons.js
├── css/
│   ├── general.css
│   ├── layout/
│   │   ├── grid.css
│   │   └── header.css
│   └── components/
│       ├── card.css
│       ├── weather.css
│       ├── calendar.css
│       ├── tasks.css
│       ├── canadiens.css
│       └── links.css
├── design/
│   ├── Model_Desktop.png
│   └── Model_Mobile.png
├── js/
│   ├── app.js
│   └── modules/
│       ├── header.js
│       ├── weather.js
│       ├── calendar.js
│       ├── tasks.js
│       ├── canadiens.js
│       └── links.js
│
└── README.md
```

##  Liens importants

| Type               | Lien                                                                 |
|--------------------|----------------------------------------------------------------------|
| **Site déployé**   | [https://thanthan77.github.io/dashboardPersonel/](https://thanthan77.github.io/dashboardPersonel/)           |
| **Repository GitHub** | [https://github.com/Thanthan77/dashboardPersonel](https://github.com/Thanthan77/dashboardPersonel) |



