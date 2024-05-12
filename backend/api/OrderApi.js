// Import required modules
const express = require("express");
const router = express.Router();
const Order = require("../models/AddNewOrderModel");

// Add new order api
router.post("/addNewOrder", async (req, res) => {
  try {
    console.log("received");
    const lastOrder = await Order.findOne()
      .sort({ orderID: -1 })
      .maxTimeMS(10000);

    // Increment the last customerID by 1 to get the new customerID
    const newOrderID = lastOrder ? lastOrder.orderID + 1 : 1;
    // Generate the order ID
    const orderID = newOrderID;

    // Extract order data from request body
    const {
      mobileNumber,
      customerID,
      customerName,
      orderDate,
      redPepsiQuantity,
      blackPepsiQuantity,
      yellowPepsiQuantity,
      totalAmount,
      paymentStatus
    } = req.body;

    // Create a new order instance with the generated order ID
    const order = new Order({
      orderID,
      mobileNumber,
      customerID,
      customerName,
      orderDate,
      redPepsiQuantity,
      blackPepsiQuantity,
      yellowPepsiQuantity,
      totalAmount,
      paymentStatus
    });

    // Save the new order to the database
    await order.save();

    // Send success response
    res.status(201).json({ message: "Order added successfully.", order });
  } catch (error) {
    console.error("Error adding new order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get the all orders
router.get("/getAllOrders", async (req, res) => {
  try {
    console.log("oreder recive");
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fatch all Orders By CustomerID
router.get("/byCustomerId/:fatchOrderByCustomerID", async (req, res) => {
  try {
    const fatchOrderByCustomerID = parseInt(req.params.customerId);
    const orders = await Order.find({ customerId: fatchOrderByCustomerID });
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

// find order by the orderID
router.get("/byOrderId/:fatchOrderByOrderID", async (req, res) => {
  try {
    const fatchOrderByOrderID = parseInt(req.params.orderID);
    const orders = await Order.find({ orderID: fatchOrderByOrderID });
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
