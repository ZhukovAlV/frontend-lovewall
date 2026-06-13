# ===== Build stage =====
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies separately to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files including environment configuration
COPY . .

# Copy production environment file
COPY .env.production .env

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
  CMD wget -qO- http://localhost:3000/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]