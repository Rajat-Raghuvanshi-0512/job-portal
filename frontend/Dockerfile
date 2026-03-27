# Production Dockerfile
# Stage 1: Build
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Clear default nginx html files
RUN rm -rf ./*
COPY --from=build /app/dist/frontend/browser .
# Ensure permissions
RUN chmod -R 755 .
# Remove default nginx configs and add custom one
RUN rm -f /etc/nginx/conf.d/default.conf && \
    rm -rf /etc/nginx/http.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
