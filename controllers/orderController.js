const db = require('../db/db');

// Handle checkout form submission
// Creates an order in the DB, saves each cart item as an order_item, clears the cart
exports.postCheckout = async (req, res) => {
  try {
    const cart = req.session.cart;

    // Reject checkout if cart is empty or doesn't exist
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Insert a new order for the logged in user — RETURNING id gives us the new order's UUID
    const result  = await db.query(
      'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
      [req.session.userId]
    );
    const orderId = result.rows[0].id;

    // Insert each cart item as a row in order_items linked to this order
    // Price is stored at checkout time so it doesn't change if the product price updates later
    for (const item of cart) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.productId, item.name, item.quantity, item.price]
      );
    }

    // Clear the cart from the session after successful checkout
    req.session.cart = [];

    res.redirect(`/order/${orderId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Fetch a single order and its items by order ID, render the confirmation page
exports.getOrder = async (req, res) => {
  try {
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );
    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id]
    );
    const orderItems = itemsResult.rows;

    res.render('confirmation', { order, orderItems, user: req.session.userId || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Fetch all orders for the logged in user, sorted newest first
exports.getOrders = async (req, res) => {
  try {
    const ordersResult = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.session.userId]
    );
    const orders = ordersResult.rows;
    res.render('orders', { orders, user: req.session.userId || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
