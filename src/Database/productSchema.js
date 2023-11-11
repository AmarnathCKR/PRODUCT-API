const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    category : String,
    description : String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
