import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import client from "../axios"; // Import Axios for making API requests

const CustomerCard = ({ customer, onPress }) => (
  <TouchableOpacity
    style={styles.customerCard}
    onPress={() => onPress(customer)}
  >
    <Text>Customer: {customer.customerName}</Text>
    <Text>Mobile Number: {customer.mobileNumber}</Text>
    <Text>ID: {customer.customerID}</Text>
  </TouchableOpacity>
);

const CustomerDetailsPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []); // Fetch customer data when the component mounts

  const fetchCustomerData = async () => {
    try {
      const response = await client.get("/api/Customer/allcustomers");
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    // Filter customers based on search query
    const filtered = searchQuery
      ? customers.filter(
          (customer) =>
            customer.customerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            customer.mobileNumber.includes(searchQuery)
        )
      : customers;
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleAddCustomer = () => {
    navigation.navigate("AddCustomer", {
      fetchCustomerData: fetchCustomerData,
    });
  };
  

  const handleCustomerPress = (customer) => {
    navigation.navigate("CustomerProfile", { customerId: customer.customerID });
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
              key={customer.customerID}
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
