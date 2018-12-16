FROM node:11.4.0-alpine
WORKDIR /usr/src/moviesapi

## copy app data
COPY . .

## install deps
RUN npm install

EXPOSE 3000
CMD ./node_modules/pm2/bin/pm2-runtime ./index.js
