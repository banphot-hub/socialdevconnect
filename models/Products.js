const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: false,
  },
  Productcategory: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "productcategory",
  },
  productDescription: {
    type: String,
    required: false,
  },
  sellPrice: {
    type: Number,
    default: 0,
    required: false,
  },
  productDimession: {
    type: String,
    required: false,
  },
  productUnit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "productunit",
  },

  supplier: [
    {
      supplier: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "supplier",
      },
      required: false,
    },
  ],
  totalstock: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Products = mongoose.model("products", productSchema);
