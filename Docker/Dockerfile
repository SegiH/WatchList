 FROM node:18-alpine AS build
  
 WORKDIR /app
 
 COPY package.json package-lock.json ./
 
 RUN npm ci
 
 COPY . .
 
 RUN npm run build
 
 RUN npm prune --omit=dev
 
 FROM node:18-alpine as runner
 
 WORKDIR /app
 
 ENV NODE_ENV=production
 ENV NEXT_TELEMETRY_DISABLED=1
 
 COPY --from=build /app/.next/standalone ./
 COPY --from=build /app/.next/static ./.next/static
 COPY --from=build /app/public ./public
 COPY --from=build /app/database.json ./database.json
 COPY --from=build /app/package.json ./database.json
 COPY --from=build /app/.env ./.env
 
 EXPOSE 3000
  
 ENV PORT=3000
  
 CMD HOSTNAME="0.0.0.0" node /app/server.js