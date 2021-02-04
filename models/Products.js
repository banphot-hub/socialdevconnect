const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  productcode: {
    type: String,
    required: false,
  },
  Productcategory: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "productcategory",
  },
  productdescription: {
    type: String,
    required: false,
  },
  sellprice: {
    type: Number,
    default: 0,
    required: false,
  },
  costprice: {
    type: Number,
    default: 0,
  },
  productdimession: {
    type: String,
    required: false,
  },
  productunit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "productunit",
  },
  productimage: {
    type: String,
    required: false,
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
