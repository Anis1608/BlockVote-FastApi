# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG VITE_BACKEND_URL

# Export to environment (Vite requires ENV)
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Vite project
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Serve production build
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Correct port for this frontend
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

CMD ["serve", "-s", "dist", "-l", "5173"]
