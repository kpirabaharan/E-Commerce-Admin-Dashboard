ARG NODE_VERSION=21
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY ./package.json .
RUN npm i

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

EXPOSE 3000
CMD [ "npm", "run", "dev" ]
