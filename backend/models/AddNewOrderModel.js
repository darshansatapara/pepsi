// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderID: { type: Number, required: true },
  mobileNumber: { type: Number, required: true },
  customerID: { type: Number, required: true },
  customerName: { type: String, required: true },
  orderDate: { type: Date, required: true },
  redPepsiQuantity: { type: Number, default: 0 },
  blackPepsiQuantity: { type: Number, default: 0 },
  yellowPepsiQuantity: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, require: true },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
