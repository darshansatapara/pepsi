// Import required modules
const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const Customer = require("../models/AddCustomerModel"); 
=======
const Customer = require("../models/AddCustomerModel"); // Assuming your model is defined in Customer.js
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d

// POST route to add a new customer
router.post("/addnewCustomer", async (req, res) => {
  try {
<<<<<<< HEAD
=======
    console.log("data received");
    // Fetch the last customer from the database to get the last customerID
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
    const lastCustomer = await Customer.findOne()
      .sort({ customerID: -1 })
      .maxTimeMS(10000);

    // Increment the last customerID by 1 to get the new customerID
    const newCustomerID = lastCustomer ? lastCustomer.customerID + 1 : 1;

<<<<<<< HEAD
    const { customerName, mobileNumber, city, address, pincode } = req.body;

=======
    // data from request body
    const { customerName, mobileNumber, city, address, pincode } = req.body;

    // Create a new customer instance with the new customerID
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
    const newCustomer = new Customer({
      customerID: newCustomerID,
      customerName,
      mobileNumber,
      city,
      address,
      pincode,
    });
    console.log(newCustomer);
<<<<<<< HEAD

    await newCustomer.save();

=======
    // Save the new customer to the database
    await newCustomer.save();

    // Send success response
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
    res
      .status(201)
      .json({ message: "Customer added successfully.", customer: newCustomer });
  } catch (error) {
<<<<<<< HEAD
=======
    // If any error occurs, send error response
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all customers to show in CustomerDetailPage
router.get("/allcustomers", async (req, res) => {
  try {
<<<<<<< HEAD
    const customers = await Customer.find();
    res.json(customers);
=======
    // Fetch all customers from the database
    const customers = await Customer.find();
    res.json(customers); // Send the fetched customers as JSON response
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

<<<<<<< HEAD
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

=======
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
>>>>>>> ed1c452c31e5955f55201279ac32c3d21566a77d
module.exports = router;
