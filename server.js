// Load environment variables from .env file before anything else
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT;

// Parse incoming form data and JSON from requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files (CSS, images, JS) from the public folder
app.use(express.static('public'));

// Set EJS as the templating engine for rendering views
app.set('view engine', 'ejs');

// Session middleware — keeps users logged in between requests
// Secret is used to sign the session cookie to prevent tampering
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,           // Don't save session if nothing changed
  saveUninitialized: false // Don't save empty sessions
}));

// Route files
const authRoutes    = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');
const orderRoutes   = require('./routes/orders');

app.use('/', authRoutes);
app.use('/', productsRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
