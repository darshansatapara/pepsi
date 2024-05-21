// Import required modules
const express = require("express");
const router = express.Router();
const Order = require("../models/AddNewOrderModel");

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
// Add new order api
router.post("/addNewOrder", async (req, res, next) => {
  try {
    const lastOrder = await Order.findOne()
      .sort({ orderID: -1 })
      .maxTimeMS(10000);

    // Increment the last orderID by 1 to get the new orderID
    const newOrderID = lastOrder ? lastOrder.orderID + 1 : 1;
    const orderID = newOrderID;

    // Extract order data from request body
    const {
      mobileNumber,
      customerID,
      customerName,
      city,
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
      city,
      orderDate,
      redPepsiQuantity,
      blackPepsiQuantity,
      yellowPepsiQuantity,
      totalAmount,
      paymentStatus,
    });

    // Save the new order to the database
    await order.save();

    // Send success response
    res.status(201).json({ message: "Order added successfully.", order });
  } catch (error) {
    console.error("Error adding new order:", error);
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: "Internal Server Error" });
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
router.get("/bycustomerid/:customerID", async (req, res) => {
  try {
    const customerID = req.params.customerID;
    const orders = await Order.find({ customerID: customerID });
    const totalExpense = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    if (orders.length > 0) {
      res.status(200).json({ orders, totalExpense });
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
  
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/updateCustomerDetailsInOrder/:customerID", async (req, res) => {
  try {
    const customerID = req.params.customerID;
    const editingCustomer = req.body;

    // Update orders where customerID matches
    await Order.updateMany(
      { customerID: customerID },
      {
        $set: {
          customerName: editingCustomer.customerName,
          mobileNumber: editingCustomer.mobileNumber,
          city: editingCustomer.city,
          address: editingCustomer.address,
          pincode: editingCustomer.pincode,
        },
      }
    );

    res
      .status(200)
      .json({ message: "Customer details updated in orders successfully" });
  } catch (error) {
    console.error("Error updating customer details in orders:", error);
    res.status(500).json({ error: "Internal server error" });
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

//week analysis
const getWeeklyAnalysis = (orders) => {
  const result = {};
  orders.forEach((order) => {
    try {
      // Convert DD-MM-YYYY to YYYY-MM-DD
      const [day, month, year] = order.orderDate.split("-");
      const isoDateString = `${year}-${month}-${day}`;
      const date = new Date(isoDateString);
      if (isNaN(date)) {
        return; // Skip this order
      }
      const dayPart = date.toISOString().split("T")[0]; // Get the date part

      if (!result[dayPart]) {
        result[dayPart] = { totalAmount: 0, orders: [] };
      }
      result[dayPart].totalAmount += order.totalAmount;
      result[dayPart].orders.push(order);
    } catch (error) {
      console.error("Error processing order:", order, error);
    }
  });

  // Calculate weekly total
  const weeklyTotal = Object.values(result).reduce(
    (acc, dayData) => acc + dayData.totalAmount,
    0
  );

  return { dailyData: result, weeklyTotal };
};

router.get("/weekly-analysis", async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      throw new Error("No orders found");
    }
    const analysis = getWeeklyAnalysis(orders);

    res.json(analysis);
  } catch (err) {
    console.error("Error during weekly analysis:", err);
    res.status(500).send({ error: err.message });
  }
});

// Function to get the analysis of city-wise orders with total amount and count
const getCityWiseOrderAnalysis = (orders) => {
  const cityWiseAnalysisData = {};

  orders.forEach((order) => {
    const city = order.city;
    // If the city doesn't exist in the cityWiseAnalysisData object, initialize it
    if (!cityWiseAnalysisData[city]) {
      cityWiseAnalysisData[city] = { totalAmount: 0, count: 0 };
    }
    // Increment the total amount and count for the city
    cityWiseAnalysisData[city].totalAmount += order.totalAmount || 0; // Ensure order amount is valid
    cityWiseAnalysisData[city].count++;
  });

  return cityWiseAnalysisData;
};

// Define the API endpoint for city-wise analysis
router.get("/city-wise-analysis", async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      throw new Error("No orders found");
    }
    const cityWiseAnalysisData = getCityWiseOrderAnalysis(orders);

    res.json(cityWiseAnalysisData);
  } catch (err) {
    console.error("Error during city-wise analysis:", err);
    res.status(500).send({ error: err.message });
  }
});

