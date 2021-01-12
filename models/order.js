const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: String
    },
    order: {
        products: [
            {
                product: {
                    type: Object
                },
                count: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: new Date
        }
    }
})

module.exports = model('Order', orderSchema)