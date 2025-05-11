FROM node:24-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап production
FROM nginx:alpine

# Копируем собранное приложение в директорию для Nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# Открываем порт 80 для доступа
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]