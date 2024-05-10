import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";

// Example customer data
const customerData = {
    id: 1,
    Customer: "John Doe",
    mobileNumber: "1234567890",
    state: "State 1",
    city: "City 1",
    address: "Address 1",
    pincode: "123456",
};

// Example order data for the customer
const orderData = [
    {
        orderId: 101,
        date: "2024-05-10",
        products: [
            { name: "Red Pepsi", quantity: 2 },
            { name: "Black Pepsi", quantity: 1 },
            { name: "Yellow Pepsi", quantity: 3 },
        ],
        totalAmount: 25.5,
    },
    // Add more order data as needed
];

const OrderCard = ({ order }) => (
    <View style={styles.orderCard}>
        <Text>Order ID: {order.orderId}</Text>
        <Text>Date: {order.date}</Text>
        <Text>Products:</Text>
        {order.products.map(product => (
            <Text key={product.name}>
                - {product.name}: {product.quantity}
            </Text>
        ))}
        <Text>Total Amount: ${order.totalAmount}</Text>
    </View>
);

const CustomerProfile = ({ route }) => {
    const { customer } = route.params;

    return (<>
        <View style={styles.customerDetails}>
                <Text style={styles.heading}>Customer Details</Text>
                <Text>Name: {customer.Customer}</Text>
                <Text>Mobile Number: {customer.mobileNumber}</Text>
                <Text>City: {customer.city}</Text>
                <Text>Address: {customer.address}</Text>
                <Text>Pincode: {customer.pincode}</Text>
            </View>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.orderDetails}>
                <Text style={styles.heading}>Ordered Details</Text>
                <FlatList
                    data={orderData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <OrderCard order={item} />}
                    horizontal
                />
            </View>
        </ScrollView>
        </>
    );
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
