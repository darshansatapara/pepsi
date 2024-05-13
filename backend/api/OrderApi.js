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
      paymentStatus,
    } = req.body;

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
      paymentStatus,
    });

    // Save the new order to the database
    await order.save();
    console.log(totalAmount);
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
    // console.log("oreder recive");
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

// fatch all Orders By CustomerID
router.get("/byCustomerId/:customerID", async (req, res) => {
  try {
    const customerID = req.params.customerID;
    // console.log(customerID);
    const orders = await Order.find({ customerID: customerID });
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "No orders found for this customer" });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to update order details
router.put("/updateOrder/:orderId/:_id", async (req, res) => {
  console.log("request to update order");
  const orderId = req.params.orderId;
  const _id = req.params._id; // Assuming _id is the MongoDB ObjectId

  const {
    redPepsiQuantity,
    blackPepsiQuantity,
    yellowPepsiQuantity,
    paymentStatus,
    totalAmount,
  } = req.body;

  try {
    // Update the order using both orderId and _id
    const updatedOrder = await Order.findOneAndUpdate(
      { _id, orderID: orderId }, // Find the order by both _id and orderID
      {
        redPepsiQuantity,
        blackPepsiQuantity,
        yellowPepsiQuantity,
        paymentStatus,
        totalAmount,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
    console.log(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//Delete order
router.delete("/deleteOrder/:orderID", async (req, res) => {
  const orderID = req.params.orderID;

  try {
    // Find the order by orderID and delete it
    const deletedOrder = await Order.findOneAndDelete({ orderID: orderID });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// calculate the product Ammount
router.post("/calculateTotalAmount", async (req, res) => {
  try {
    const { redPepsiQuantity, blackPepsiQuantity, yellowPepsiQuantity } =
      req.body;
    // console.log(req.body);

    const redPrice = 5;
    const blackPrice = 15;
    const yellowPrice = 20; // Set the price of Yellow Pepsi

    // Calculate total amount based on quantities and prices
    const totalAmount =
      redPepsiQuantity * redPrice +
      blackPepsiQuantity * blackPrice +
      yellowPepsiQuantity * yellowPrice;

    // Send the calculated total amount in the response
    res.status(200).json({ totalAmount });
    // console.log(totalAmount);
  } catch (error) {
    console.error("Error calculating total amount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
