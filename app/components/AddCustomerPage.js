import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
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
  const [modalVisible, setModalVisible] = useState(false);

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

    // Show confirmation modal
    setModalVisible(true);
  };

  const handleConfirmation = async () => {
    setModalVisible(false);
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
    <View style={styles.container}>
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
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.SaveButton} onPress={handleAddCustomer}>
          <Text style={styles.ButtonText}>Add Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ClearButton} onPress={clearForm}>
          <Text style={styles.ButtonText}>Clear Form</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.HeadingConfirmation}>
              <Text>Confirm Details</Text>
            </Text>
            <Text style={styles.DetilText}>
              Customer Name :
              <Text style={styles.DetailValue}> {customerName}</Text>
            </Text>
            <Text style={styles.DetilText}>
              Mobile Number :
              <Text style={styles.DetailValue}> {mobileNumber}</Text>
            </Text>
            <Text style={styles.DetilText}>
              City : <Text style={styles.DetailValue}>{city}</Text>
            </Text>
            <Text style={styles.DetilText}>
              Address :<Text style={styles.DetailValue}> {address}</Text>
            </Text>
            <Text style={styles.DetilText}>
              Pincode :<Text style={styles.DetailValue}> {pincode}</Text>
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.ConfirmButton}
                onPress={handleConfirmation}
              >
                <Text style={styles.ButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.ButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#AAAAAA",
    borderTopWidth: 2,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EEF7FF",
    paddingTop: 20,
    padding: 8,
  },
  input: {
    fontSize: 18,
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: 350,
    backgroundColor: "#DFF5FF",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  ClearButton: {
    color: "#000",
    backgroundColor: "#BFCFE7",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 100,
    marginTop: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  SaveButton: {
    color: "#000",
    backgroundColor: "#D5F0C1",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 120,
    borderRadius: 20,
    marginRight: 30,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 350,
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
  HeadingConfirmation: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingBottom: 5,
    marginBottom: 10,
  },
  DetilText: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "900",
  },
  DetailValue: {
    fontSize: 16,
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  ConfirmButton: {
    backgroundColor: "#D5F0C1",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  CancelButton: {
    color: "#000",
    backgroundColor: "#BFCFE7",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddCustomerPage;
