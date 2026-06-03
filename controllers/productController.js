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

exports.addToCart = async (req, res)  => {
	try{
		if(!req.session.cart){
			req.session.cart = []
		}
		const productId = req.params.id
		const existingItem = req.session.cart.find(item => item.productId === productId)
		if(!existingItem){
			const result = await db.query('SELECT * FROM products WHERE id = $1', [productId])
			const product = result.rows[0]
			req.session.cart.push({ 
			  productId, 
			  name: product.name, 
			  price: product.price, 
			  quantity: 1 
			})
			console.log(req.session.cart)
			return res.redirect(`/products/${productId}`)
		}
		existingItem.quantity += 1
		res.redirect(`/products/${productId}`)

	}catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	}
}
