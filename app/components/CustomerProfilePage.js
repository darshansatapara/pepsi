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
import { useOrdersData } from "../context/OrdersDataContext";

const CustomerProfile = ({ route }) => {
  const fatchCustomerData = route.params.fatchCustomerData;
  const customerID = route.params.customerID;
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [originalCustomer, setOriginalCustomer] = useState(null);
  const { ordersDetails, setOrdersDetails, fatchOrdersData } = useOrdersData(
    []
  );
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
    } catch (error) {
      console.error("Error updating customer details in order:", error);
      // Handle error
    }
  };
  const handleSave = async () => {
    try {
      // Send updated customer details to backend API
      await client.put(
        `/api/Customer/updateCustomer/${customerID}/${editingCustomer._id}`,
        editingCustomer
      );
      setCustomer(editingCustomer);
      updateCustomerDetailsInOrder(customerID, editingCustomer);
      fatchCustomerData();
      fatchCustomerDataWithOrders();
      const updatedOrderDetails = ordersDetails.map((order) => {
        // If the order's customerName matches the old customerName, update it
        if (order.customerName === customer.customerName) {
          return {
            ...order,
            customerName: editingCustomer.customerName,
          };
        }
        return order;
      });

      // Update state with the modified orderDetails
      setOrdersDetails(updatedOrderDetails);
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
      <Text style={styles.orderDetailHeadingText}>
        Order ID : <Text style={styles.OrderValueText}>{order.orderID}</Text>
      </Text>
      <Text style={styles.orderDetailHeadingText}>
        Order Date :<Text style={styles.OrderValueText}>{order.orderDate}</Text>
      </Text>
      <Text style={{ marginBottom: 5 }}>-------------------------------</Text>
      <Text style={styles.orderDetailHeadingText}>
        Red Pepsi :
        <Text style={styles.OrderValueText}>{order.redPepsiQuantity}</Text>
      </Text>
      <Text style={styles.orderDetailHeadingText}>
        Black Pepsi :
        <Text style={styles.OrderValueText}>{order.blackPepsiQuantity}</Text>
      </Text>
      <Text style={styles.orderDetailHeadingText}>
        Yellow Pepsi :
        <Text style={styles.OrderValueText}>{order.yellowPepsiQuantity}</Text>
      </Text>
      <Text style={{ marginBottom: 5 }}>-------------------------------</Text>
      <Text style={styles.orderDetailHeadingText}>
        Total Amount :
        <Text style={styles.OrderValueText}> ₹ {order.totalAmount}</Text>
      </Text>
      <Text style={styles.orderDetailHeadingText}>
        Payment Status :
        <Text style={styles.OrderValueText}>{order.paymentStatus}</Text>
      </Text>
    </View>
  );
  return customer ? (
    <View style={styles.container}>
      <View style={styles.customerDetails}>
        <Text style={styles.headingCustomer}>Customer Details</Text>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>Customer ID :</Text>
          <Text style={styles.CustomerValue}> {customer.customerID}</Text>
        </View>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>Name :</Text>
          <Text style={styles.CustomerValue}> {customer.customerName}</Text>
        </View>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>Mobile Number :</Text>
          <Text style={styles.CustomerValue}> {customer.mobileNumber}</Text>
        </View>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>City :</Text>
          <Text style={styles.CustomerValue}> {customer.city}</Text>
        </View>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>Address :</Text>
          <Text style={styles.CustomerValue}> {customer.address}</Text>
        </View>
        <View style={styles.manageRow}>
          <Text style={styles.customerInfoHeadingText}>Pincode :</Text>
          <Text style={styles.CustomerValue}> {customer.pincode}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <FontAwesome6 name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.orderDetails}>
          <Text style={styles.Orderheading}>Ordered Details :</Text>
          {orders.length === 0 ? (
            <Text style={{ fontSize: 18 }}>No orders found</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.orderID}
              renderItem={({ item }) => <OrderCard order={item} />}
              horizontal
            />
          )}
        </View>
      </ScrollView>

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
                    height: Math.max(40, editingCustomer?.address.length * 0.4),
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
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#AAAAAA",
    borderLeftColor: 0,
    borderRightColor: 0,
    borderBottomColor: 0,
    borderWidth: 2,
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#DFF5FF",
    paddingTop: 5,
    padding: 8,
  },
  Ordercontainer: {
    flexGrow: 1,
    borderColor: "#000",
  },
  Orderheading: {
    fontSize: 22,
    left: 2,
    fontWeight: "bold",
    marginBottom: 12,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  headingCustomer: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    borderStyle: "dashed",
    fontSize: 22,
    marginBottom: 7,
  },
  customerDetails: {
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: "#FBF9F1",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    position: "relative",
  },
  manageRow: {
    flexDirection: "row",
  },
  customerInfoHeadingText: {
    fontSize: 18,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  CustomerValue: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
    width: 280,
    flex: 1,
  },
  orderDetails: {
    backgroundColor: "#CAF4FF",
    marginTop: 25,
    height: 350,
    borderColor: "#000",
    borderWidth: 1.5,
    padding: 8,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOpacity: 1,
    borderRadius: 15,
  },
  orderDetailHeadingText: {
    fontSize: 17,
    marginBottom: 5,
  },
  OrderValueText: {
    fontSize: 16,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FBF9F1",
    borderRadius: 5,
    padding: 10,
    height: 250,
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
    backgroundColor: "#FBF9F1",
    padding: 20,
    width: 365,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    width: 340,
    fontSize: 22,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderStyle: "dashed",
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "column",
    alignItems: "center",
    height: 60,
    marginBottom: 10,
  },
  inputLabel: {
    flex: 1,
    marginRight: -5,
    padding: 5,
    fontSize: 18,
    width: 330,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 330,
    margin: -10,
    backgroundColor: "#AAD7D9",
    borderRadius: 10,
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
  saveButton: {
    marginRight: 20,
    width: 90,
    borderRadius: 5,
    alignItems: "center",
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
