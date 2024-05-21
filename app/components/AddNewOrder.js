import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
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
import { ScrollView } from "react-native-gesture-handler";
import { useOrdersData } from "../context/OrdersDataContext";
import sendWhatsAppMessage from "./sendWhatsAppMessage";

const AddNewOrderPage = ({ navigation, route }) => {
  const { fatchOrdersData } = route.params;
  const {
    fetchCityWiseAnalysis,
    fetchDataweeklyDataAnalysis,
    fetchDateWiseAnalysis,
    fetchLastCurrentMonthData,
    fetchLastCurrentYearData,
  } = useOrdersData();
  const [customerDetails, setCustomerDetails] = useState({
    customerID: "",
    customerName: "",
    city: "",
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
    const formattedDate = `${("0" + date.getDate()).slice(-2)}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${date.getFullYear()}`;
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
    } catch (error) {
      Alert.alert(
        "Not Found",
        "Customer not found ,Please register first then 'Add Order'"
      );
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

  const handleConfirmOrder = () => {
    setConfirmationShown(true);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await client.post("/api/Order/addNewOrder", {
        mobileNumber,
        customerID: customerDetails.customerID,
        customerName: customerDetails.customerName,
        city: customerDetails.city,
        orderDate: currentDate,
        redPepsiQuantity: orderDetails.red,
        blackPepsiQuantity: orderDetails.black,
        yellowPepsiQuantity: orderDetails.yellow,
        totalAmount: totalAmount.totalAmount,
        paymentStatus,
      });
      const result = await response.data.order;

      Alert.alert(
        "Success",
        "Order placed successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              sendWhatsAppMessage(
                result // Add mobileNumber here
              );
              setMobileNumber("");
              setCustomerDetails({ customerID: "", customerName: "" });
              setOrderDetails({ red: 0, black: 0, yellow: 0 });
              fatchOrdersData();
              fetchCityWiseAnalysis();
              fetchDataweeklyDataAnalysis();
              fetchDateWiseAnalysis();
              fetchLastCurrentMonthData();
              fetchLastCurrentYearData();
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again later.");
    }
  };

  const clearForm = () => {
    setMobileNumber("");
    setCustomerDetails({ customerID: "", customerName: "" });
    setOrderDetails({ red: 0, black: 0, yellow: 0 });
    setConfirmationShown(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Mobile No. :</Text>
          <TextInput
            style={styles.input}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Customer ID : </Text>
          <TextInput
            style={styles.input2}
            value={customerDetails.customerID.toString()}
            editable={false}
          />
        </View>
        <View style={styles.inputRow}>
          <View>
            <Text style={styles.label}>Customer Name :</Text>
          </View>
          <TextInput
            style={styles.input2}
            value={customerDetails.customerName}
            editable={false}
          />
        </View>
        <View style={styles.inputRow}>
          <View>
            <Text style={styles.label}>City :</Text>
          </View>
          <TextInput
            style={styles.input2}
            value={customerDetails.city}
            editable={false}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Date:</Text>
          <TextInput
            style={styles.input2}
            value={currentDate}
            editable={false}
          />
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
          <View style={styles.input}>
            <Picker
              selectedValue={paymentStatus}
              onValueChange={(itemValue) => setPaymentStatus(itemValue)}
              enabled={true}
            >
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Paid" value="paid" />
            </Picker>
          </View>
        </View>

        <Text style={styles.totalAmount}>
          Total Amount: ₹{totalAmount.totalAmount}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !totalAmount.totalAmount && styles.disabledButton,
            ]}
            onPress={handleConfirmOrder}
            disabled={!totalAmount.totalAmount}
          >
            <Text style={styles.buttonText}>Confirm Order</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={confirmationShown}
          transparent
          onRequestClose={() => setConfirmationShown(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <Text style={styles.orderDetailsText}>
                <Text style={styles.DetailsHeading}>Customer ID :</Text>
                <Text style={styles.DetailsValue}>
                  {customerDetails.customerID}
                </Text>
              </Text>
              <View style={styles.orderDetailsText}>
                <Text style={styles.DetailsHeading}>Customer Name : </Text>
                <Text style={styles.DetailsValue}>
                  {customerDetails.customerName}
                </Text>
              </View>
              <Text style={styles.orderProductDetailsText}>
                <Text style={styles.DetailsHeading}>Red Pepsi :</Text>{" "}
                <Text style={styles.DetailsValue}> {orderDetails.red}</Text>
              </Text>
              <Text style={styles.orderDetailsText}>
                <Text style={styles.DetailsHeading}>Black Pepsi :</Text>{" "}
                <Text> {orderDetails.black}</Text>
              </Text>
              <Text style={styles.orderDetailsText}>
                <Text style={styles.DetailsHeading}>Yellow Pepsi :</Text>
                <Text style={styles.DetailsValue}> {orderDetails.yellow}</Text>
              </Text>
              <Text style={styles.DetailtotalAmount}>
                <Text style={styles.DetailsHeading}>Total Amount :</Text>
                <Text style={styles.DetailsValue}>
                  ₹{totalAmount.totalAmount}
                </Text>
              </Text>
              <Text style={styles.orderDetailsText}>
                <Text style={styles.DetailsHeading}>Date :</Text>
                <Text style={styles.DetailsValue}> {currentDate}</Text>
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.ModelclearButton}
                  onPress={() => setConfirmationShown(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ModelconfirmButton}
                  onPress={() => {
                    setConfirmationShown(false);
                    handlePlaceOrder();
                  }}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#AAAAAA",
    borderBottomColor: "#AAAAAA",
    borderLeftColor: 0,
    borderRightColor: 0,
    borderWidth: 2,
    flex: 1,
    backgroundColor: "#EEF7FF",
    paddingTop: 10,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  label: {
    fontSize: 17,
    marginBottom: 5,
  },
  input2: {
    height: 40,
    width: "100%",
    fontSize: 16,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#dcdcdc",
    paddingHorizontal: 10,
    color: "black",
  },
  input: {
    height: 40,
    width: "100%",
    fontSize: 16,
    justifyContent: "center",
    backgroundColor: "#CAF4FF",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  totalAmount: {
    flex: 1,
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  DetailtotalAmount: {
    flexDirection: "row",
    marginBottom: 5,
    paddingTop: 15,
    borderTopColor: "#000",
    borderTopWidth: 1,
    borderStyle: "dashed",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 370,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: "#000",
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingBottom: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderDetailsText: {
    flexDirection: "row",
    marginBottom: 7,
    fontSize: 15,
  },
  orderProductDetailsText: {
    flexDirection: "row",
    marginBottom: 5,
    paddingTop: 15,
    fontSize: 15,
    borderTopColor: "#000",
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  DetailsHeading: {
    fontSize: 18,
  },
  DetailsValue: {
    fontSize: 16,
    width: 200,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    width: 120,
    left: 20,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: "#75A47F",
    padding: 10,
    right: 20,
    borderRadius: 5,
  },
  ModelconfirmButton: {
    backgroundColor: "#75A47F",
    padding: 10,
    right: 20,
    width: 100,
    borderRadius: 5,
  },
  ModelclearButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    width: 100,
    left: 20,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateText: {
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
});

export default AddNewOrderPage;
