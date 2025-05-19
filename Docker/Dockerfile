FROM node:18.19.1-alpine AS build-stage

WORKDIR /app

COPY . .

FROM node:18.19.1-alpine

WORKDIR /app

COPY --from=build-stage /app /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js