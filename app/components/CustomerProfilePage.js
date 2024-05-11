import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import client from "../axios"; // Import Axios for making API requests

const OrderCard = ({ order }) => (
  <View style={styles.orderCard}>
    <Text>Order ID: {order.orderId}</Text>
    <Text>Date: {order.date}</Text>
    <Text>Products:</Text>
    {order.products.map((product) => (
      <Text key={product.name}>
        - {product.name}: {product.quantity}
      </Text>
    ))}
    <Text>Total Amount: ${order.totalAmount}</Text>
  </View>
);

const CustomerProfile = ({ route }) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer details based on customer ID
      const customerResponse = await client.get(
        `/api/Customer/getCustomer/${customerId}`
      );
      setCustomer(customerResponse.data);

      // Fetch orders for the customer
      const orderResponse = await client.get(
        `/api/Order/bycustomerid/${customerId}`
      );
      setOrders(orderResponse.data);
    } catch (error) {
      console.log(error.message);
      console.error("Error fetching customer data:", error);
    }
  };

  return customer ? (
    <>
      <View style={styles.customerDetails}>
        <Text style={styles.heading}>Customer Details</Text>
        <Text>Name: {customer.customerName}</Text>
        <Text>Mobile Number: {customer.mobileNumber}</Text>
        <Text>City: {customer.city}</Text>
        <Text>Address: {customer.address}</Text>
        <Text>Pincode: {customer.pincode}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.orderDetails}>
          <Text style={styles.heading}>Ordered Details</Text>
          {orders.length === 0 ? (
            <Text>No orders found</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.orderId.toString()}
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
