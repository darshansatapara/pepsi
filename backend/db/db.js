const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://sataparad1:pepsi286@cluster0.1hymdir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = async () => {
  try {
    // Enable connection pooling
    const options = {
      // Set socket and server selection timeouts
      socketTimeoutMS: 30000, // 30 seconds
      serverSelectionTimeoutMS: 30000, // 30 seconds
    };

    mongoose
      .connect(mongoURI, options)
      .then(() => console.log("Connected to MongoDB!"))
      .catch((err) => console.error("Error connecting to MongoDB:", err));

    console.log("Mongo connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = connectToMongo;
