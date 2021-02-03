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
    required: false,
  },
  supplierprovince: {
    type: String,
    required: false,
  },
  supplierpostcode: {
    type: String,
    required: false,
  },
  suppliermobile: {
    type: String,
    required: false,
  },
  suppliertele: {
    type: String,
    required: false,
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
