// Import required modules
const express = require("express");
const router = express.Router();
const Customer = require("../models/AddCustomerModel"); // Assuming your model is defined in Customer.js

// POST route to add a new customer
router.post("/addnewCustomer", async (req, res) => {
  try {
    console.log("data received");
    // Fetch the last customer from the database to get the last customerID
    const lastCustomer = await Customer.findOne()
      .sort({ customerID: -1 })
      .maxTimeMS(10000);

    // Increment the last customerID by 1 to get the new customerID
    const newCustomerID = lastCustomer ? lastCustomer.customerID + 1 : 1;

    // data from request body
    const { customerName, mobileNumber, city, address, pincode } = req.body;

    // Create a new customer instance with the new customerID
    const newCustomer = new Customer({
      customerID: newCustomerID,
      customerName,
      mobileNumber,
      city,
      address,
      pincode,
    });
    console.log(newCustomer);
    // Save the new customer to the database
    await newCustomer.save();

    // Send success response
    res
      .status(201)
      .json({ message: "Customer added successfully.", customer: newCustomer });
  } catch (error) {
    // If any error occurs, send error response
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all customers to show in CustomerDetailPage
router.get("/allcustomers", async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();
    res.json(customers); // Send the fetched customers as JSON response
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getCustomer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const customer = await Customer.findOne({ customerID: customerId });
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
module.exports = router;
