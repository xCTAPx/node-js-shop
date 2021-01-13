const {Router} = require('express')
const Product = require('../models/product')
const routes = require('../middlewares/routes')

const mapGoods = cart => cart.items.map(item => ({...item.productId._doc, id: item.productId.id, count: item.count}))

const computePrice = goods => goods.reduce((total, item) => total += item.price * item.count , 0)


const router = Router()

router.post('/add', routes, async (req, res) => {
    const product = await Product.findById(req.body.id)
    await req.user.addToCart(product)

    res.redirect('/cart')
})

router.get('/', routes, async (req, res) => {
    const cart = await req.user.cart
        .populate('items.productId')
        .execPopulate()

    const goods = mapGoods(cart)
    const total = computePrice(goods)

    res.render('cart', {
        isCart: true,
        goods,
        cost: total
    })
})

router.post('/remove', routes, async (req, res) => {
    await req.user.deleteFromCart(req.body.id)

    res.redirect('/cart')
})

module.exports = router