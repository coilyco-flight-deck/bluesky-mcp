# Build and test TypeScript before copying only production runtime files into a
# non-root image. Credentials are supplied only at runtime.
FROM node:22.14.0-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json eslint.config.js ./
COPY src ./src
COPY test ./test
RUN npm run lint && npm run typecheck && npm test

FROM node:22.14.0-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 9113
CMD ["npm", "start"]
