import React, { useState, useEffect } from "react";
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

const AddNewOrderPage = ({ navigation }) => {
  const [customerDetails, setCustomerDetails] = useState({
    id: "",
    name: "",
  });
  const [orderDetails, setOrderDetails] = useState({
    red: 0,
    black: 0,
    yellow: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmationShown, setConfirmationShown] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

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
      setCustomerDetails({ id: "", name: "" });
    }
  }, [mobileNumber]);

  const fetchCustomerDetails = () => {
    if (mobileNumber === "") {
      Alert.alert("Error", "Please enter a mobile number");
      return;
    }
    const fetchedCustomerDetails = {
      id: "1",
      name: "John Doe",
    };
    setCustomerDetails(fetchedCustomerDetails);
  };

  const handleProductQuantityChange = (product, quantity) => {
    setOrderDetails({
      ...orderDetails,
      [product]: parseInt(quantity) || 0,
    });
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [orderDetails]);

  const calculateTotalAmount = () => {
    const { red, black, yellow } = orderDetails;
    const redPrice = 10;
    const blackPrice = 15;
    const yellowPrice = 20;
    const total = red * redPrice + black * blackPrice + yellow * yellowPrice;
    setTotalAmount(total);
  };

  const handleConfirmOrder = () => {
    if (!confirmationShown) {
      const orderDetailsText = `Customer ID: ${customerDetails.id}\nCustomer Name: ${customerDetails.name}\n\nOrder Details:\nRed Pepsi: ${orderDetails.red}\nBlack Pepsi: ${orderDetails.black}\nYellow Pepsi: ${orderDetails.yellow}\n\nTotal Amount: ₹${totalAmount}\n\nDate: ${currentDate}`;
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
            onPress: () => {
              setConfirmationShown(true);
              setCustomerDetails({ id: "", name: "" });
              setOrderDetails({ red: 0, black: 0, yellow: 0 });
              setTotalAmount(0);
              setConfirmationModalVisible(false);
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const clearForm = () => {
    setMobileNumber("");
    setCustomerDetails({ id: "", name: "" });
    setOrderDetails({ red: 0, black: 0, yellow: 0 });
    setTotalAmount(0);
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
        <Text style={styles.label}>Customer ID:</Text>
        <TextInput
          style={styles.input2}
          value={customerDetails.id}
          editable={false}
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Customer Name:</Text>
        <TextInput
          style={styles.input2}
          value={customerDetails.name}
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
      <Text style={styles.totalAmount}>Total Amount: ₹{totalAmount}</Text>
      <View style={styles.buttonRow}>
        <Button title="Clear Form" onPress={clearForm} />
        <Button
          title="Confirm Order"
          onPress={() => setConfirmationModalVisible(true)}
          disabled={!totalAmount}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.orderDetailsText}>
              Customer ID: {customerDetails.id}
            </Text>
            <Text style={styles.orderDetailsText}>
              Customer Name: {customerDetails.name}
            </Text>
            <Text style={styles.orderDetailsText}>Order Details:</Text>
            <Text style={styles.orderDetailsText}>
              Red Pepsi: {orderDetails.red}
            </Text>
            <Text style={styles.orderDetailsText}>
              Black Pepsi: {orderDetails.black}
            </Text>
            <Text style={styles.orderDetailsText}>
              Yellow Pepsi: {orderDetails.yellow}
            </Text>
            <Text style={styles.orderDetailsText}>
              Total Amount: ₹{totalAmount}
            </Text>
            <Text style={styles.orderDetailsText}>Date: {currentDate}</Text>
            <View style={styles.buttonRow}>
              <Button title="Confirm" onPress={handleConfirmOrder} />
              <Button
                title="Cancel"
                onPress={() => setConfirmationModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
