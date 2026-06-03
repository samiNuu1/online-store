const db = require('../db/db')


exports.getProducts = async (req, res) => {
	try {
	  const result = await db.query('SELECT * FROM products')
	  res.render('index', { products: result.rows })
	} catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	} 
}

exports.getProductById = async (req, res) => {
	try{
		const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id])
		res.render('product', { product: result.rows[0] })
	} catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	}
}

