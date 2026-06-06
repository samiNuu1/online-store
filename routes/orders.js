const express          = require('express');
const router           = express.Router();
const orderController  = require('../controllers/orderController');
const authMiddleware   = require('../middleware/authMiddleware');

// All order routes require login
router.post('/checkout',   authMiddleware, orderController.postCheckout);
router.get('/order/:id',   authMiddleware, orderController.getOrder);
router.get('/orders',      authMiddleware, orderController.getOrders);

module.exports = router;
