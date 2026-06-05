
function getSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}


exports.getCart = (req, res) => {
  const cart = req.session.cart || []
  const total = getSubtotal(cart)
  res.render('cart', { cart, total })
}

