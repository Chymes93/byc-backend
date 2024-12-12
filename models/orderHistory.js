const mongoose = require('mongoose');
const Joi = require('joi');


const orderHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: Date.now
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
            type: Object,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        required: true
    },
    deliveryStatus: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
})

const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

function validateOrderHistory(orderHistory) {
    const schema = {
        userId: Joi.string().required(),
        orderId: Joi.string().required(),
        orderDate: Joi.date(),
        deliveryDate: Joi.date(),
        items: Joi.array().items(Joi.object({
            productId: Joi.string().required(),
            productName: Joi.string().min(1).required(),
            price: Joi.number().min(0).required(),
            quantity: Joi.number().required(),
            totalPrice: Joi.number().required(),
            attributes: Joi.object()
        })),
        totalAmount: Joi.number().min(0).required(),
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            postalCode: Joi.string().required(),
            country: Joi.string().required()
        }).required(),
        deliveryStatus: Joi.string().required(),
        paymentStatus: Joi.string().valid('pending', 'completed', 'failed')  
    };

    return Joi.validate(orderHistory, schema)
}


exports.OrderHistory = OrderHistory;
exports.validate = validateOrderHistory;










