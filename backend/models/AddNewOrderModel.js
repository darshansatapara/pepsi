// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  customerId: { type: Number, required: true },
  customerName: { type: String, required: true },
  orderDate: { type: Date, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  redPepsiQuantity: { type: Number, default: 0 }, // Quantity of Red Pepsi
  blackPepsiQuantity: { type: Number, default: 0 }, // Quantity of Black Pepsi
  yellowPepsiQuantity: { type: Number, default: 0 }, // Quantity of Yellow Pepsi
  totalAmount: { type: Number, required: true }, // Total amount of the order
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
