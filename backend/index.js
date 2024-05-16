const express = require("express");
const app = express();
const customerRouter = require("./api/CustomerApi");
const OrderRouter = require("./api/OrderApi");
const connectToMongo = require("./db/db"); // Import the function to connect to MongoDB

app.use(express.json());
app.use("/api/Customer", customerRouter);
app.use("/api/Order", OrderRouter);

const port = process.env.PORT || 5000;

// Connect to MongoDB when the server starts

connectToMongo();
app.listen(port, () => console.log(`Server running on port ${port}`));
