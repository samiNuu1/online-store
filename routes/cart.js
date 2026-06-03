const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/cart',authMiddleware, cartController.getCart)
module.exports = router