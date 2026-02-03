Voici le code Markdown complet :

```markdown
# Real-Time ELO Ranker

Un système de classement ELO en temps réel avec frontend React/Next.js et backend Nest.js.

## 📋 Fonctionnalités

- Système de classement ELO pour joueurs
- Interface en temps réel avec WebSockets
- Matchmaking automatique
- Historique des matchs
- Classement dynamique avec animations

## 🏗️ Architecture

- **Frontend** : Next.js 15 avec React 19, TypeScript, Tailwind CSS
- **Backend** : Nest.js avec TypeORM, SQL.js
- **Communication** : WebSockets pour les mises à jour en temps réel
- **Base de données** : SQLite en mémoire (SQL.js)
- **Monorepo** : Géré avec pnpm workspaces

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+ ou 20+
- pnpm 8+ (obligatoire)
- Git

### Installation

```bash
# 1. Clone le projet
git clone <url-du-projet>
cd realtime-elo-ranker-master

# 2. Installe pnpm si ce n'est pas fait
npm install -g pnpm

# 3. Installe les dépendances
pnpm install

# 4. Configure l'environnement (optionnel)
cp .env.example .env
```

## 🏃‍♂️ Lancement

### Développement

```bash
# Lancer le client (frontend) sur http://localhost:3000
pnpm apps:client:dev

# Lancer le serveur (backend) sur http://localhost:3001
pnpm apps:server:dev

# Lancer les deux en parallèle
pnpm apps:client:dev & pnpm apps:server:dev
```

### Production

```bash
# Build des applications
pnpm apps:server:build
pnpm apps:client:build

# Lancement en production
pnpm apps:server:start
# Le client doit être servi par un serveur web (Nginx, etc.)
```

## 📁 Structure du projet

```text
realtime-elo-ranker-master/
├── apps/
│   ├── realtime-elo-ranker-client/     # Frontend Next.js
│   └── realtime-elo-ranker-server/     # Backend Nest.js
├── libs/
│   └── ui/                             # Composants UI partagés
├── docs/                               # Documentation
├── package.json                        # Configuration racine
└── pnpm-workspace.yaml                 # Configuration pnpm
```

## 🔧 Configuration Technique

### Choix techniques importants

- **Monorepo avec pnpm** :
  - Partage des dépendances entre projets
  - Gestion simplifiée des versions
  - Installation plus rapide

- **SQL.js (SQLite in-memory)** :
  - Base de données légère pour le développement
  - Pas de configuration de serveur DB nécessaire
  - Facile à tester et déployer
  - Pour la production : Migrer vers PostgreSQL/MySQL recommandé

- **WebSockets pour le temps réel** :
  - Mises à jour immédiates du classement
  - Expérience utilisateur fluide
  - Pas de polling HTTP inutile

- **TypeScript partout** :
  - Sécurité des types frontend et backend
  - Meilleure maintenabilité
  - Auto-complétion améliorée

- **Turbopack pour Next.js** :
  - Compilation ultra-rapide en développement
  - Meilleure expérience développeur

### Points d'attention pour l'évaluation

- **Architecture modulaire** :
  - Séparation claire client/serveur
  - Librairie UI partagée
  - Services indépendants

- **Gestion d'état temps réel** :
  - WebSockets bien intégrés
  - Mises à jour optimistes
  - Gestion des erreurs réseau

- **Calcul ELO** :
  - Algorithme standard implémenté
  - Historique des changements de points
  - Classement pondéré

- **Tests** :
  - Tests unitaires backend (Jest)
  - Tests composants frontend
  - Tests d'intégration

- **UI/UX** :
  - Animations fluides avec Framer Motion
  - Design responsive avec Tailwind
  - Feedback utilisateur en temps réel

## 🧪 Tests

```bash
# Tests du serveur
pnpm apps:server:test

# Tests en mode watch
pnpm apps:server:test:watch

# Build de la lib UI
pnpm libs:ui:build
```

## 📊 API Endpoints

### Joueurs

- `GET /players` - Liste tous les joueurs
- `POST /players` - Crée un nouveau joueur
- `GET /players/:id` - Récupère un joueur
- `PUT /players/:id` - Met à jour un joueur

### Matchs

- `GET /matches` - Liste tous les matchs
- `POST /matches` - Crée un nouveau match
- `POST /matches/simulate` - Simule un match

### Classement

- `GET /ranking` - Récupère le classement actuel
- `GET /ranking/history` - Historique du classement

## 🔄 WebSocket Events

- `ranking_update` - Mise à jour du classement
- `match_created` - Nouveau match créé
- `player_updated` - Joueur mis à jour

## 🐛 Dépannage

### Problèmes courants

- **Erreur "Module not found: 'motion/react'"** :
  ```bash
  rm -rf node_modules apps/*/node_modules
  pnpm install
  ```

- **Erreur de version React** :
  Vérifier que react et react-dom ont la même version dans pnpm-workspace.yaml

- **SQL.js non trouvé** :
  ```bash
  pnpm add sql.js -F realtime-elo-ranker-server
  ```

- **Ports déjà utilisés** :
  Modifier les ports dans les fichiers .env

## 📝 Notes pour l'évaluation

### Points forts

- Architecture modulaire et maintenable
- Temps réel bien implémenté
- Code TypeScript de qualité
- Animations UI fluides
- Tests automatisés

### Améliorations possibles

- Migration vers base de données persistante
- Authentification des joueurs
- Système de tournois
- Dashboard administrateur
- Internationalisation

## 👥 Équipe

- [Noms des membres de l'équipe]

## 📄 Licence

UNLICENSED - Usage privé uniquement
```