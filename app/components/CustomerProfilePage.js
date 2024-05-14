import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import client from "../axios"; // Import Axios for making API requests
import { FontAwesome6 } from "@expo/vector-icons";

const CustomerProfile = ({ route }) => {

  const fatchCustomerData = route.params.fatchCustomerData;
  const customerID = route.params.customerID;
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [originalCustomer, setOriginalCustomer] = useState(null);

  useEffect(() => {
    fatchCustomerDataWithOrders();
  }, []);

  const fatchCustomerDataWithOrders = async () => {
    try {
      // Fetch customer details based on customer ID
      const customerResponse = await client.get(
        `/api/Customer/getCustomer/${customerID}`
      );
      setCustomer(customerResponse.data);

      // Fetch orders for the customer
      const orderResponse = await client.get(
        `/api/Order/bycustomerid/${customerID}`
      );
      setOrders(
        Array.isArray(orderResponse.data)
          ? orderResponse.data
          : [orderResponse.data]
      );
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleEdit = () => {
    setOriginalCustomer(customer);
    setEditingCustomer({ ...customer });
  };

  const handleChange = (key, value) => {
    setEditingCustomer({
      ...editingCustomer,
      [key]: value,
    });
  };

  const handleCancel = () => {
    setEditingCustomer(null);
  };
  const updateCustomerDetailsInOrder = async (customerID, editingCustomer) => {
    try {
      const response = await client.put(
        `/api/Order/updateCustomerDetailsInOrder/${customerID}`,
        editingCustomer
      );
      console.log(response.data); // Log success message or handle response accordingly
    } catch (error) {
      console.error("Error updating customer details in order:", error);
      // Handle error
    }
  };
  const handleSave = async () => {
    try {
      console.log(editingCustomer._id);
      // Send updated customer details to backend API
      await client.put(
        `/api/Customer/updateCustomer/${customerID}/${editingCustomer._id}`,
        editingCustomer
      );
      setCustomer(editingCustomer);

      updateCustomerDetailsInOrder(customerID, editingCustomer);
      fatchCustomerData();
      fatchCustomerDataWithOrders();
      setEditingCustomer(null);
      Alert.alert("Success", "Customer updated");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle pincode validation error
        alert(error.response.data.error);
      } else {
        console.error("Error updating customer details:", error);
      }
    }
  };
  const OrderCard = ({ order }) => (
    <View style={styles.orderCard}>
      <Text>Order ID: {order.orderID}</Text>
      <Text>Order Date: {order.orderDate}</Text>
      <Text>---------------------------</Text>
      <Text>.....Produts:....</Text>
      <Text>Red Pepsi: {order.redPepsiQuantity}</Text>
      <Text>Black Pepsi: {order.blackPepsiQuantity}</Text>
      <Text>Yellow Pepsi: {order.yellowPepsiQuantity}</Text>
      <Text>---------------------------</Text>
      <Text>Total Amount: ${order.totalAmount}</Text>
      <Text>Payment Status: {order.paymentStatus}</Text>
    </View>
  );
  return customer ? (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.customerDetails}>
        <Text style={styles.heading}>Customer Details</Text>
        <Text>Customer ID: {customer.customerID}</Text>
        <Text>Name: {customer.customerName}</Text>
        <Text>Mobile Number: {customer.mobileNumber}</Text>
        <Text>City: {customer.city}</Text>
        <Text>Address: {customer.address}</Text>
        <Text>Pincode: {customer.pincode}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <FontAwesome6 name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.heading}>Ordered Details</Text>
        {orders.length === 0 ? (
          <Text>No orders found</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderID}
            renderItem={({ item }) => <OrderCard order={item} />}
            horizontal
          />
        )}
      </View>
      {/* Editing Modal */}
      <Modal
        visible={editingCustomer !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Customer Details</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Customer Name:</Text>
              <TextInput
                style={styles.input}
                value={editingCustomer?.customerName}
                onChangeText={(text) => handleChange("customerName", text)}
                placeholder="Customer Name"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Mobile Number:</Text>
              <TextInput
                style={styles.input}
                value={editingCustomer?.mobileNumber}
                onChangeText={(text) => handleChange("mobileNumber", text)}
                placeholder="Mobile Number"
                maxLength={10}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>City:</Text>
              <TextInput
                style={styles.input}
                value={editingCustomer?.city}
                onChangeText={(text) => handleChange("city", text)}
                placeholder="City"
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Address:</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.max(40, editingCustomer?.address.length * 0.9),
                  },
                ]}
                value={editingCustomer?.address}
                onChangeText={(text) => handleChange("address", text)}
                placeholder="Address"
                multiline={true}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Pincode:</Text>
              <TextInput
                style={styles.input}
                value={editingCustomer?.pincode}
                onChangeText={(text) => handleChange("pincode", text)}
                placeholder="Pincode"
                maxLength={6}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={
                  !(
                    editingCustomer?.mobileNumber?.length === 10 &&
                    editingCustomer?.pincode?.length === 6
                  )
                }
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: !(
                      editingCustomer?.mobileNumber?.length === 10 &&
                      editingCustomer?.pincode?.length === 6
                    )
                      ? "#ccc"
                      : "#4CAF50",
                  },
                ]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customerDetails: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  orderDetails: {
    marginBottom: 20,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 200,
  },
  editButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
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
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputLabel: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomerProfile;
