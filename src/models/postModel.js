const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    producto: [{ type: mongoose.Schema.Types.ObjectId, ref: "products", required: true }],
    orgId: { type: String, required: true },
  },
  {
    collection: "post",
  }
);

module.exports = mongoose.model("post", postSchema);