// get the year
router.get("/available-years", async (req, res) => {
  try {
    const years = await Order.distinct("orderDate");
    const availableYears = years
      .map((date) => date.split("-")[2])
      .filter((value, index, self) => self.indexOf(value) === index);
    res.json(availableYears);
  } catch (err) {
    console.error("Error fetching available years:", err);
    res.status(500).send({ error: err.message });
  }
});

// API to get total amount based on selected year, month, and date
router.get("/date-wise-analysis", async (req, res) => {
  try {
    const { year, month, date } = req.query;
    let matchCriteria = {};

    if (year && month && date) {
      matchCriteria.orderDate = { $regex: `^${date}-${month}-${year}$` };
    } else if (year && month) {
      matchCriteria.orderDate = { $regex: `^\\d{2}-${month}-${year}$` };
    } else if (year) {
      matchCriteria.orderDate = { $regex: `^\\d{2}-\\d{2}-${year}$` };
    } else {
      return res.json({ totalAmount: 0, totalCount: 0 });
    }

    const orders = await Order.find(matchCriteria);

    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalCount = orders.length;

    res.json({ totalAmount, totalCount });
  } catch (err) {
    console.error("Error fetching date-wise analysis data:", err);
    res.status(500).send({ error: err.message });
  }
});

// Fetch total amount and count for the previous year
router.get("/last-current-year-analysis", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const lastYearOrders = await Order.find({
      orderDate: {
        $regex: `^\\d{2}-\\d{2}-${previousYear}$`,
      },
    });

    const currentYearOrders = await Order.find({
      orderDate: {
        $regex: `^\\d{2}-\\d{2}-${currentYear}$`,
      },
    });

    const lastYearTotalAmount = lastYearOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const lastYearTotalCount = lastYearOrders.length;

    const currentYearTotalAmount = currentYearOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const currentYearTotalCount = currentYearOrders.length;

    res.json({
      lastYear: {
        totalAmount: lastYearTotalAmount,
        totalCount: lastYearTotalCount,
      },
      currentYear: {
        totalAmount: currentYearTotalAmount,
        totalCount: currentYearTotalCount,
      },
    });
  } catch (err) {
    console.error("Error fetching last and current year analysis data:", err);
    res.status(500).send({ error: err.message });
  }
});

router.get("/last-current-month-analysis", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-indexed

    let previousYear = currentYear;
    let previousMonth = currentMonth - 1;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear -= 1;
    }

    const formattedPreviousMonth =
      previousMonth < 10 ? `0${previousMonth}` : `${previousMonth}`;

    const lastMonthOrders = await Order.find({
      orderDate: {
        $regex: `^\\d{2}-${formattedPreviousMonth}-${previousYear}$`,
      },
    });

    const currentMonthOrders = await Order.find({
      orderDate: {
        $regex: `^\\d{2}-${
          currentMonth < 10 ? `0${currentMonth}` : currentMonth
        }-${currentYear}$`,
      },
    });

    const lastMonthTotalAmount = lastMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const lastMonthTotalCount = lastMonthOrders.length;

    const currentMonthTotalAmount = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const currentMonthTotalCount = currentMonthOrders.length;

    res.json({
      lastMonth: {
        totalAmount: lastMonthTotalAmount,
        totalCount: lastMonthTotalCount,
      },
      currentMonth: {
        totalAmount: currentMonthTotalAmount,
        totalCount: currentMonthTotalCount,
      },
    });
  } catch (err) {
    console.error("Error fetching last and current month analysis data:", err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
