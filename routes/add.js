const { Router } = require('express')
const Product = require('../models/product')
const routes = require('../middlewares/routes')
const { validationResult } = require('express-validator')
const { productValidation } = require('../utils/validation')

const router = Router()

router.get('/', routes, (req, res) => {
    res.render('add', {
        isAdd: true,
        title: 'Add goods'
    })
})

router.post('/', routes, productValidation, async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) return res.status(400).redirect('/goods')

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