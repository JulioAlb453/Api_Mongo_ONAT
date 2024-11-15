const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
 nombreProducto: { type: String, required: true },
 cantidad: { type: String, required: true, unique: true },
 precio: { type: String, required: true },
 tipo: { type: String, required: true },
}, {
  collection: 'products' 
});

module.exports = mongoose.model('products', productsSchema);
