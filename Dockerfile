FROM node:18.14.2-alpine3.17

WORKDIR /app

COPY ./package.json ./package.json
COPY ./node_modules ./node_modules
COPY ./dist ./dist

CMD node ./dist/main.js