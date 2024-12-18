const mongoose = require('mongoose');
const Joi = require('joi');





const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})


const Category = mongoose.model('Category', categorySchema);



function validateCategory(category) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(category, schema)
}






exports.Category = Category;
exports.validate = validateCategory;
exports.categorySchema = categorySchema;