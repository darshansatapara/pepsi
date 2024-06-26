// models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerID: { type: Number, required: true, unique: true }, // Add customerID field
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true, maxlength: 10 },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true, maxlength: 6 },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
