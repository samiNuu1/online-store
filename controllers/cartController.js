// Helper function — calculates the cart subtotal
// Loops through all items and multiplies price by quantity, then sums them up
function getSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Render the cart page
// Reads cart from session (defaults to empty array if no cart exists)
// Calculates and passes the subtotal to the view
exports.getCart = (req, res) => {
  const cart  = req.session.cart || [];
  const total = getSubtotal(cart);
  res.render('cart', { cart, total, user: req.session.userId || null });
};
