const express = require('express');
const router = express.Router();
const { Cart, validate } = require('../models/cart');
const auth = require('../middleware/auth');



router.get('/my-cart', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id, 
            status: 'active' 
        });
        
        if (!cart) return res.status(404).send('No active cart found.');
        res.send(cart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const cart = new Cart({
            userId: req.user._id,
            items: req.body.items,
            status: 'active'
        });

        await cart.save();
        res.status(201).send(cart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.post('/add-item', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id, 
            status: 'active' 
        });

        cart.items.push(req.body);
        cart.updatedAt = Date.now();
        await cart.save();
        
        res.send(cart);
    }   catch (error) {
            res.status(500).send('Internal Server Error');
        }
});


router.put('/update-quantity/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id, 
            status: 'active' 
        });

        if (!cart) return res.status(404).send('Cart not found');

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).send('Item not found in cart');

        item.quantity = req.body.quantity;
        item.totalPrice = item.price * req.body.quantity;
        cart.updatedAt = Date.now();

        await cart.save();
        res.send(cart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.delete('/remove-item/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id, 
            status: 'active' 
        });

        if (!cart) return res.status(404).send('Cart not found');

        cart.items = cart.items.filter(item => 
            item._id.toString() !== req.params.itemId
        );
        cart.updatedAt = Date.now();

        await cart.save();
        res.send(cart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


router.put('/status', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            userId: req.user._id, 
            status: 'active' 
        });

        if (!cart) return res.status(404).send('No active cart found');

        cart.status = req.body.status;
        cart.updatedAt = Date.now();
        
        await cart.save();
        res.send(cart);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;