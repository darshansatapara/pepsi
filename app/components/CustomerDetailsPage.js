import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const customersData = [
    {
        id: 1,
        Customer: "John Doe",
        mobileNumber: "1234567890",
        whatsappNumber: "1234567890",
        state: "State 1",
        city: "City 1",
        address: "Address 1",
        pincode: "123456",
    },
    {
        id: 4,
        Customer: "mithun ",
        mobileNumber: "9876543210",
        whatsappNumber: "9876543210",
        state: "State 2",
        city: "City 2",
        address: "Address 2",
        pincode: "654321",
    },
    {
        id:3,
        Customer: "rahim Doe",
        mobileNumber: "9876543210",
        whatsappNumber: "9876543210",
        state: "State 2",
        city: "City 2",
        address: "Address 2",
        pincode: "654321",
    },
    {
        id: 2,
        Customer: "Jane Doe",
        mobileNumber: "9876543210",
        whatsappNumber: "9876543210",
        state: "State 2",
        city: "City 2",
        address: "Address 2",
        pincode: "654321",
    },
    // Add more customer data as needed
];

const CustomerCard = ({ customer, onPress }) => (
    <TouchableOpacity
        style={styles.customerCard}
        onPress={() => onPress(customer)}
    >
        <Text>Customer: {customer.Customer}</Text>
        <Text>Mobile Number: {customer.mobileNumber}</Text>
        <Text>ID: {customer.id}</Text>
    </TouchableOpacity>
);

const CustomerDetailsPage = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customersData);

    useEffect(() => {
        if (!searchQuery) {
            // Sort customers by ID when search query is empty
            const sortedCustomers = [...customersData].sort((a, b) => a.id - b.id);
            setFilteredCustomers(sortedCustomers);
            return;
        }

        const filtered = customersData.filter(
            (customer) =>
                customer.Customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.mobileNumber.includes(searchQuery)
        );
        setFilteredCustomers(filtered);
    }, [searchQuery]);

    const handleAddCustomer = () => {
        navigation.navigate("AddCustomer");
    };

    const handleCustomerPress = (customer) => {
        navigation.navigate("CustomerProfile", { customer });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by name or mobile number"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <ScrollView style={styles.customerList}>
                {filteredCustomers.length === 0 ? (
                    <Text>No customers found</Text>
                ) : (
                    filteredCustomers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onPress={handleCustomerPress}
                        />
                    ))
                )}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCustomer}>
                <Text>Add Customer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    customerList: {
        flex: 1,
    },
    customerCard: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightblue",
        padding: 10,
        borderRadius: 5,
    },  
}); 

export default CustomerDetailsPage;
