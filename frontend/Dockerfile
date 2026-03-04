FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/MoneyT/browser   /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80