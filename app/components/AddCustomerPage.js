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

const AddCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [fullname, setFullname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  const handleAddCustomer = () => {
    // Perform form validation
    if (!fullname || !mobileNumber || !state || !city || !address || !pincode) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    // Validate mobile number and pincode format
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
      `Fullname: ${fullname}\nMobile Number: ${mobileNumber}\nWhatsApp Number: ${whatsappNumber}\nState: ${state}\nCity: ${city}\nAddress: ${address}\nPincode: ${pincode}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => handleConfirmation() },
      ]
    );
  };

  const handleConfirmation = () => {
    // Save customer data to backend server or local storage
    const newCustomer = {
      fullname,
      mobileNumber,
      city,
      address,
      pincode,
    };
    setCustomers([...customers, newCustomer]);

    // Clear form fields after submission
    clearForm();
  };

  const handleClearForm = () => {
    // Clear form fields
    clearForm();
  };

  const clearForm = () => {
    setFullname("");
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
        placeholder="Fullname"
        value={fullname}
        onChangeText={setFullname}
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
        <Button title="Clear Form" onPress={handleClearForm} />
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
  customerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AddCustomerPage;
