require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')

const authRoutes = require('./routes/auth')
app.use('/', authRoutes)


app.get('/', (req, res) => {
  res.render('index')
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});