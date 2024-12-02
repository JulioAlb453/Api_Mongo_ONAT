const mongoose = require("mongoose");
const dotenv = require("dotenv");
const post = require("../models/postModel");
const { Client } = require("pg");
// const products = require("../models/productsModel");

dotenv.config();

const pgClient = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // ssl: {
  //   rejectUnauthorized: false, // Asegúrate de usar el certificado adecuado
  // },
});

pgClient.connect();

exports.createPost = async (req, res) => {
  const orgId = req.body.orgId;
  const productosIds = req.body.productosIds;
  const eventId = req.body.eventId;
  const cantidad = req.body;
  try {
    if (
      !Array.isArray(productosIds) ||
      productosIds.length === 0 ||
      eventId === 0
    ) {
      return res
        .status(400)
        .json({ message: "Se requiere al menos un producto" });
    }

    if (!orgId) {
      return res
        .status(400)
        .json({ message: "ID de la organización no es válido o está ausente" });
    }

    if (!cantidad) {
      return res.status(400).json({
        message: "Se requiere una unidad minima",
      });
    }

    const productosObjectIds = productosIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const newPost = new post({
      producto: productosObjectIds,
      orgId,
      eventId,
      cantidad
    });

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

exports.obtenerPostPorId = async (req, res) => {
  const eventId = new mongoose.Types.ObjectId(req.params._id);
  try {
    if (!eventId) {
      return res
        .status(400)
        .json({ mensssage: "Id del post no es valido o esta ausente" });
    }

    const posts = await post.find({ eventId: eventId }).populate("producto");
    if (posts === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos para este post" });
    }

    res.status(200).json({
      message: "Posts encontrados",
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByOrganizationId = async (req, res) => {
  const orgId = req.params._id;

  try {
    const orgQuery = 'Select * From "Onat".organizations WHERE id = $1';
    const orgResult = await pgClient.query(orgQuery, [orgId]);
    const orgData = orgResult.rows[0];
    if (!orgData) {
      return res.status(404).json({ message: "Organización no encontrada" });
    }

    const posts = await post.find({ orgId: orgId }).populate("producto");
    orgData.posts = posts;

    if (orgData.posts === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron posts para esta organización" });
    }

    res.status(200).json({
      message: "Posts encontrados",
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { productosIds, orgId } = req.body;

  try {
    // Validar que existan datos para actualizar
    if (!productosIds && !orgId) {
      return res.status(400).json({
        message: "Se requiere al menos un campo para actualizar el post",
      });
    }

    // Validar productosIds si está presente
    let productosObjectIds = [];
    if (productosIds) {
      if (!Array.isArray(productosIds) || productosIds.length === 0) {
        return res.status(400).json({
          message: "Se requiere al menos un producto válido para actualizar",
        });
      }
      productosObjectIds = productosIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }

    // Actualizar el post
    const updatedPost = await post
      .findByIdAndUpdate(
        postId,
        {
          ...(productosIds && { producto: productosObjectIds }),
          ...(orgId && { orgId }),
        },
        { new: true }
      )
      .populate("producto");

    if (!updatedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.status(200).json({
      message: "Post actualizado exitosamente",
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error al actualizar el post:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.status(200).json({
      message: "Post eliminado exitosamente",
      post: deletedPost,
    });
  } catch (err) {
    console.error("Error al eliminar el post:", err);
    res.status(500).json({ message: err.message });
  }
};
