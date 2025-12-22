# Franklin Trinity OS - Complete Setup Guide

This guide covers the complete setup for both backend and frontend applications.

## Project Structure

```
Franklin---Trinity---OS/
├── src/                           # Backend API source code
├── orchestrate-autonomy-intelligence/  # Frontend React app
├── docker-compose.yml             # Backend + MongoDB only
├── docker-compose.fullstack.yml   # Full stack (Backend + Frontend + MongoDB)
├── Dockerfile                     # Backend Docker configuration
├── DEPLOYMENT.md                  # Production deployment guide
├── SECURITY.md                    # Security best practices
└── PRODUCTION_CHECKLIST.md        # Pre-deployment checklist
```

## Quick Start - Full Stack with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

2. **Create environment files:**
```bash
# Backend environment
cp .env.production.template .env.production

# Frontend environment
cp orchestrate-autonomy-intelligence/.env.production.template orchestrate-autonomy-intelligence/.env.production
```

3. **Generate JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Edit `.env.production`** and add your JWT secret and other configuration.

5. **Start all services:**
```bash
# Full stack (Backend + Frontend + MongoDB)
docker-compose -f docker-compose.fullstack.yml up -d

# Or backend + MongoDB only
docker-compose up -d
```

6. **Verify services:**
```bash
# Check status
docker-compose -f docker-compose.fullstack.yml ps

# View logs
docker-compose -f docker-compose.fullstack.yml logs -f

# Test backend
curl http://localhost:3000/health

# Access frontend
open http://localhost:8080
```

## Quick Start - Development Setup

### Backend Development

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Start MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
```

4. **Start development server:**
```bash
npm run dev
```

Backend runs on: http://localhost:3000

### Frontend Development

1. **Navigate to frontend directory:**
```bash
cd orchestrate-autonomy-intelligence
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Start development server:**
```bash
npm run dev
```

Frontend runs on: http://localhost:8080

## Available Services

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:3000 | Express.js REST API |
| Frontend | http://localhost:8080 | React application |
| API Health | http://localhost:3000/health | Health check endpoint |
| API Docs | http://localhost:3000/api/docs | API documentation |
| MongoDB | localhost:27017 | Database |

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/docs` - API documentation
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (require JWT token)
- `GET /api/auth/profile` - Get user profile
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/system/status` - System status
- `GET /api/system/info` - System information

## Production Deployment

📚 **Before deploying to production, review:**
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
2. [SECURITY.md](./SECURITY.md) - Security best practices
3. [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist

### Quick Production Deploy with Docker

```bash
# Configure production environment
cp .env.production.template .env.production
# Edit .env.production with production values

# Deploy full stack
docker-compose -f docker-compose.fullstack.yml up -d

# Check logs
docker-compose -f docker-compose.fullstack.yml logs -f
```

### Production Checklist Summary

- [ ] Strong JWT secret generated
- [ ] MongoDB authentication enabled
- [ ] HTTPS/SSL configured
- [ ] CORS configured with production URLs
- [ ] Environment variables secured
- [ ] Dependencies updated
- [ ] Security audit passed
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation reviewed

## Development Commands

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run security:audit  # Check for vulnerabilities
```

### Frontend
```bash
cd orchestrate-autonomy-intelligence
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Docker
```bash
# Backend only
docker-compose up -d
docker-compose down
docker-compose logs -f backend

# Full stack
docker-compose -f docker-compose.fullstack.yml up -d
docker-compose -f docker-compose.fullstack.yml down
docker-compose -f docker-compose.fullstack.yml logs -f
```

## Testing

### Backend Tests
```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Run tests in watch mode
```

### API Testing with curl

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Get profile (with token):**
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Verify MongoDB is running
docker-compose ps
mongo mongodb://localhost:27017

# Check port availability
sudo netstat -tlnp | grep 3000
```

### Frontend won't build
```bash
# Clear cache and reinstall
cd orchestrate-autonomy-intelligence
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
```bash
# Test MongoDB connection
mongo mongodb://localhost:27017/franklin-trinity-os --eval "db.stats()"

# Check MongoDB logs
docker-compose logs mongodb
```

## Environment Variables

### Backend (.env)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | development | Environment mode |
| `PORT` | No | 3000 | Server port |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_EXPIRES_IN` | No | 7d | Token expiration |
| `CORS_ORIGIN` | Yes | - | Allowed CORS origin |

### Frontend (.env)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | - | Backend API URL |
| `VITE_API_BASE_URL` | Yes | - | Backend base URL |
| `VITE_ENV` | No | development | Environment mode |

## Tech Stack

### Backend
- Node.js 18+
- Express.js 4.x
- MongoDB 7.0 with Mongoose
- JWT Authentication
- Helmet.js (Security)
- Express Rate Limit
- Express Validator
- Jest (Testing)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI Components
- React Router
- Tanstack Query
- Supabase Client

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (Frontend serving)

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting on all endpoints
- ✅ CORS protection
- ✅ Security headers (Helmet.js)
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ HTTPS support

## Performance Features

- ✅ Docker multi-stage builds
- ✅ Nginx static file serving
- ✅ Gzip compression
- ✅ Asset caching
- ✅ Database connection pooling
- ✅ Health check endpoints

## License

ISC License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Review documentation in the repository
- Check logs for error messages

## Contributors

- Project maintainers and contributors

## Additional Resources

- [Backend API Documentation](./README.md)
- [Frontend Documentation](./orchestrate-autonomy-intelligence/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guide](./SECURITY.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
