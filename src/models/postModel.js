const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    fechaPublicacion: { type: String, required: true },
    producto: [{ type: mongoose.Schema.Types.ObjectId, ref: "products", required: true }],
    orgId: { type: String, required: true },
  },
  {
    collection: "post",
  }
);

module.exports = mongoose.model("post", postSchema);

