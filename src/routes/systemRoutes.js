const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const auth = require('../middleware/auth');

// All system routes require authentication
router.use(auth);

router.get('/status', systemController.getStatus);
router.get('/info', systemController.getInfo);

module.exports = router;
