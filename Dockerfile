# Utiliser l'image officielle Node.js comme image de base
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers source de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel le serveur sera accessible
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
