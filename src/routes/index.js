const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const systemRoutes = require('./systemRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/system', systemRoutes);

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Franklin Trinity OS API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      docs: '/api/docs',
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      system: '/api/system'
    }
  });
});

module.exports = router;
