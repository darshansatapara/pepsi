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
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
// import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const CustomerCard = ({ customer, onPress }) => (
  <View>
    <LinearGradient
      colors={["rgba(18,20,37,0.91)", "rgba(54,54,54,0.94)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.customerCard}
    >
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
          <Entypo name="chevron-right" size={24} color="#e1e1e1" />
        </View>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const CustomerDetailsPage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    fatchCustomerData();
  }, []); // Fetch customer data when the component mounts

  const fatchCustomerData = async () => {
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
      fatchCustomerData: fatchCustomerData,
    });
  };

  const handleCustomerPress = (customer) => {
    // console.log("customer id", customer.customerID);
    navigation.navigate("CustomerProfile", {
      customerID: customer.customerID,
      fatchCustomerData: fatchCustomerData,
    });
  };

  return (
    <LinearGradient
      colors={["#262c37", "#11131c", "rgba(20,26,52,0.96)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0.23, 0.5, 0.96]}
      style={styles.container}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or mobile number"
        value={searchQuery}
        placeholderTextColor={"#e1e1e1"}
        onChangeText={setSearchQuery}
      />
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
        <Text>Add Customer</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  TextColor: {
    color: "#e1e1e1",
    fontSize: 15,
  },
  NoRecords:{
    color: "#e1e1e1",
    justifyContent: "center",
    alignSelf: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "rgba(255, 255, 255,0.10)",
    borderWidth: 1,
    color: "white",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  customerList: {
    flex: 1,
  },
  cardViewStyle: {
    flexDirection: "row",
  },
  customerCard: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  customerName: {
    flexDirection: "row",
    width: 250,
    color: "white",
  },
  customerDetails: {
    flex: 5,
  },
  VArrow: {
    flex: 0,
    justifyContent: "center",
  },
});

export default CustomerDetailsPage;
