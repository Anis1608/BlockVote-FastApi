# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_BACKEND_URL

# Make ARG available as ENV for Vite
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install "serve"
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose the correct port
EXPOSE 5174

# Start production server
CMD ["serve", "-s", "dist", "-l", "5174"]
