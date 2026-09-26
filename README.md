# Dashboard personnel
## MVP v1.0

---

# Vision

Créer un tableau de bord personnel simple, rapide et responsive qui centralise les informations importantes de la journée.

Le dashboard doit répondre instantanément aux questions suivantes :

-  Quel temps fait-il ?
-  Vais-je avoir besoin d'un parapluie ?
-  Qu'est-ce que j'ai aujourd'hui ?
-  Que dois-je faire ?
-  Quand jouent les Canadiens ?
-  Quels sont les sites que j'utilise le plus ?

L'objectif est que le dashboard devienne la page que j'ouvre chaque matin.

---

# Objectifs du MVP

## Fonctionnels

- Interface moderne et simple
- Responsive desktop/mobile
- Chargement rapide
- Utilisation quotidienne
- Aucune authentification
- Déployable sur GitHub Pages
- Données sauvegardées localement lorsque nécessaire

## Techniques

### Technologies

- HTML5
- CSS3
- JavaScript Vanilla
- LocalStorage
- API REST

### Hors MVP

- Backend
- Base de données
- Authentification utilisateur
- Comptes multiples

---

# Architecture du Dashboard

## Desktop

```text
┌───────────────────────────────────────────────┐
│ Header                                        │
├──────────────────┬────────────────────────────┤
│ Météo            │ Aujourd'hui                │
├──────────────────┼────────────────────────────┤
│ Tâches           │ Canadiens                  │
├──────────────────┴────────────────────────────┤
│ Liens rapides                                 │
└───────────────────────────────────────────────┘
```

## Mobile

```text
Header

Météo

Aujourd'hui

Tâches

Canadiens

Liens rapides
```

---

# Widget 1 : Header

## Objectif

Afficher les informations générales de la journée.

## Contenu

```text
Bonjour Ethan 

Jeudi 24 septembre 2026
```

## Données affichées

- Message de bienvenue
- Date actuelle

## Fonctionnalités

### MVP

- Date dynamique
- Message fixe

### Futur

- Bonjour / Bon après-midi / Bonsoir
- Citation du jour
- Photo de profil

---

# Widget 2 : Météo

## Objectif

Afficher rapidement les conditions météo actuelles.

## Données affichées

```text
Montréal

14°C

 70 % de pluie

 18 km/h
```

## Informations

### Obligatoires

- Température actuelle
- Probabilité de pluie

### Optionnelles

- Vent
- Ville détectée

## API

- OpenWeather API
ou
- WeatherAPI

## Comportement

Mise à jour automatique lors du chargement.

---

# Widget 3 : Aujourd'hui

## Objectif

Afficher les événements prévus pour la journée.

## Informations affichées

Pour chaque événement :

- Heure de début
- Heure de fin
- Nom
- Lieu (optionnel)

## Exemple

```text
09:00 - 12:00
LOG121

13:00 - 14:00
Travail d'équipe

19:00 - 21:00
Volleyball
```

## Résumé

```text
3 événements aujourd'hui
```

## Cas particulier

Si aucun événement :

```text
 Aucun événement aujourd'hui
```

## Bouton

```text
Voir mon calendrier
```

## MVP

Données simulées dans un tableau JavaScript.

## Évolution

Connexion Google Calendar.

---

# Widget 4 : Tâches du jour

## Objectif

Gérer rapidement les tâches de la journée.

## Fonctionnalités

### Ajouter une tâche

```text
+ Ajouter une tâche
```

### Compléter une tâche

```text
☑ Réviser Java
```

### Décocher une tâche

```text
☐ Réviser Java
```

### Supprimer une tâche


### Sauvegarder automatiquement

Via LocalStorage.

---

## Affichage

### Exemple

```text
Today's Tasks

☑ Réviser Java

☑ Envoyer laboratoire

☑ Compléter portfolio

☐ Projet personnel

☐ Exercices maths
```

---

## Statistiques

Afficher :

```text
3 / 5 complétées
```

---

## Barre de progression

Exemple :

```text
████████░░░░ 60%
```

Calcul :

```text
(nombre terminées / nombre total) × 100
```

---

## Structure de données

```json
[
    {
        "id": 1,
        "title": "Réviser Java",
        "completed": true
    }
]
```

---

# Widget 5 : Canadiens

## Objectif

Afficher le prochain match des Canadiens de Montréal.

## Source

API NHL

---

## Informations affichées

### Obligatoires

- Logo des Canadiens
- Logo de l'adversaire
- Nom de l'adversaire
- Date
- Heure
- Lieu

### Exemple

```text
MTL vs TOR

Vendredi 19:00

Centre Bell
```

