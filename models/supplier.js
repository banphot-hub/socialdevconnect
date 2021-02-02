const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const supplierSchema = new Schema({
  suppliername: {
    type: String,
    required: true,
  },
  suppleraddress: {
    type: String,
    required: true,
  },
  supplierprovince: {
    type: String,
    required: true,
  },
  supplierpostcode: {
    type: String,
    required: true,
  },
  suppliermobile: {
    type: String,
    required: true,
  },
  suppliertele: {
    type: String,
    required: true,
  },
  suplieremail: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Supplier = mongoose.model("supplier", supplierSchema);
