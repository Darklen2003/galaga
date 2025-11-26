FROM node:18-alpine

WORKDIR /app

# Сначала копируем package.json и ставим библиотеки (для кэширования)
COPY package.json .
RUN npm install

# Копируем код сервера и игры
COPY . .

# Открываем порт
EXPOSE 80

# Команда запуска
CMD ["node", "server.js"]