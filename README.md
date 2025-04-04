# Jeu de Fléchettes en Ligne

Un jeu de fléchettes en ligne avec une interface React et une API Node.js.

## Structure du Projet

Le projet est divisé en deux parties principales :

- `front/` : Application React avec Vite
- `back/` : API Node.js avec Express

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- PostgreSQL

## Installation

### Backend

```bash
cd back
npm install
```

Créer un fichier `.env` dans le dossier `back` avec les variables suivantes :
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/flechettes
JWT_SECRET=votre_secret_jwt
```

### Frontend

```bash
cd front
npm install
```

Créer un fichier `.env` dans le dossier `front` avec la variable suivante :
```
VITE_API_URL=http://localhost:3000/api
```

## Démarrage

### Backend

```bash
cd back
npm start
```

### Frontend

```bash
cd front
npm run dev
```

## Fonctionnalités

- Authentification des utilisateurs
- Gestion des profils
- Création et gestion des parties
- Gestion des amis
- Statistiques de jeu
- Interface en temps réel avec WebSocket

## Documentation API

La documentation de l'API est disponible à l'adresse :
```
http://localhost:3000/api-docs
```

## Technologies Utilisées

### Backend
- Node.js
- Express
- PostgreSQL
- Socket.io
- JWT pour l'authentification
- Swagger pour la documentation

### Frontend
- React
- Vite
- Material-UI
- Axios
- React Router
- Socket.io-client 