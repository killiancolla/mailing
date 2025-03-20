# Utilise une image officielle Node.js
FROM node:18

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers du projet
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install --production

# Copie le reste du projet
COPY . .

RUN npx prisma generate

RUN echo "*/5 * * * * /usr/local/bin/node /app/server/src/cron/sender.js >> /var/log/cron.log 2>&1" > /etc/cron.d/my-cron-job \
    && chmod 0644 /etc/cron.d/my-cron-job \
    && crontab /etc/cron.d/my-cron-job

RUN touch /var/log/cron.log

# Expose le port 5000
EXPOSE 5000

# Commande de lancement
CMD ["node", "index.js"]