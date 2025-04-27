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

# Expose the port the service runs on
EXPOSE 3002

# Start the application
CMD ["npm", "run", "del"]