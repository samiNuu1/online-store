require('dotenv').config();
const express = require('express');
const session = require('express-session')
const app = express();
const port = process.env.PORT


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/products')
app.use('/', authRoutes)
app.use('/', productsRoutes)


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});