const db = require('../db/db');

// Fetch all products from the database and render the home page
exports.getProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.render('index', { products: result.rows, user: req.session.userId || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Fetch a single product by ID from the URL params and render the product page
exports.getProductById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    res.render('product', { product: result.rows[0], user: req.session.userId || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Add a product to the session cart
// If cart doesn't exist yet, create it as an empty array
// If product is already in the cart, increment the quantity
// If it's a new product, fetch its details from DB and push to cart
exports.addToCart = async (req, res) => {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }

    const productId    = req.params.id;
    const existingItem = req.session.cart.find(item => item.productId === productId);

    if (!existingItem) {
      // Product not in cart — fetch details from DB and add it
      const result  = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
      const product = result.rows[0];
      req.session.cart.push({
        productId,
        name:     product.name,
        price:    product.price,
        quantity: 1
      });
      return res.redirect(`/products/${productId}`);
    }

    // Product already in cart — just increase the quantity
    existingItem.quantity += 1;
    res.redirect(`/products/${productId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
