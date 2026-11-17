# Stage 1: Dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time arguments receive
ARG MONGO_URI
ARG OPENAI_API_KEY
ARG BETTER_AUTH_SECRET
ARG NEXT_PUBLIC_BETTER_AUTH_URL
ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_GITHUB_APP_NAME
ARG NEXT_PUBLIC_GITHUB_LINK
ARG NEXT_PUBLIC_GITHUB_APP_INSTALL_URL

ENV MONGO_URI=$MONGO_URI
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL
ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API
ENV NEXT_PUBLIC_GITHUB_APP_NAME=$NEXT_PUBLIC_GITHUB_APP_NAME
ENV NEXT_PUBLIC_GITHUB_LINK=$NEXT_PUBLIC_GITHUB_LINK
ENV NEXT_PUBLIC_GITHUB_APP_INSTALL_URL=$NEXT_PUBLIC_GITHUB_APP_INSTALL_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output এবং static files কপি করা
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# GitHub App private key (.pem) ফাইল কপি করা
COPY --from=builder --chown=nextjs:nodejs /app/github-private-key.pem ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]