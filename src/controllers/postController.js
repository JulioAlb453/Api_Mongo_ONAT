const mongoose = require("mongoose");
const dotenv = require("dotenv");
const post = require("../models/postModel"); // Asegúrate de que este archivo exporte tu esquema de Mongoose
const { Client } = require("pg");
const products = require("../models/productsModel");

dotenv.config();

const pgClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgClient.connect();

exports.createPost = async (req, res) => {
  const orgId = req.body.idOrg;
  const productosIds = req.body.productosIds;

  try {
    if (!Array.isArray(productosIds) || productosIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Se requiere al menos un producto" });
    }

    if (!orgId) {
      return res
        .status(400)
        .json({ message: "ID de la organización no es válido o está ausente" });
    }

    const productosObjectIds = productosIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    console.log("Productos convertidos a ObjectId:", productosObjectIds);

    // Validación de fechaPublicacion
    const { fechaPublicacion } = req.body;
    if (!fechaPublicacion) {
      return res
        .status(400)
        .json({ message: "La fecha de publicación es requerida" });
    }

    // Crear un nuevo post
    const newPost = new post({
      fechaPublicacion,
      producto: productosObjectIds,
      orgId,
    });

    console.log("Nuevo post creado:", newPost);

    // Guardar en la base de datos
    const result = await newPost.save();
    
    const populatedPost = await post.findById(result._id).populate("producto");

    res.status(200).json({
      message: "Post creado exitosamente",
      post: populatedPost,
    });
  } catch (err) {
    console.error("Error al crear el post:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByOrganizationId = async (req, res) => {
  const orgId = req.params.id;

  try {
    // Verifica si la organización existe en PostgreSQL
    const orgQuery = 'Select * From "Onat".organizations WHERE id = $1';
    const orgResult = await pgClient.query(orgQuery, [orgId]);
    const orgData = orgResult.rows[0]
    if (!orgData) {
      return res.status(404).json({ message: "Organización no encontrada" });
    }

    // Consulta los posts relacionados con la organización en MongoDB
    const posts = await post.find({ orgId : orgId }).populate('producto')
    orgData.posts = posts

    if (orgData.posts === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron posts para esta organización" });
    }

    // Devuelve los posts encontrados
    res.status(200).json({
      message: "Posts encontrados",
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
