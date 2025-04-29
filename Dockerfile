# Use Node.js LTS version
FROM node:18-alpine

# Install necessary system dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Set npm config
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 5

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Update specific packages
RUN npm install expo@~52.0.46 react-native@0.76.9

# Expose ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the application
CMD ["npm", "start"] 