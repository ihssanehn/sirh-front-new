FROM node:14.17.0-alpine as build

ARG appEnv

WORKDIR /app

# Deps layer
COPY package*.json ./
RUN npm i

# Code layer
COPY . . 
COPY ./src/environments/environment.${appEnv}.ts  ./src/environments/environment.prod.ts 

RUN npm run build --prod



FROM nginx:latest

COPY --from=build /app/dist/sirh-frontend /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf