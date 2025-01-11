FROM node:18.19.1-alpine AS build-stage

WORKDIR /app

COPY . .

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

RUN npm install

FROM node:18.19.1-alpine

WORKDIR /app

COPY --from=build-stage /app /app

RUN npm i sqlite3

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js