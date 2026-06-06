const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');
const authMiddleware    = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Add to cart requires login
router.post('/products/:id/add-to-cart', authMiddleware, productController.addToCart);

module.exports = router;
