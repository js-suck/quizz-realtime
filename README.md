# Projet de Quiz en Temps Réel avec Socket.IO

Ce projet est un quiz interactif en temps réel utilisant Node.js et Socket.IO. Il permet à plusieurs utilisateurs de participer à des quiz et de voir les résultats en temps réel.

## Contributeurs

- Laila CHARAOUI 5IW2 : Communication en temps réel avec Socket.IO, Fonctionnalité de la salle de quiz, Déroulement des questions et réponses, Retour en direct sur les réponses, Synchronisation des états de jeu, Stockage de données persistant.
- Antoine CHABERNAUD 5IW2 : Dockerisation, Serveur, Chat, Interface de création de quiz.
- Lucas RAMIS 5WI2 : Notifications en temps réel, Notation et résultats.
- Vivian RUHLMANN 5IW2 : Réglage du temps par question en temps réel, Minuteur côté serveur, page des catégories.

## Prérequis

- Node.js
- Docker
- Yarn

## Installation et configuration

1. Cloner le projet :

```bash
git clone <url_du_projet>

```

2. Installer les dépendances :

```bash
cd <répertoire_du_projet>
yarn install

```

## Utilisation de Docker
Pour construire l'image Docker du projet et l'exécuter :

```bash
docker compose run --build
```

## Lancement des migrations
Pour exécuter les migrations et préparer votre base de données :
```bash
yarn d:s:u
```

Assurez-vous que votre service de base de données est configuré et accessible.

## Démarrage du serveur
Si vous rencontrez des difficultés avec le serveur exécuté sur Docker, vous avez la possibilité de démarrer le serveur localement.

Pour lancer le serveur du projet :
```bash
cd ./server
yarn start
```
