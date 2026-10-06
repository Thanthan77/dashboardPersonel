# DashboardPersonnel  

DashboardPersonnel est un tableau de bord quotidien interactif regroupant l’ensemble de mes informations et outils essentiels : la météo locale en direct, la gestion des tâches quotidiennes, l'agenda de la journée, les raccourcis vers mes sites fréquemment utilisés, et le suivi en temps réel des Canadiens de Montréal. Le projet combine un frontend dynamique et une persistance locale pour offrir une expérience rapide, fluide et structurée au quotidien.

## Aperçu du projet

DashboardPersonnel est une application web dynamique composée d’un **frontend HTML/CSS/JavaScript** qui interroge des API externes (Open-Meteo, NHL) et utilise le stockage local (`localStorage`).

Le projet inclut :
- une vue d'ensemble quotidienne centralisée (météo, agenda, To-Do list, raccourcis),
- un module complet d'informations et statistiques sur les Canadiens de Montréal,
- un système de gestion de tâches et de liens personnalisables sauvegardés localement,
- un déploiement complet sur GitHub Pages.

---

## Fonctionnalités principales  

### 🔹 Fonctionnalités du MVP  

- **Météo en direct** : affichage rapide de la température, du ressenti, des précipitations et du vent pour Montréal.
- **Gestionnaire de tâches** : ajout, coche/décoche, suppression et calcul de la progression quotidienne avec sauvegarde automatique.
- **Événements de la journée** : affichage des cours et rendez-vous prévus pour la journée.
- **Prochain match des Canadiens** : suivi du match à venir avec logo des équipes, compte à rebours et détails de la rencontre.
- **Raccourcis rapides** : grille de liens vers les sites fréquemment utilisés (GitHub, Moodle, Teams, etc.).
- **Interface simple, rapide et responsive** : adaptée à une utilisation quotidienne sur desktop et mobile.
- **Déploiement complet sur GitHub Pages**, accessible publiquement.

### 🔹 Fonctionnalités techniques  

- Persistance des données utilisateur (tâches, liens) via `localStorage`.
- Gestion des erreurs et replis visuels en cas de problème réseau avec les API.
- Code structuré par modules pour faciliter l’évolution du projet.  

---

## Technologies utilisées

| Catégorie | Technologies |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **APIs Externes** | Open-Meteo API, NHL Official API |
| **Stockage** | Web Storage API (`localStorage`) |
| **Déploiement** | GitHub Pages |
| **Outils** | Git, GitHub, Markdown |

---

## Structure du projet

```plaintext
DashboardPerso/
│
├── index.html
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
└── js/
    ├── app.js
    └── modules/
        ├── header.js
        ├── weather.js
        ├── calendar.js
        ├── tasks.js
        ├── canadiens.js
        └── links.js
│
└── README.md
```
##  Liens importants

| Type               | Lien                                                                 |
|--------------------|----------------------------------------------------------------------|
| **Site déployé**   | [https://thanthan77.github.io/Dashboard_Canadiens/](https://thanthan77.github.io/dashboardPersonel/)           |
| **Repository GitHub** | [https://github.com/Thanthan77/Dashboard_Canadiens](https://github.com/Thanthan77/dashboardPersonel) |



