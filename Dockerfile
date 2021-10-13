# This image is for the server only

# -- Stage 1: Build

FROM node as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build:server

# -- Stage 2: Run

FROM node:16-alpine
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/build/server ./server
COPY --from=ts-compiler /usr/app/build/shared ./shared
RUN npm ci --only=production
CMD node ./server/main.js
