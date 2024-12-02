const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    eventId:[{ type: mongoose.Schema.Types.ObjectId, ref: "events", required: true }],
    producto: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombreProducto:{type: mongoose.Schema.Types.String, ref: 'Producto'},
    precioBase: {type: mongoose.Schema.Types.Number},
    cantidad: { type: Number, required: true }
  }],
    orgId: { type: String, required: true },
  },
  {
    collection: "post",
  }
);

module.exports = mongoose.model("post", postSchema);

