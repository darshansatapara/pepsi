// Import required modules
const express = require("express");
const router = express.Router();
const Order = require("../models/AddNewOrderModel");

// POST route to add a new customer
router.get("/byCustomerId/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await Order.find({ customerId: customerId });
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.status(404).json({ message: "No orders found for this customer" });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
module.exports = router;
