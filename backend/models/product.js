const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  category: { type: String, require: true },
  name: { type: String, require: true },
  brand: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: Number, require: true },
  sizes: [{ type: String, require: true }],
  colours: [{ type: String, require: true  }]
});

module.exports = mongoose.model('Product', productSchema);
