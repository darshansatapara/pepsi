import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import CalendarPicker from "react-native-calendar-picker";
import client from "../axios";

const availableProducts = ["Red Pepsi", "Black Pepsi", "Yellow Pepsi"];
// const productPrices = { "Red Pepsi": 10, "Black Pepsi": 15, "Yellow Pepsi": 20 };

const OrderPage = ({ navigation }) => {
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [editedPaymentStatus, setEditedPaymentStatus] = useState("");
  const [availableOtherProducts, setAvailableOtherProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [totalAmount, setTotalAmount] = useState({
    totalAmount: 0,
  });

  useEffect(() => {
    fetchOrdersData();
  }, []);

  /// fathc the all orders data
  const fetchOrdersData = async () => {
    try {
      const response = await client.get("/api/Order/getAllOrders");
      if (response && response.data && Array.isArray(response.data)) {
        const transformedOrders = response.data.map((order) => ({
          ...order,
          orderDetails: [
            { product: "Red Pepsi", quantity: order.redPepsiQuantity },
            { product: "Black Pepsi", quantity: order.blackPepsiQuantity },
            { product: "Yellow Pepsi", quantity: order.yellowPepsiQuantity },
          ],
        }));
        setOrdersDetails(transformedOrders);
      } else {
        console.error("Invalid response data:", response);
      }
    } catch (error) {
      console.error("Error finding the Order Data ", error);
    }
  };

  useEffect(() => {
    if (!searchText && !selectedDate) {
      setFilterApplied(false);
    } else {
      setFilterApplied(true);
    }
  }, [searchText, selectedDate]);

  const handleAddNewOrder = () => {
    navigation.navigate("AddNewOrder", { fetchOrdersData: fetchOrdersData });
  };

  const handleEditButtonPress = (order) => {
    setSelectedOrder(order);

    // Initialize editedQuantities object with product quantities
    const editedQuantities = {
      "Red Pepsi": order.redPepsiQuantity.toString(),
      "Black Pepsi": order.blackPepsiQuantity.toString(),
      "Yellow Pepsi": order.yellowPepsiQuantity.toString(),
    };

    setEditedQuantities(editedQuantities);
    setEditedPaymentStatus(order.paymentStatus);

    // Remove ordered products from available products list
    const orderedProducts = Object.keys(editedQuantities);
    const otherProducts = availableProducts.filter(
      (product) => !orderedProducts.includes(product)
    );
    setAvailableOtherProducts(otherProducts);

    setEditModalVisible(true);
  };

  const handleAddOtherProduct = (product) => {
    const updatedQuantities = {
      ...editedQuantities,
      [product]: "0",
    };

    setEditedQuantities(updatedQuantities);
    setAvailableOtherProducts(
      availableOtherProducts.filter((p) => p !== product)
    );
  };

  const calculateUpdatedTotalamount = async () => {
    try {
      // Calculate total amount based on edited quantities
      const response = await client.post("/api/Order/calculateTotalAmount", {
        redPepsiQuantity: parseInt(editedQuantities["Red Pepsi"]) || 0,
        blackPepsiQuantity: parseInt(editedQuantities["Black Pepsi"]) || 0,
        yellowPepsiQuantity: parseInt(editedQuantities["Yellow Pepsi"]) || 0,
      });
      setTotalAmount((prev) => ({
        ...prev,
        totalAmount: response.data.totalAmount,
      }));
      console.log(totalAmount.totalAmount);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    calculateUpdatedTotalamount();
  }, [editedQuantities]);
  const handleSaveEdit = async () => {
    try {
      const isModified =
        editedPaymentStatus !== selectedOrder.paymentStatus ||
        Object.keys(editedQuantities).some(
          (product) =>
            parseInt(editedQuantities[product]) !==
            selectedOrder[`${product.toLowerCase().replace(" ", "")}Quantity`]
        );

      let updatedOrderDetails = {};

      if (isModified) {
        updatedOrderDetails = {
          redPepsiQuantity: parseInt(editedQuantities["Red Pepsi"]) || 0,
          blackPepsiQuantity: parseInt(editedQuantities["Black Pepsi"]) || 0,
          yellowPepsiQuantity: parseInt(editedQuantities["Yellow Pepsi"]) || 0,
          paymentStatus: editedPaymentStatus,
          totalAmount: totalAmount.totalAmount,
        };
        console.log(totalAmount);
      } else {
        updatedOrderDetails = {
          redPepsiQuantity: selectedOrder.redPepsiQuantity,
          blackPepsiQuantity: selectedOrder.blackPepsiQuantity,
          yellowPepsiQuantity: selectedOrder.yellowPepsiQuantity,
          paymentStatus: selectedOrder.paymentStatus,
          totalAmount: selectedOrder.totalAmount, // Retain the existing total amount
        };
      }

      const orderId = selectedOrder.orderID; // Extract orderID
      const _id = selectedOrder._id; // Extract _id (assuming _id is present in selectedOrder)

      // Pass both orderId and _id to the backend API
      const response = await client.put(
        `/api/Order/updateOrder/${orderId}/${_id}`, // Modify the API endpoint URL
        updatedOrderDetails
      );

      // Here, response.data contains the updated order details from the server

      const updatedOrders = ordersDetails.map((order) => {
        if (order.orderID === selectedOrder.orderID) {
          return {
            ...order,
            redPepsiQuantity: response.redPepsiQuantity,
            blackPepsiQuantity: response.blackPepsiQuantity,
            yellowPepsiQuantity: response.yellowPepsiQuantity,
            paymentStatus: response.paymentStatus,
            totalAmount: response.totalAmount, // Update the total amount
          };
        }
        console.log("totalammount", response.totalAmount);
        return order;
      });

      setOrdersDetails(updatedOrders);
      setEditModalVisible(false);
      fetchOrdersData(); // <-- This line seems redundant, as you're already updating ordersDetails state
    } catch (error) {
      console.error("Error updating order:", error);
      // Handle error
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Display confirmation dialog
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this order?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                // Make DELETE request to delete the order
                await client.delete(`/api/Order/deleteOrder/${orderId}`);
                const updatedOrders = ordersDetails.filter(
                  (order) => order.id !== orderId
                );
                setOrdersDetails(updatedOrders);
                fetchOrdersData();
              } catch (error) {
                console.error("Error deleting order:", error);
                // Handle error
              }
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      // Handle error
    }
  };

  const renderOrderItem = ({ item }) => (
    <>
      <View style={styles.orderCard} key={ordersDetails.orderID}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOrder(item.orderID)}
        >
          <Feather name="trash" size={24} color="red" />
        </TouchableOpacity>
        <Text style={styles.customerInfo}>Order ID: {item.orderID}</Text>
        <Text style={styles.customerInfo}>Customer ID: {item.customerID}</Text>
        <Text style={styles.customerInfo}>
          Customer Name: {item.customerName}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeader}>Product</Text>
            <Text style={styles.tableHeader}>Quantity</Text>
          </View>
          {item.orderDetails && item.orderDetails.length > 0 ? (
            item.orderDetails.map((order, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{order.product}</Text>
                <TextInput
                  style={styles.tableCell}
                  value={order.quantity.toString()}
                  onChangeText={(text) =>
                    handleProductQuantityChange(order.product, text)
                  }
                  keyboardType="numeric"
                />
              </View>
            ))
          ) : (
            <Text>No order details available</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditButtonPress(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.orderInfo}>
          Payment Status: {item.paymentStatus}
        </Text>
        <Text style={styles.orderInfo}>
          Payment Amount: ₹{item.totalAmount}
        </Text>
        <Text style={styles.orderInfo}>Date: {item.orderDate}</Text>
      </View>
    </>
  );

  const filteredOrders = ordersDetails.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) &&
      (!selectedDate || order.date === selectedDate)
  );

  const clearFilter = () => {
    setSearchText("");
    setSelectedDate(null);
  };

  const noRecordsFound = (
    <View style={styles.noRecordsFound}>
      <Text>No records found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, filterApplied]}
          onPress={handleAddNewOrder}
        >
          <Text>Add New Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.clearFilterButton,
            filterApplied && styles.filterApplied,
          ]}
          onPress={clearFilter}
        >
          <Text>Clear Filter</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer name"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.calendarIcon}
          onPress={() => setIsCalendarVisible(true)}
        >
          <Feather name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {filteredOrders.length === 0 && filterApplied && noRecordsFound}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Order</Text>
            {Object.keys(editedQuantities).map((product, index) => (
              <View key={index} style={styles.inputRow}>
                <Text style={styles.productName}>{product}</Text>
                <TextInput
                  style={styles.input}
                  value={editedQuantities[product]}
                  onChangeText={(text) =>
                    setEditedQuantities({
                      ...editedQuantities,
                      [product]: text,
                    })
                  }
                  placeholder="Enter Quantity"
                  keyboardType="numeric"
                />
              </View>
            ))}
            {availableOtherProducts.length > 0 && (
              <View style={styles.inputRow}>
                <Text style={styles.productName}>Add Other Product:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={null}
                  onValueChange={(value) => handleAddOtherProduct(value)}
                >
                  <Picker.Item label="-- Select Product --" value={null} />
                  {availableOtherProducts.map((product, index) => (
                    <Picker.Item key={index} label={product} value={product} />
                  ))}
                </Picker>
              </View>
            )}
            <View style={styles.paymentStatusRow}>
              <Text style={styles.paymentStatusText}>Payment Status:</Text>
              <Picker
                selectedValue={editedPaymentStatus}
                style={styles.picker}
                onValueChange={(value) => setEditedPaymentStatus(value)}
              >
                <Picker.Item label="Paid" value="Paid" />
                <Picker.Item label="Pending" value="Pending" />
              </Picker>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.productName}>
                Total Amount: {totalAmount.totalAmount}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSaveEdit} />
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
      {isCalendarVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCalendarVisible}
          onRequestClose={() => setIsCalendarVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <CalendarPicker
                onDateChange={(date) => {
                  const formattedDate = date
                    ? moment(date).format("YYYY-MM-DD")
                    : null;
                  setSelectedDate(formattedDate);
                  setIsCalendarVisible(false);
                }}
              />
              <Button
                title="Close"
                onPress={() => setIsCalendarVisible(false)}
                color="#ff7043"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterApplied: {
    backgroundColor: "#85c27f",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  clearFilterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    marginRight: 10,
  },
  calendarIcon: {
    padding: 5,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  customerInfo: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tableCell: {},
  editButton: {
    backgroundColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  editButtonText: {
    fontWeight: "bold",
  },
  orderInfo: {
    marginBottom: 5,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: 350,
    borderRadius: 10,
    elevation: 5,
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
  productName: {
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  paymentStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  paymentStatusText: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarContainer: {
    width: "100%",
    height: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  totalAmountContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OrderPage;
