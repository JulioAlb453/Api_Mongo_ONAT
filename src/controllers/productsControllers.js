const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productsModel");

dotenv.config();

exports.getProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const { nombreProducto, precioBase} = req.body;

    const newProduct = new Product({
      nombreProducto,
      precioBase,
    });

    const result = await newProduct.save();
    console.log(result)
    res.status(200).json({
      message: "producto creado exitosamente",
    });
  } catch (err) {
    res.status(500).json({ mesaage: err.message });
  }
};

// exports.getProductById = async (req, res) => {
//   const productId = req.params.id;

//   if (!mongoose.Types.ObjectId.isValid(productId)) {
//     res.status(400).json({ mesaage: "Id del producto no valido" });
//   }

//   try {
//     const product = await Product.findById(productId);
//     if (!product) {
//       res.status(404).json({ message: "evento no encontrado" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: err.mesaage });
//   }
// };

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({ message: "ID de producto no valido" });
  }

  try {
    const result = await Product.findOneAndDelete(productId);
    if (!result) {
      res.status(404).json({ message: "producto no encontrado" });
    }
    res.json({ message: "producto eliminado" });
  } catch (error) {
    res.status(500).json({ menssage: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID de producto no válido" });
  }

  try {
    const updatedEvent = await Evento.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "producto no encontrado" });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
