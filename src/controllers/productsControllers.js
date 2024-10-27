const { getDB } = require("../../config");
const { ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const collection_name = "Productos";

exports.getProducts = async (req, res) => {
  try {
    const db = getDB();
    const event = await db.collection(collection_name).find().toArray();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createProduct = async (req, res) => {
    const newEvent = {
      nombreProducto: req.body.nombreProducto,
      cantidad: req.body.cantidad,
      precio: req.body.precio,
      tipo: req.body.tipo,
    };
  
    try {
      const db = getDB();
      const result = await db.collection(collection_name).insertOne(newEvent);
      res.status(201).json({
        message: "Producto creado exitosamente",
        productId: result.insertedId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID de producto no válido" });
  }
  try {
    const db = getDB();
    const user = await db
      .collection(collection_name)
      .findOne({ _id: new ObjectId(productId) });
    if (!user) {
      return res.status(404).json({ message: "producto no encontrado" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID de producto no válido" });
  }
  try {
    const db = getDB();
    const result = await db
      .collection(collection_name)
      .deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "producto no encontrado" });
    }
    res.json({ message: "producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

