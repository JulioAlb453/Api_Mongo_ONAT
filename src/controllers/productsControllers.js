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
    const { nombreProducto, precioBase } = req.body;

    const newProduct = new Product({
      nombreProducto,
      precioBase,
    });

    const result = await newProduct.save();
    res.status(200).json({
      message: "producto creado exitosamente",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params._id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID de producto no válido" });
  }

  try {
    const producto = await Product.findById(productId);
    if (!producto) {
      return res.status(404).json({ message: "producto no encontrado" });
    }
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err)
  }
};

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
    const updatedEvent = await Product.findByIdAndUpdate(productId, req.body, {
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

exports.calcularPrecioTotal = async (req, res) => {
  const { productsIds, cantidades } = req.body;

  try {
    if (!Array.isArray(productsIds) || productsIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Se requiere al menos un producto" });
    }

    if (productsIds.length > 3) {
      return res
        .status(400)
        .json({ message: "No puedes seleccionar más de 3 productos" });
    }

    if (
      !Array.isArray(cantidades) ||
      cantidades.length !== productsIds.length
    ) {
      return res
        .status(400)
        .json({ menssage: "Las cantidades deben coincidir con los productos" });
    }

      cantidades.forEach(cantidad => {
      if (cantidad < 1 || cantidad > 3) {
        return res.status(400).json({ message: "La cantidad debe estar entre 1 y 3" });
      }
    });

    const productsObjectIds = productsIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const productos = await mongoose.model("products").find({
      _id: { $in: productsObjectIds },
    });

    if (productos.length !== productsIds) {
      return res
        .status(404)
        .json({ message: "Uno o más productos no existen" });
    }

    let precioTotal = 0;
    productos.forEach((producto, index) => {
      const cantidad = cantidades[index];

      if (cantidad <= 0) {
        throw new Error(
          ` La cantidad para el producto ${producto.nombreProducto} debe ser mayor que o`
        );
      }
      precioTotal += producto.precioBase * cantidad;
    });

    res.status(400).json({
      message: "Precio total calculado exitosamente",
      precioTotal,
    });
  } catch (err) {
    console.error("Error al calcular el precio total", err);
    res.status(500).json({ menssage: err.menssage });
  }
};
