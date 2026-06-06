const db     = require('../db/db');
const bcrypt = require('bcrypt');

// Render the registration page
exports.getRegister = (req, res) => {
  res.render('register', { user: req.session.userId || null });
};

// Handle registration form submission
// Validates input, checks for existing users, hashes password, inserts into DB
exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check all fields are filled
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check if username or email is already taken
    const result = await db.query(
      'SELECT username, email FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password before storing it — never store plain text passwords
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Render the login page
exports.getLogin = (req, res) => {
  res.render('login', { user: req.session.userId || null });
};

// Handle login form submission
// Validates input, checks user exists, compares password, saves userId to session
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields are filled
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Look up user by email
    const result = await db.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare submitted password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Save user ID to session — this is how the app knows the user is logged in
    req.session.userId = user.id;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Handle logout — destroys the session and redirects to login
exports.postLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
