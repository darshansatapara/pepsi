import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import SendIntentAndroid from "react-native-send-intent";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import client from "../axios";

const AddNewOrderPage = ({ navigation, route }) => {
  const { fetchOrdersData } = route.params;
  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    customerName: "",
  });
  const [orderDetails, setOrderDetails] = useState({
    red: 0,
    black: 0,
    yellow: 0,
  });
  const [totalAmount, setTotalAmount] = useState({
    totalAmount: 0,
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    if (mobileNumber.length === 10) {
      fetchCustomerDetails();
    } else {
      setCustomerDetails({ customerID: "", customerName: "" });
    }
  }, [mobileNumber]);

  const fetchCustomerDetails = async () => {
    if (mobileNumber === "") {
      Alert.alert("Error", "Please enter a mobile number");
      return;
    }
    try {
      let newmobileNumber = parseInt(mobileNumber);
      const response = await client.get(
        `/api/Customer/getCustomer/${newmobileNumber}`
      );
      setCustomerDetails(response.data);
      // console.log(customerDetails.customerID);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      Alert.alert("Error", "Failed to fetch customer details");
    }
  };

  const handleProductQuantityChange = async (product, quantity) => {
    setOrderDetails({
      ...orderDetails,
      [product]: parseInt(quantity) || 0,
    });
    try {
      const response = await client.post("/api/Order/calculateTotalAmount", {
        redPepsiQuantity:
          product === "red" ? parseInt(quantity) : orderDetails.red,
        blackPepsiQuantity:
          product === "black" ? parseInt(quantity) : orderDetails.black,
        yellowPepsiQuantity:
          product === "yellow" ? parseInt(quantity) : orderDetails.yellow,
      });

      setTotalAmount((prev) => ({
        ...prev,
        totalAmount: response.data.totalAmount,
      }));
    } catch (error) {
      console.error("Error calculating total amount:", error);
      Alert.alert("Error", "Failed to calculate total amount");
    }
  };

  //handle confirmation for the sen the valuse of the order
  const handleConfirmOrder = () => {
    const orderDetailsText = `Customer ID: ${customerDetails.customerID.toString()}\nCustomer Name: ${
      customerDetails.customerName
    }\n\nOrder Details:\nRed Pepsi: ${orderDetails.red}\nBlack Pepsi: ${
      orderDetails.black
    }\nYellow Pepsi: ${orderDetails.yellow}\n\nTotal Amount: ₹${
      totalAmount.totalAmount
    }\n\nDate: ${currentDate}`;

    Alert.alert(
      "Confirm Order",
      orderDetailsText,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const response = await client.post("/api/Order/addNewOrder", {
                mobileNumber,
                customerID: customerDetails.customerID,
                customerName: customerDetails.customerName,
                orderDate: currentDate,
                redPepsiQuantity: orderDetails.red,
                blackPepsiQuantity: orderDetails.black,
                yellowPepsiQuantity: orderDetails.yellow,
                totalAmount: totalAmount.totalAmount,
                paymentStatus,
              });
              console.log("Order placed successfully:", response.data);


              Alert.alert(
                "Success",
                "Order placed successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setMobileNumber("");
                      setCustomerDetails({ customerID: "", customerName: "" });
                      setOrderDetails({ red: 0, black: 0, yellow: 0 });
                      fetchOrdersData();
                      navigation.goBack();
                    },
                  },
                ],
                { cancelable: false }
              );
            } catch (error) {
              console.error("Error placing order:", error);
              Alert.alert(
                "Error",
                "Failed to place order. Please try again later."
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const clearForm = () => {
    setMobileNumber("");
    setCustomerDetails({ customerID: "", customerName: "" });
    setOrderDetails({ red: 0, black: 0, yellow: 0 });
    setConfirmationShown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Order</Text>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Mobile Number:</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Customer ID: </Text>
        <TextInput
          style={styles.input2}
          value={customerDetails.customerID.toString()}
          editable={false}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Customer Name:</Text>
        <TextInput
          style={styles.input2}
          value={customerDetails.customerName}
          editable={false}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Date:</Text>
        <TextInput style={styles.input2} value={currentDate} editable={false} />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Red Pepsi:</Text>
        <TextInput
          style={styles.input}
          value={orderDetails.red.toString()}
          onChangeText={(text) => handleProductQuantityChange("red", text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Black Pepsi:</Text>
        <TextInput
          style={styles.input}
          value={orderDetails.black.toString()}
          onChangeText={(text) => handleProductQuantityChange("black", text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Yellow Pepsi:</Text>
        <TextInput
          style={styles.input}
          value={orderDetails.yellow.toString()}
          onChangeText={(text) => handleProductQuantityChange("yellow", text)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Payment Status:</Text>
        <Picker
          style={styles.input}
          selectedValue={orderDetails.paymentStatus}
          onValueChange={(itemValue, itemIndex) => setPaymentStatus(itemValue)}
          enabled={true} // Set this to false to make the picker read-only
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Paid" value="paid" />
        </Picker>
      </View>

      <Text style={styles.totalAmount}>
        Total Amount: ₹{totalAmount.totalAmount}
      </Text>
      <View style={styles.buttonRow}>
        <Button title="Clear Form" onPress={clearForm} />
        <Button
          title="Confirm Order"
          onPress={handleConfirmOrder}
          disabled={!totalAmount.totalAmount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  input2: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#dcdcdc",
    paddingHorizontal: 10,
    color: "black",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  totalAmount: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: 300,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderDetailsText: {
    marginBottom: 5,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateText: {
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default AddNewOrderPage;
