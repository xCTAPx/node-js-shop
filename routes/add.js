const {Router} = require('express')
const Product = require('../models/product')
const routes = require('../middlewares/routes')

const router = Router()

router.get('/', routes, (req, res) => {
    res.render('add', {
        isAdd: true,
        title: 'Add goods'
    })
})

router.post('/', routes, async (req, res) => {
    try {
        const {name, description, price, image} = req.body
        const product = new Product({
            name, 
            description, 
            price, 
            image, 
            userId: req.user._id
        })

        await product.save()
        res.redirect('/goods')
    } catch (e) {
        throw new Error(e)
    }
})

module.exports = router