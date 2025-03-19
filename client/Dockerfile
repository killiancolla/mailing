# Utilise une image officielle Node.js
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du projet
COPY . .

# Build Next.js
RUN npm run build

# Expose le port 4000
EXPOSE 4000

# Commande de lancement
CMD ["npm", "start"]