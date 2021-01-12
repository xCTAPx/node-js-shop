const {Router} = require('express')
const Order = require('../models/order')

const router = new Router()

const computeTotal = goods => goods.reduce((total, item) => total += item.price, 0)

const mapGoods = cart => cart.items.map(item => ({
    product: {...item.productId._doc}, 
    count: item.count, 
    price: item.productId._doc.price * item.count
}))

router.get('/', async (req, res) => {
    const orders = await Order.find({
        'user.userId': req.user._id
    })

    res.render('orders', {
        isOrders: true,
        orders
    })
})

router.post('/add', async (req, res) => {
    
    const customer = {
        name: req.user.name,
        email:req.user.email,
        userId: req.user._id
    }

    const cart = await req.user.cart
    .populate('items.productId', 'name price count')
    .execPopulate()

    const goods = mapGoods(cart)

    const total = computeTotal(goods)

    const order = new Order({
        user: customer,
        order: {
            products: goods,
            total
        }
    })

    await order.save()

    await req.user.clearCart()

    res.redirect('/orders')
})

module.exports = router