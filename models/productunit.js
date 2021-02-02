const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productunitSchema = new Schema({
  unitname: {
    type: String,
    required: true,
  },
  unitshortname: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Productunit = mongoose.model("productunit", productunitSchema);
