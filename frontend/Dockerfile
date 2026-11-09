# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Nginx Stage (OpenShift Compatible)
FROM nginx:alpine

# Copy custom OpenShift-compliant nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built production assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure permissions for OpenShift arbitrary UID security
RUN touch /tmp/nginx.pid && \
    chgrp -R 0 /var/cache/nginx /var/log/nginx /usr/share/nginx/html /tmp /etc/nginx && \
    chmod -R g=u /var/cache/nginx /var/log/nginx /usr/share/nginx/html /tmp /etc/nginx

# Non-root user for OpenShift
USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
