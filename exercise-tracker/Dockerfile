FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN npm i -g typescript ts-node
RUN pnpm i

COPY . .

EXPOSE 4000

CMD [ "pnpm", "dev"]