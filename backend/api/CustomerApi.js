// Import required modules
const express = require("express");
const router = express.Router();
const Customer = require("../models/AddCustomerModel"); 

// POST route to add a new customer
router.post("/addnewCustomer", async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne()
      .sort({ customerID: -1 })
      .maxTimeMS(10000);

    // Increment the last customerID by 1 to get the new customerID
    const newCustomerID = lastCustomer ? lastCustomer.customerID + 1 : 1;

    const { customerName, mobileNumber, city, address, pincode } = req.body;

    const newCustomer = new Customer({
      customerID: newCustomerID,
      customerName,
      mobileNumber,
      city,
      address,
      pincode,
    });
    console.log(newCustomer);

    await newCustomer.save();

    res
      .status(201)
      .json({ message: "Customer added successfully.", customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all customers to show in CustomerDetailPage
router.get("/allcustomers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// we can find the customers using mobileNumber or CustomerId
router.get("/getCustomer/:fatchby", async (req, res) => {
  try {
    const fatchby = req.params.fatchby;
    let customer;

    // If findby is numeric and has length 10, then user entered mobile number
    if (!isNaN(fatchby) && fatchby.length === 10) {
      customer = await Customer.findOne({ mobileNumber: fatchby });
    } else {
      // Otherwise, assume it's a customer ID
      const customerId = parseInt(fatchby);
      customer = await Customer.findOne({ customerID: customerId });
    }

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
