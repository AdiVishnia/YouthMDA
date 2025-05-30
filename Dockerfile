# Use Node.js LTS version as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

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

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006

# Set environment variables
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel", "--web"] 