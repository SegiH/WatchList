FROM node:18.19.1-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN npm i sqlite3

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js