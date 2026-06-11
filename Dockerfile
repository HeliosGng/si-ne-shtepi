# Use a standard, secure, lightweight Node image for building
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Clean-install all dependencies (essential for running compilers)
RUN npm install

# Copy all source files
COPY . .

# Compile application assets (Vite client files) and pack the Express server
RUN npm run build

# --- Production Runner Stage ---
FROM node:22-alpine AS runner

WORKDIR /app

# Set production configurations
ENV NODE_ENV=production
ENV PORT=8080

# Install ONLY production dependencies to keep the deployment image super lightweight
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts and bundles from builder stage
COPY --from=builder /app/dist ./dist

# Document network entrypoint (using port 8080 for Cloud Run defaults)
EXPOSE 8080

# Run the compiled, self-contained server bundle
CMD ["node", "dist/server.cjs"]
