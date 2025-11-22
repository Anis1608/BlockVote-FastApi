# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_BACKEND_URL=http://backend:9000

# Copy package files first
COPY package.json bun.lockb ./

# Install dependencies using npm (since bun.lockb is present, bun would be ideal but npm works too)
RUN npm install

# Copy entire project
COPY . .

# Build the TypeScript React + Vite project with environment variables
RUN VITE_BACKEND_URL=${VITE_BACKEND_URL} npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]