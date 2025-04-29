# Use Node.js LTS as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the port the frontend runs on
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]