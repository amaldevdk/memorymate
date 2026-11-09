# OpenShift-compatible Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Create uploads directory and ensure OpenShift arbitrary UID permissions
RUN mkdir -p uploads && \
    chgrp -R 0 /app && \
    chmod -R g=u /app

# OpenShift non-root user
USER 1001

EXPOSE 5000

ENV PORT=5000 \
    NODE_ENV=production

CMD ["node", "server.js"]
