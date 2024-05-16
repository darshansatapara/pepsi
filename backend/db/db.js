const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://sataparad1:pepsi286@pepsicluster.fmc1aq7.mongodb.net/?retryWrites=true&w=majority&appName=pepsiCluster";
// darshmongo
const connectToMongo = async () => {
  const defaultTimeoutMS = 30000;
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI, { socketTimeoutMS: defaultTimeoutMS });
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongo;
