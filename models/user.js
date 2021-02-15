const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ]
    }
})

userSchema.methods.addToCart = async function(product) {
    const items = this.cart.items.slice()

    const index = items.findIndex(item => item.productId.toString() === product._id.toString())

    if(index < 0) {
        items.push({productId: product._id, count: 1})
    } else {
        items[index].count++
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.deleteFromCart = function(id) {
    let items = this.cart.items.slice()

    const index = items.findIndex(item => item.productId.toString() === id)

    if(items[index].count > 1) {
        items[index].count--
    } else {
        items = items.filter(item => item.productId.toString() !== id)
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart.items = []

    return this.save()
}

module.exports = model('User', userSchema)