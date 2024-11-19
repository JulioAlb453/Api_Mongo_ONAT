const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    nombreProducto: { type: String, required: true },
    precioBase: { type: Number, required: true },
  },
  {
    collection: "products",
  }
);

module.exports = mongoose.model("products", productsSchema);
