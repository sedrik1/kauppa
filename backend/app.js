
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/order');
const app = express();

mongoose
  .connect(
    'mongodb+srv://username:password@cluster0-fpifk.mongodb.net/database?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connection');
  })
  .catch(() => {
    console.log('Connection failed');
  });

mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

module.exports = app;
