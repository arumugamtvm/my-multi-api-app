# Build Stage
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app (this should generate the `dist` folder for production)
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy the build artifacts to the nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
