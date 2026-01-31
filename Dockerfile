# Development Dockerfile for React/Vite application
FROM node:20-alpine

# Environment Variables
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:8080
ENV VITE_BACKEND_URL=http://localhost:10001
ENV VITE_GATEWAY_URL=http://localhost:8080
ENV VITE_DCC_SERVICE_URL=http://localhost:8080
ENV VITE_SENSOR_MANAGER_URL=http://localhost:8080
ENV VITE_DEV_PORT=5173

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on (configurable)
EXPOSE ${VITE_DEV_PORT}

# Health check for development server
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${VITE_DEV_PORT} || exit 1

# Comando per avviare Vite in modalità sviluppo
CMD ["npm", "run", "dev", "--", "--host", "--port", ${VITE_DEV_PORT}]