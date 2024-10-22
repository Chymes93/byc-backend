const mongoose = require('mongoose');
const Joi = require('joi');
const { categorySchema } = require('./category');





const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    category: {
        type: categorySchema,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    inStock: {
        type: Number,
        required: true,
        min: 0
    }
})





const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        categoryId: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string(),
        description: Joi.string().max(500),
        inStock: Joi.number().min(0).required()
    };

    return Joi.validate(product, schema)
}




exports.Product = Product;
exports.validate = validateProduct;