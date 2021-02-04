const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceiveSchema = new mongoose({
  recnumber: {
    type: String,
    required: true,
  },
  recdate: {
    type: Number,
    default: 0,
  },
  //cashier
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  orderitem: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
      },
      qty: {
        type: Number,
        default: 0,
      },
      costprice: {
        type: Number,
        default: 0,
      },
      totalamount: {
        type: Number,
        default: 0,
      },
    },
  ],
  tottrans: {
    type: Number,
    default: 0,
  },
  totalitem: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  grandtotal: {
    type: Number,
    default: 0,
  },
  date: {
    type: date,
    default: Date.now,
  },
});

module.exports = Receive = mongoose.model("receive", ReceiveSchema);
