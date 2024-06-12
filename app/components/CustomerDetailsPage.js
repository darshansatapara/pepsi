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
import { Entypo } from "@expo/vector-icons";

const CustomerCard = ({ customer, onPress }) => (
  <View style={styles.customerCard}>
    <TouchableOpacity
      style={styles.cardViewStyle}
      onPress={() => onPress(customer)}
    >
      <View style={styles.customerDetails}>
        <View style={styles.customerName}>
          <Text style={styles.TextColor}>Customer:</Text>
          <Text style={styles.TextColor}> {customer.customerName}</Text>
        </View>
        <Text style={styles.TextColor}>
          Mobile Number: {customer.mobileNumber}
        </Text>
        <Text style={styles.TextColor}>ID: {customer.customerID}</Text>
      </View>
      <View style={styles.VArrow}>
        <Entypo name="chevron-right" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  </View>
);

const CustomerDetailsPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchID, setSearchID] = useState("");
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
    // Filter customers based on search query (name or mobile number) and ID
    const filtered = customers.filter((customer) => {
      const matchesNameOrMobile =
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.mobileNumber.includes(searchQuery);
      const matchesID = customer.customerID.toString().includes(searchID);
      return matchesNameOrMobile && matchesID;
    });
    setFilteredCustomers(filtered);
  }, [searchQuery, searchID, customers]);

  const handleAddCustomer = () => {
    navigation.navigate("AddCustomer", {
      fetchCustomerData: fetchCustomerData,
    });
  };

  const handleCustomerPress = (customer) => {
    navigation.navigate("CustomerProfile", {
      customerID: customer.customerID,
      fetchCustomerData: fetchCustomerData,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or mobile number"
          value={searchQuery}
          placeholderTextColor={"#000"}
          onChangeText={setSearchQuery}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID"
          value={searchID}
          placeholderTextColor={"#000"}
          onChangeText={setSearchID}
          keyboardType="numeric"
        />
      </View>
      <ScrollView style={styles.customerList}>
        {filteredCustomers.length === 0 ? (
          <Text style={styles.NoRecords}>No customers found</Text>
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
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#AAAAAA",
    borderBottomColor: "#AAAAAA",
    borderLeftColor: 0,
    borderRightColor: 0,
    borderWidth: 2,
    flex: 1,
    backgroundColor: "#EEF7FF",
    paddingTop: 7,
    padding: 8,
  },
  TextColor: {
    color: "#000",
    fontSize: 17,
    marginBottom: 5,
  },
  NoRecords: {
    color: "#240750",
    justifyContent: "center",
    fontSize: 17,
    top: 10,
    padding: 80,
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchInput: {
    paddingHorizontal: 10,
    height: 40,
    borderColor: "#000",
    backgroundColor: "rgba(224, 218, 218, 0.5)",
    fontWeight: "900",
    borderWidth: 1,
    color: "#000",
    borderRadius: 15,
    flex: 1,
    marginRight: 5,
  },
  customerList: {
    flex: 1,
  },
  cardViewStyle: {
    flexDirection: "row",
  },
  customerCard: {
    backgroundColor: "#CDE8E5",
    borderRadius: 10,
    borderWidth: 1.2,
    borderCurve: "round",
    shadowColor: "#000",
    shadowOpacity: 1,
    padding: 10,
    marginBottom: 6,
  },
  customerDetails: {
    flex: 5,
  },
  customerName: {
    flexDirection: "row",
    width: 250,
    color: "#000",
  },
  VArrow: {
    flex: 0,
    justifyContent: "center",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default CustomerDetailsPage;
