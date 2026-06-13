# ===== Build stage =====
FROM node:18-alpine AS build

WORKDIR /app

# Build-time API URL (Vite inlines VITE_* at build time, not at container runtime!)
# Override at build with:  docker build --build-arg VITE_API_AUTH_SERVICE_URL=https://lovewall.art:8444 .
ARG VITE_API_AUTH_SERVICE_URL=https://lovewall.art:8444
ARG VITE_MODE=production
ENV VITE_API_AUTH_SERVICE_URL=${VITE_API_AUTH_SERVICE_URL}
ENV VITE_MODE=${VITE_MODE}

# Install dependencies separately to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Write the build-time env file from build args so Vite picks it up regardless of
# whatever .env.production was committed. This guarantees the produced bundle
# contains the URL we want.
RUN printf "VITE_API_AUTH_SERVICE_URL=%s\nVITE_MODE=%s\n" \
      "$VITE_API_AUTH_SERVICE_URL" "$VITE_MODE" > .env.production

# Build with production mode
RUN npm run build

# ===== Production stage =====
FROM nginx:alpine AS production

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (matches nginx.conf `listen 3000;`)
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
