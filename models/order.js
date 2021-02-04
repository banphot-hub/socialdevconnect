const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  @Model      Order
//  @desc       Order receive for pos of sales
//  @access     private

const OrderSchema = new Schema({
  invnumber: {
    type: String,
    required: true,
  },
  invdate: {
    type: date,
    default: Date.now,
  },
  vatetype: {
    type: Boolean,
    default: false,
  },
  vatecharge: {
    type: Number,
    default: 7,
  },
  remark: {
    type: String,
    required: false,
  },
  //cashier
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  //mode of payment
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: "paymentmethod",
  },
  // payment status Ture paid, False not paid
  paymentstatus: {
    type: Boolean,
    default: false,
  },
  duedate: {
    type: date,
    default: Date.now,
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
      price: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      totaldiscount: {
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
  totalvat: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totaldiscount: {
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

module.exports = Order = mongoose.model("orders", OrderSchema);
