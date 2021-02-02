const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productCategorySchema = new Schema({
  categoryname: {
    type: String,
    required: true,
  },
  categorydescription: {
    type: String,
    required: false,
  },
  categoryimage: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Productcategory = mongoose.model(
  "productcategory",
  productCategorySchema
);
