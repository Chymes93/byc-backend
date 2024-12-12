const express = require('express');
const router = express.Router();
const { OrderHistory, validate } = require('../models/orderHistory');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Get all orders (with optional filtering)
router.get('/', auth, async (req, res) => {
    try {
        const filters = {};
        if (req.query.userId) filters.userId = req.query.userId;
        if (req.query.status) filters.status = req.query.status;

        const orders = await OrderHistory.find(filters)
            .sort('-orderDate')
            .populate('items.productId');
        res.send(orders);
    } catch (error) {
        res.status(500).send('Error fetching orders: ' + error.message);
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await OrderHistory.findById(req.params.id)
            .populate('items.productId');
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Error fetching order: ' + error.message);
    }
});

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const order = new OrderHistory(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(500).send('Error creating order: ' + error.message);
    }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).send('Invalid status');
        }

        const order = await OrderHistory.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Error updating order status: ' + error.message);
    }
});

// Update payment status
router.patch('/:id/payment', auth, async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
            return res.status(400).send('Invalid payment status');
        }

        const order = await OrderHistory.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        );
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Error updating payment status: ' + error.message);
    }
});

// Update delivery status and date
router.patch('/:id/delivery', auth, async (req, res) => {
    try {
        const { deliveryStatus, deliveryDate } = req.body;
        const order = await OrderHistory.findByIdAndUpdate(
            req.params.id,
            { 
                deliveryStatus,
                ...(deliveryDate && { deliveryDate: new Date(deliveryDate) })
            },
            { new: true }
        );
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Error updating delivery status: ' + error.message);
    }
});

// Delete order (maybe restricted to admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await OrderHistory.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).send('Order not found');
        res.send(order);
    } catch (error) {
        res.status(500).send('Error deleting order: ' + error.message);
    }
});

module.exports = router;