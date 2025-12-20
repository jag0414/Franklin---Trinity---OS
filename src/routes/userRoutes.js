const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { dbLimiter } = require('../middleware/rateLimiter');

// All user routes require authentication and rate limiting
router.use(auth);
router.use(dbLimiter);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
