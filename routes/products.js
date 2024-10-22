const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res ) => {
    const product = await Product.find().sort('name');
    res.send(product);
})


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId)
    if (!category) return res.status(404).send('Invalid category id.');

    let product = new Product({
        name: req.body.name,
        category: {
            _id: category._id,
            name: category.name, 
        },
        price: req.body.price,
        image: req.body.image,
        inStock: req.body.inStock,
        description: req.body.description,
    })

    product = await product.save();
    res.send(product);
})





































module.exports = router;