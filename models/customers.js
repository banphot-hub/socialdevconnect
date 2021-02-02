const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const customerSchem = new Schema({
  custname: {
    type: String,
    required: true,
  },
  custaddress: {
    type: String,
    required: true,
  },
  custprovince: {
    type: String,
    required: true,
  },
  custpostcode: {
    type: String,
  },
  custmobile: {
    type: String,
    required: true,
  },
  custemail: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Customers = mongoose.model("customers", customerSchem);
