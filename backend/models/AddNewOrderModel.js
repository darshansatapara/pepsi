// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
