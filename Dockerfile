FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci


FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci


FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV TZ=America/Port_of_Spain

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
