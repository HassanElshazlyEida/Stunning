# Multi-stage Dockerfile for the entire application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for both frontend and backend
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies (including devDependencies for build)
RUN cd frontend && npm ci
RUN cd backend && npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy source code
COPY frontend ./frontend
COPY backend ./backend

# Build applications
RUN cd frontend && npm run build
RUN cd backend && npm run build

# Production image for frontend
FROM base AS frontend
WORKDIR /app/frontend

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

# Production image for backend
FROM base AS backend
WORKDIR /app/backend

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nestjs /app/backend/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /app/backend/package*.json ./

USER nestjs

EXPOSE 3001
ENV PORT 3001

CMD ["node", "dist/main"]
