const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://sataparad1:pepsi286@pepsidata.7qo2kgu.mongodb.net/?retryWrites=true&w=majority&appName=PepsiData";
// darshmongo
const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongo;
