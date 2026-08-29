FROM node:22-alpine AS builder

WORKDIR /app

# Copy root configurations and manifests
COPY package*.json tsconfig.base.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY services/order-service/package*.json ./services/order-service/
COPY services/payment-service/package*.json ./services/payment-service/
COPY services/inventory-service/package*.json ./services/inventory-service/
COPY services/notification-service/package*.json ./services/notification-service/
COPY services/monolith/package*.json ./services/monolith/
COPY tools/dlq-manager/package*.json ./tools/dlq-manager/

# Install dependencies across all workspaces
RUN npm install

# Copy all source files
COPY packages ./packages
COPY services ./services
COPY tools ./tools

# Build all typescript workspaces
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
