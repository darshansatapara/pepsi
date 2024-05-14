// Import required modules
const express = require("express");
const router = express.Router();

const Customer = require("../models/AddCustomerModel");

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

    await newCustomer.save();

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
//update the customer
router.put("/updateCustomer/:customerID/:_id", async (req, res) => {
  const _id = req.params._id;
  const customerID = req.params.customerID;
  const { customerName, mobileNumber, city, address, pincode } = req.body;

  try {
    // Find the customer by ID
    const customer = await Customer.findOneAndUpdate(
      {
        _id,
        customerID: customerID,
      },
      {
        // Update customer data
        customerName,
        mobileNumber,
        city,
        address,  
        pincode,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Save the updated customer data

    res.json({ message: "Customer data updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer data:", error);
    res.status(500).json({ error: "Internal server error" });
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
