const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router()

router.get('/', async (req, res ) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
        address: req.body.address,
    })

    customer = await customer.save();
    res.send(customer);
})






router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
        address: req.body.address
    }, {
        new: true
    })
    if (!customer) return res.status(400).send('Customer with the given id not found');
    res.send(customer);
})


router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(400).send('Customer with the given id not found');
    res.send(customer);
})




































module.exports = router;