const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customerId: { type: String, require: true },
  orderDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, require: true },
  deliveryFee: {type: Number, default: 4.99},
  products: [{
    category: { type: String, require: true },
    name: { type: String, require: true },
    brand: { type: String, require: true },
    quantity: { type: Number, require: true },
    price: { type: Number, require: true },
    sizes: { type: String, require: true },
    colours: { type: String, require: true  }
  }]
});

module.exports = mongoose.model('Order', orderSchema);
