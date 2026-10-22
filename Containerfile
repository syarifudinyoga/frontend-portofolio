# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM docker.io/library/node:20-alpine AS builder

WORKDIR /app

# Cache node dependencies
COPY package*.json ./
RUN npm ci --fetch-retries=5 --prefer-offline --no-audit --no-fund

# Copy source files
COPY . .

# Build-time environment arguments baked into Vite build
ARG VITE_API_BASE_URL="https://api-portofolio.devlabhub.id"
ARG VITE_API_ENCRYPTION_SECRET="portfolio-vault-key-2026-secure-secret-token"
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_ENCRYPTION_SECRET=${VITE_API_ENCRYPTION_SECRET}

RUN npm run build

# ==========================================
# Stage 2: Lightweight Nginx Web Server
# ==========================================
FROM docker.io/library/nginx:1.27-alpine AS runtime

RUN apk add --no-cache wget curl

# Copy compiled production artifacts
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install runtime environment injection script
COPY 40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

ENV PORT=3005
EXPOSE 3005 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT}/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
