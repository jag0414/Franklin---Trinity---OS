# React + TypeScript + Vite

End to End Sovereign Operating System Backend

## Overview

Franklin Trinity OS is a comprehensive backend system designed as a sovereign operating system platform. This backend provides a robust API infrastructure for user management, authentication, and system monitoring.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - Complete CRUD operations for users
- 🛡️ **Security** - Helmet.js for security headers, password hashing with bcrypt
- 🚦 **Rate Limiting** - Protection against brute force and DDoS attacks
- 📊 **System Monitoring** - Real-time system status and information endpoints
- 🗄️ **Database** - MongoDB integration with Mongoose ODM
- ✅ **Validation** - Input validation and error handling
- 🧪 **Testing** - Jest testing framework with coverage
- 📝 **Logging** - Morgan HTTP request logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, bcryptjs, CORS
- **Testing:** Jest, Supertest
- **Dev Tools:** Nodemon, ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jag0414/Franklin---Trinity---OS.git
cd Franklin---Trinity---OS
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/franklin-trinity-os
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

4. Start the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
- **GET** `/health` - Check server health status

#### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/profile` - Get current user profile (requires auth)

#### Users (Protected)
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

#### System (Protected)
- **GET** `/api/system/status` - Get system status
- **GET** `/api/system/info` - Get system information

### API Documentation Page
Visit `http://localhost:3000/api/docs` for interactive API documentation.

## Project Structure

```
Franklin---Trinity---OS/
├── src/
│   ├── config/          # Configuration files
│   │   ├── config.js    # Application configuration
│   │   └── database.js  # Database connection
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── systemController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/          # Database models
│   │   └── User.js
│   ├── routes/          # API routes
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── systemRoutes.js
│   ├── tests/           # Test files
│   │   └── api.test.js
│   ├── utils/           # Utility functions
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Linting

Run linter:
```bash
npm run lint
```

Auto-fix linting issues:
```bash
npm run lint:fix
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Register or login to get a token
2. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Security Best Practices

- Passwords are hashed using bcryptjs
- JWT tokens for stateless authentication
- Helmet.js for security headers
- CORS configuration
- Rate limiting to prevent abuse:
  - General API: 100 requests per 15 minutes
  - Authentication endpoints: 5 requests per 15 minutes
  - Database operations: 50 requests per 15 minutes
- Input validation
- Environment variables for sensitive data

## Development

### Code Style
- Follow JavaScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Write meaningful commit messages

### Adding New Features
1. Create models in `src/models/`
2. Create controllers in `src/controllers/`
3. Create routes in `src/routes/`
4. Add tests in `src/tests/`
5. Update documentation

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

## Production Deployment

📚 **Before deploying to production, please review:**
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [SECURITY.md](./SECURITY.md) - Security best practices
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist

**Quick production deployment with Docker:**
```bash
# Copy and configure production environment
cp .env.production.template .env.production
# Edit .env.production with your settings

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f backend
```

## Contributors

- Project maintainers and contributors
