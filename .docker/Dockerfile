# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22.23.5

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

RUN chown node:node /app

# Development dependency layer. The lockfile is used whenever it exists.
FROM base AS development-dependencies

COPY --chown=node:node package*.json ./
USER node

RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 \
    if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Local Vite server with all development tools available.
FROM development-dependencies AS development

ENV NODE_ENV=development

COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--strictPort"]

# Build stage is useful for validating the production bundle inside Docker.
FROM development AS build

ARG VITE_API_BASE_URL=/api
ARG VITE_APP_NAME="Help Desk"

ENV NODE_ENV=production \
    VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build