---

## Compte à rebours

Afficher :

```text
Dans 1 jour 4 heures
```

Mise à jour automatique.

---

## Optionnel

Dernier résultat :

```text
MTL 4 - 2 BOS
```

---

# Widget 6 : Liens rapides

## Objectif

Accéder rapidement aux sites utilisés régulièrement.

---

## Liens par défaut

```text
GitHub

Moodle

Outlook

Discord

Teams

YouTube

ChatGPT
```

---

## Fonctionnalités

### Ajouter un lien

```text
+ Ajouter un lien
```

### Nommer un lien

Exemple :

```text
GitHub
```

### Définir l'URL

Exemple :

```text
https://github.com
```

### Ouvrir le lien

Au clic.

### Supprimer un lien

```text
🗑️
```

### Sauvegarde

LocalStorage.

---

## Structure de données

```json
[
    {
        "name": "GitHub",
        "url": "https://github.com"
    }
]
```

---

# Responsive Design

## Desktop

### Résolution

```text
≥ 1024 px
```

### Organisation

```text
2 colonnes
```

---

## Tablette

### Résolution

```text
768 px - 1023 px
```

### Organisation

```text
2 colonnes compactes
```

---

## Mobile

### Résolution

```text
< 768 px
```

### Organisation

```text
1 colonne
```

Widgets empilés verticalement.

---

# Sauvegarde des données

## LocalStorage

### Sauvegarder

- Tâches
- Liens rapides

### Ne pas sauvegarder

- Météo
- Canadiens
- Calendrier

Car ces données proviennent d'API.

---

# Structure du projet

```text
DashboardPerso/
│
├── index.html
│
├── css/
│   ├── general.css              # Fichier principal qui definit les variables css et propriété de base
│   ├── layout/
│   │   ├── grid.css          # Structure CSS Grid (desktop / responsive mobile)
│   │   └── header.css        # Style spécifique du header principal
│   └── components/
│       ├── card.css          # Conteneur générique .card (fond sombre, bordures, padding)
│       ├── weather.css       # Style du widget météo
│       ├── calendar.css      # Style de l'agenda et des badges
│       ├── tasks.css         # Style des tâches, checkbox et barre de progression
│       ├── canadiens.css     # Style de la carte Habs
│       └── links.css         # Style de la grille de raccourcis
│
├── js/
│   ├── app.js                # Point d'entrée principal (initialise les modules)
│   ├── config.js             # Constantes globales (URLs d'API, coordonnées Montréal, etc.)
│   ├── utils/
│   │   ├── storage.js        # Fonctions helper pour LocalStorage (get/set/remove génériques)
│   └── modules/
│       ├── header.js         # Gestion horloge & date
│       ├── weather.js        # Appel API Open-Meteo & affichage
│       ├── calendar.js       # Rendu agenda & prochain événement
│       ├── tasks.js          # CRUD tâches & calcul progression
│       ├── canadiens.js      # Appel API NHL & décompte match
│       └── links.js          # CRUD raccourcis & favicons Google
│
└── assets/
    ├── icons/                # SVGs/icônes statiques
    └── images/               # Logos ou images statiques (ex: logos fallback)
```

---

# Critères de réussite du MVP

Le MVP est considéré comme terminé lorsque :

- [ ] Le dashboard est responsive
- [ ] La météo s'affiche
- [ ] Les événements du jour s'affichent
- [ ] Les tâches peuvent être ajoutées
- [ ] Les tâches peuvent être cochées
- [ ] Les tâches peuvent être supprimées
- [ ] Les tâches sont sauvegardées
- [ ] Les liens rapides fonctionnent
- [ ] Les liens sont sauvegardés
- [ ] Le prochain match des Canadiens est affiché
- [ ] Le compte à rebours fonctionne
- [ ] Le dashboard est utilisable quotidiennement

---

# Vision V2

Après le MVP :

- Google Calendar API
- Dark Mode
- Horloge en temps réel
- Citation du jour
- Météo avancée
- Météo horaire
- Widget transport
- Temps de trajet vers l'ÉTS
- Widget SAAQ emploi
- Widget GitHub
- Personnalisation des widgets
- Réorganisation des cartes par glisser-déposer

---

# Objectif final

Créer une page unique qui fournit en moins de 5 secondes :

✅ Ce que je dois faire aujourd'hui  
📅 Les événements à venir  
🌤️ Les conditions météo  
🏒 Les informations des Canadiens  
🔗 Les outils que j'utilise quotidiennement

Le tout dans une interface moderne, rapide, responsive et agréable à consulter chaque matin.
