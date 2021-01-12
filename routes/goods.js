const {Router} = require('express')
const Product = require('../models/product')

const router = Router()

router.get('/', async (req, res) => {
    try {
            const goods = await Product.find()
            res.render('goods', {
            isGoods: true,
            title: 'Goods',
            goods
        })
    } catch (e) {
        throw new Error(e)
    }
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('product', {
        product
    })
})

router.get('/:id/edit', async (req, res) => {
    const {allow} = req.query
    if(allow !== 'true') return res.redirect('/')

    const product = await Product.findById(req.params.id)
    res.render('edit', {
        product
    })
})

router.post('/edit', async (req, res) => {
    await Product.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/goods')
})
 
router.post('/delete', async (req, res) => {
    const cartItems = await req.user.cart.items
    const idx = cartItems.findIndex(item => item.productId.toString() === req.body.id)

    if(idx < 0) {
      await Product.deleteOne({_id: req.body.id})
    }
    
    res.redirect('/goods')
})

module.exports = router