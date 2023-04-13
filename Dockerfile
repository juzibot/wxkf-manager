FROM node:18.14.2-alpine3.17

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

CMD node ./dist/main.js