# Utilise une image officielle Node.js
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers du projet
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install --production
RUN npx prisma generate

# Copie le reste du projet
COPY . .

# Expose le port 5000
EXPOSE 5000

# Commande de lancement
CMD ["node", "index.js"]