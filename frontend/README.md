# Franklin Trinity OS - Frontend

React-based frontend for the Franklin Trinity OS sovereign operating system platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend server running on http://localhost:3000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Card.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Users.jsx
│   │   └── SystemStatus.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Base styles
├── .env.example         # Environment variables template
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🔑 Features

- **Authentication** - Login, registration, and JWT token management
- **User Management** - View, edit, and delete users
- **Profile Management** - View and edit user profile
- **System Monitoring** - Real-time system status and information
- **Responsive Design** - Mobile-friendly interface
- **Protected Routes** - Route guards for authenticated pages

## 🎨 Pages

### Public Pages
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/dashboard` - Main dashboard with overview
- `/profile` - User profile and settings
- `/users` - User management (admin)
- `/system` - System status and monitoring

## 🛠️ Technologies

- **React 18** - UI framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## 📡 API Integration

The frontend connects to the backend API at `http://localhost:3000/api` by default.

Configure the API URL in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### API Endpoints Used
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/system/status` - Get system status
- `GET /api/system/info` - Get system information

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Tokens are automatically added to API requests
- Expired tokens redirect to login page

## 🏗️ Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

Preview production build:
```bash
npm run preview
```

## 🤝 Integration with Backend

1. Ensure backend is running:
```bash
cd ..
npm run dev
```

2. Backend should be accessible at `http://localhost:3000`
3. CORS is configured to allow frontend origin
4. API endpoints match the backend routes

## 📝 Development Notes

- Hot module replacement (HMR) enabled
- Proxy configured for API requests in development
- Environment variables must be prefixed with `VITE_`
- Authentication context manages user state globally

## 🎯 Next Steps

- [ ] Add form validation
- [ ] Implement user editing functionality
- [ ] Add pagination for users list
- [ ] Implement real-time updates with WebSockets
- [ ] Add error boundaries
- [ ] Implement loading states
- [ ] Add unit tests
- [ ] Add E2E tests

## 📄 License

ISC