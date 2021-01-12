const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: String
})

productSchema.method('toClient', function() {
    const obj = this.cart.toObject()

    obj.id = obj._id
    delete obj._id

    return obj
})

module.exports = model('Product', productSchema)