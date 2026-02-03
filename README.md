
# Real-Time ELO Ranker







## 🚀 Installation Rapide

### Prérequis

- Node.js 18+ ou 20+
- pnpm 8+ (obligatoire)
- Git

### Installation

```bash
# 1. Installe pnpm si ce n'est pas fait
npm install -g pnpm

# dans le dossier racine
# 2. Installe les dépendances
pnpm install

```

## 🏃‍♂️ Lancement

### Développement

```bash
# Lancer le client (frontend) sur http://localhost:3000
pnpm apps:client:dev

# Lancer le serveur (backend) sur http://localhost:3001
pnpm apps:server:dev

```



## 📁 Structure du projet

```text
realtime-elo-ranker-master/
├── apps/
│   ├── realtime-elo-ranker-client/     # Frontend Next.js
│   └── realtime-elo-ranker-server/     # Backend Nest.js
│       ├── src/
│       │   ├── app.module.ts           # Module principal
│       │   ├── main.ts                 # Point d'entrée
│       │   ├── matches/                # Module des matchs
│       │   │   ├── dto/                # Data Transfer Objects
│       │   │   │   ├── create-match.dto.ts
│       │   │   │   └── match-results.dto.ts
│       │   │   ├── elo.service.ts      # Service de calcul ELO
│       │   │   ├── entities/
│       │   │   │   └── match.entity.ts # Entité Match
│       │   │   ├── matches.controller.ts
│       │   │   ├── matches-db.service.ts
│       │   │   ├── matches.module.ts
│       │   │   ├── matches.service.ts
│       │   │   └── __tests__/          # Tests unitaires
│       │   ├── players/                # Module des joueurs
│       │   │   ├── dto/
│       │   │   │   ├── create-player.dto.ts
│       │   │   │   ├── player.dto.ts
│       │   │   │   └── update-player.dto.ts
│       │   │   ├── entities/
│       │   │   │   └── player.entity.ts # Entité Player
│       │   │   ├── players.controller.ts
│       │   │   ├── players-db.service.ts
│       │   │   ├── players.module.ts
│       │   │   ├── players.service.ts
│       │   │   └── __tests__/
│       │   └── ranking/                # Module du classement
│       │       ├── dto/
│       │       │   ├── error.dto.ts
│       │       │   ├── ranking-event.dto.ts
│       │       │   └── ranking-update.dto.ts
│       │       ├── rank-cache.service.ts # Cache du classement
│       │       ├── ranking.controller.ts
│       │       ├── ranking.module.ts
│       │       ├── ranking.service.ts
│       │       └── __tests__/
│       └── test/                       # Tests E2E
│           └── app.e2e-spec.ts
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


## 🧪 Tests

```bash
# Tests du serveur
pnpm apps:server:test

pnpm apps:server:test:e2e

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

