const mongoose = require('mongoose');
const express = require('express');
const productRoute = require('./routes/products');
const categoryRoute = require('./routes/categories');
const customerRoute = require('./routes/customers');
const userRoute = require('./routes/users');
const login = require('./routes/auth');
const orderHistoryRoute = require('./routes/orderHistories');
const cartRoute = require('./routes/carts');
const app = express();








mongoose.connect('mongodb://localhost/byc')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Could not connect to MongoDB'));



app.use(express.json());
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/customers', customerRoute);
app.use('/api/register', userRoute);
app.use('/api/auth', login);
app.use('/api/ordersHistories', orderHistoryRoute);
app.use('/api/carts', cartRoute)



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port port ${port}`));