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
    required: true,
  },
  Productcategory: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "productcategory",
  },
  productDescription: {
    type: String,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  productDimession: {
    type: String,
    required: false,
  },
  productUnit: {
    type: mongoose.SchemaType.ObjectId,
    ref: "productunit",
  },
  supplier: [
    {
      supplier: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "supplier",
      },
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
