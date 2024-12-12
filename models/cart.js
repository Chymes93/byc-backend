const mongoose = require('mongoose');
const Joi = require('joi');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        attributes: {
            type: Object
        },
        discount: {
            type: Number
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String
    }
})


const Cart = mongoose.model('Cart', cartSchema);

function validateCart(cart) {
    const schema = {
        userId: Joi.string().required(),
        items: Joi.array().items(Joi.object({
            productId: Joi.string().required(),
            productName: Joi.string().min(1).required(),
            price: Joi.number().min(0).required(),
            quantity: Joi.number().integer().min(1).required(),
            totalPrice: Joi.number().min(0).required(),
            attributes: Joi.object(),
            discount: Joi.number().min(0)
        })),
        status: Joi.string().valid('active', 'completed', 'abandoned')
    };
    
    return Joi.validate(cart, schema)
}

exports.Cart = Cart;
exports.validate = validateCart;




