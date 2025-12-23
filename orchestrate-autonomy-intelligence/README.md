# Franklin Trinity OS - Frontend

React + TypeScript + Vite frontend application for Franklin Trinity OS.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Production Deployment

### Docker Deployment (Recommended)

```bash
# Build Docker image
docker build -t franklin-trinity-frontend .

# Run container
docker run -p 8080:80 franklin-trinity-frontend
```

### Manual Deployment

```bash
# Build the application
npm run build

# The dist/ folder contains the production build
# Deploy the contents of dist/ to your web server
```

## Environment Variables

Create `.env.production` from `.env.production.template`:

```bash
cp .env.production.template .env.production
```

Configure your backend API URL:
```
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Technology Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI
- React Router
- Tanstack Query

