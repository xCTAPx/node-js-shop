const {Router} = require('express')
const Product = require('../models/product')

const router = Router()

const checkEqual = (a, b) => a.toString() === b.toString()

router.get('/', async (req, res) => {
    try {
            const goods = await Product.find()
            res.render('goods', {
            isGoods: true,
            title: 'Goods',
            userId: req.user ? req.user._id : null,
            goods
        })
    } catch (e) {
        throw new Error(e)
    }
})

router.get('/:id/more', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.render('product', {
            product
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const {allow} = req.query

        if(allow !== 'true') return res.redirect('/')

        const product = await Product.findById(req.params.id)

        if(!checkEqual(req.user._id, product.userId)) {
            return res.redirect('/goods')
        }

        res.render('edit', {
            product,
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.body.id)

        if(!checkEqual(req.user._id, product.userId)) {
            return res.redirect('/goods')
        }

        await Product.findByIdAndUpdate(req.body.id, req.body)
        res.redirect('/goods')
    } catch (e) {
        console.log(e)
    }
})
 
router.post('/delete', async (req, res) => {
    try {
        const product = await Product.findById(req.body.id)

        if(!checkEqual(req.user._id, product.userId)) {
            return res.redirect('/goods')
        }

        const cartItems = await req.user.cart.items
        const idx = cartItems.findIndex(item => item.productId.toString() === req.body.id)

        if(idx < 0) {
        await Product.deleteOne({_id: req.body.id})
        }
        
        res.redirect('/goods')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router