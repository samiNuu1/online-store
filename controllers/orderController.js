const db = require('../db/db')

exports.postCheckout = async (req, res) => {
	try{
		let cart = req.session.cart
		if(!cart || cart.length === 0){
			return res.status(400).json({ error: "Cart is empty" });
		}
		const result = await db.query('INSERT INTO orders (user_id) VALUES ($1) RETURNING id', [req.session.userId])
		const orderId = result.rows[0].id

		for(const item of cart){
		    await db.query('INSERT INTO order_items (order_id, product_id, name, quantity, price) VALUES ($1,$2,$3,$4,$5)',
		        [orderId, item.productId, item.name, item.quantity, item.price])
		}

		req.session.cart = []

		res.redirect(`/order/${orderId}`)

	} catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	}
}


exports.getOrder = async (req, res) => {
	try{
		const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id])
		const order = orderResult.rows[0]

		const itemsResult = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id])
		const orderItems = itemsResult.rows
		
		res.render('confirmation', { order, orderItems })
	} catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	}
}

exports.getOrders = async (req, res) => {
	try{
		const ordersResult = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.session.userId])
		const orders = ordersResult.rows
		res.render('orders', { orders })
	} catch (error){
		console.error(error)
		return res.status(500).json({ error: 'Server error' })
	}
}