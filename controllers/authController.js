const db = require('../db/db')
const bcrypt = require('bcrypt')


exports.getRegister = (req, res) => {
  res.render('register')
}

exports.postRegister = async (req, res) => {
  try {
    const {username , email , password, confirmPassword} = req.body

    if (!username || !email || !password || !confirmPassword){
      return res.status(400).json({ error: "All field are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "password doesn't match" });
    }

    const result = await db.query('SELECT username, email FROM users WHERE username = $1 OR email = $2',[username, email])
    if (result.rows.length > 0){
      return res.status(400).json({ error: "user already exist" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hashedPassword])
    res.redirect('/login');
  } catch (error) {
     console.error(error)
     return res.status(500).json({ error: 'Server error' })
  }
}