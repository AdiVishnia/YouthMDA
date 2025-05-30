<<<<<<< HEAD
# Use Node.js LTS version as the base image
FROM node:20-slim
=======
# Use Node.js LTS version
FROM node:18-alpine

# Install necessary system dependencies
RUN apk add --no-cache python3 make g++
>>>>>>> 1e2385bdcf63c729de6c9789d1e0506b30da1669

# Set working directory
WORKDIR /app

<<<<<<< HEAD
# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Expo CLI and ngrok globally
RUN npm install -g expo-cli @expo/ngrok
=======
# Set npm config
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 5
>>>>>>> 1e2385bdcf63c729de6c9789d1e0506b30da1669

# Copy package files
COPY package*.json ./

# Install dependencies
<<<<<<< HEAD
RUN npm install
=======
RUN npm install --legacy-peer-deps
>>>>>>> 1e2385bdcf63c729de6c9789d1e0506b30da1669

# Copy the rest of the application
COPY . .

<<<<<<< HEAD
=======
# Update specific packages
RUN npm install expo@~52.0.46 react-native@0.76.9

>>>>>>> 1e2385bdcf63c729de6c9789d1e0506b30da1669
# Expose ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
<<<<<<< HEAD
EXPOSE 19006

# Set environment variables
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel", "--web"] 
=======

# Start the application
CMD ["npm", "start"] 
>>>>>>> 1e2385bdcf63c729de6c9789d1e0506b30da1669
