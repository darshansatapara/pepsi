import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import client from "../axios"; // Import Axios for making API requests

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

const CustomerProfile = ({ route }) => {
  const customerID = route.params.customerID;
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer details based on customer ID
      const customerResponse = await client.get(
        `/api/Customer/getCustomer/${customerID}`
      );
      setCustomer(customerResponse.data);

      // Fetch orders for the customer
      console.log(customerID);
      const orderResponse = await client.get(
        `/api/Order/bycustomerid/${customerID}`
      );
      setOrders(
        Array.isArray(orderResponse.data)
          ? orderResponse.data
          : [orderResponse.data]
      );
    } catch (error) {
      console.log(error.message);
      console.error("Error fetching customer data:", error);
    }
  };

  return customer ? (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.customerDetails}>
          <Text style={styles.heading}>Customer Details</Text>
          <Text>Name: {customer.customerName}</Text>
          <Text>Mobile Number: {customer.mobileNumber}</Text>
          <Text>City: {customer.city}</Text>
          <Text>Address: {customer.address}</Text>
          <Text>Pincode: {customer.pincode}</Text>
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
      </ScrollView>
    </>
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
});

export default CustomerProfile;
