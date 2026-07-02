FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# npm install (not ci): lockfile is generated on Windows and omits linux-only
# optional deps (@emnapi/*, native rollup/swc), which npm ci rejects as out-of-sync.
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
