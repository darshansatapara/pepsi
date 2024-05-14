import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import client from "../axios";

const AddCustomerPage = ({ route }) => {
  const fatchCustomerData = route.params.fatchCustomerData;
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const handleAddCustomer = () => {
    if (!customerName || !mobileNumber || !city || !address || !pincode) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert("Validation Error", "Mobile number must be 10 digits");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert("Validation Error", "Pincode must be 6 digits");
      return;
    }

    // Show confirmation popup
    Alert.alert(
      "Confirm Details",
      `Customer Name: ${customerName}\nMobile Number: ${mobileNumber}\nCity: ${city}\nAddress: ${address}\nPincode: ${pincode}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: handleConfirmation },
      ]
    );
  };

  const handleConfirmation = async () => {
    try {
      const response = await client.post("/api/Customer/addnewCustomer", {
        customerName,
        mobileNumber,
        city,
        address,
        pincode,
      });
      console.log(response.data);
      Alert.alert("Success", "Customer added successfully");
      clearForm();

      // Fetch updated list of customers after adding the new customer
      fatchCustomerData();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add customer. Please try again later.");
    }
  };

  const clearForm = () => {
    setCustomerName("");
    setMobileNumber("");
    setCity("");
    setAddress("");
    setPincode("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Customer</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        maxLength={6}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Customer" onPress={handleAddCustomer} />
        <Button title="Clear Form" onPress={clearForm} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});

export default AddCustomerPage;
