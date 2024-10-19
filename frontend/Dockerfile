# Dockerfile for Frontend App
FROM node:18 AS build

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the frontend app
RUN npm run build

# Serve with Nginx (production)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
