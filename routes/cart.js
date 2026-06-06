const express        = require('express');
const router         = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Cart requires login
router.get('/cart', authMiddleware, cartController.getCart);

module.exports = router;
