const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paymentmethod = new Schema({
  paymentname: {
    type: String,
    required: true,
  },
  date: {
    type: date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model("orders", OrderSchema);
