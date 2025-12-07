# YouthMDA Project

This is the main project repository for YouthMDA.

## Getting Started

To run this project:

```bash
# Install dependencies
npm install

# Start the Expo development server
cd YouthMDA
npx expo start --tunnel
```

The main application code is located in the YouthMDA directory.

#### Option 2: Docker Installation
```bash
# Pull the Docker image
docker pull adivishnia/youthmda:latest

# Run the container
docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 adivishnia/youthmda:latest

# Or using docker-compose
docker-compose up
```

The application will be available at:
- Expo DevTools: http://localhost:19002
- Expo Client: exp://localhost:19000

### Development with Docker
If you want to develop using Docker:

```bash
# Build the development image
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Contact
* Developer: Adi Vishnia
* Email: adi.vishnia@gmail.com
* GitHub: [@AdiVishnia](https://github.com/AdiVishnia)

---
<div dir="rtl">

### צור קשר
* מפתח: עדי וישניה
* אימייל: adi.vishnia@gmail.com
* GitHub: [@AdiVishnia](https://github.com/AdiVishnia)

</div>

# YouthMDA Docker Setup

This repository contains the Docker configuration for running the YouthMDA application.

## Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose installed on your system

### Running the Application

1. Pull the Docker image:
```bash
docker pull adivishnia/youthmda:latest
```

2. Run the container:
```bash
docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 adivishnia/youthmda:latest
```

Or using docker-compose:
```bash
docker-compose up
```

### Accessing the Application

Once running, you can access the application through:
- Expo DevTools: http://localhost:19002
- Expo Client: exp://localhost:19000

### Development

To develop using Docker:

```bash
# Build the development image
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Ports

The application uses the following ports:
- 19000: Expo Client
- 19001: Expo DevTools
- 19002: Expo Web Interface

## Environment Variables

- `NODE_ENV`: Set to 'development' by default

## Contributing

Feel free to submit issues and enhancement requests!
