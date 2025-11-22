# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_BACKEND_URL

# Make ARG available as ENV for Vite
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install serve to run production build
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose correct port
EXPOSE 5175

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5175 || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "5175"]
