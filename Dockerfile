# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN adduser -D -H -u 1001 -s /bin/sh www-data

# Set ownership
RUN chown -R www-data:www-data /usr/share/nginx/html

# Switch to non-root user
USER www-data

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]