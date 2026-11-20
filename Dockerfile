# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing: fallback to index.html for client-side routes
RUN printf 'server {\n  listen 8080;\n  location / {\n    root /usr/share/nginx/html;\n    index index.html;\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

# Fix permissions for non-root nginx
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R 1001:0 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R g+w /var/cache/nginx /var/run /var/log/nginx

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/ || exit 1
USER 1001
