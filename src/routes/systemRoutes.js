const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const auth = require('../middleware/auth');
const { dbLimiter } = require('../middleware/rateLimiter');

// All system routes require authentication and rate limiting
router.use(auth);
router.use(dbLimiter);

router.get('/status', systemController.getStatus);
router.get('/info', systemController.getInfo);

module.exports = router;
