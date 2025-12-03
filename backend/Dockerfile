FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate

COPY src ./src

ENV NODE_ENV=production
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3001
CMD ["node", "src/index.js"]
