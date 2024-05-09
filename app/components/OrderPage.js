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
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Mock order data
const ordersData = [
  {
    id: 1,
    customerId: 1,
    customerName: "John Doe",
    orderDetails: [
      { product: "Red Pepsi", quantity: 2 },
      { product: "Black Pepsi", quantity: 1 },
    ],
    paymentStatus: "Paid",
    paymentAmount: 50,
    date: "2024-05-09",
  },
  {
    id: 3,
    customerId: 3,
    customerName: "Jane Doe",
    orderDetails: [{ product: "Yellow Pepsi", quantity: 3 }],
    paymentStatus: "Pending",
    paymentAmount: 25,
    date: "2024-05-08",
  },
  // Your order data here...
];

const availableProducts = ["Red Pepsi", "Black Pepsi", "Yellow Pepsi"];

const OrderPage = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [editedPaymentStatus, setEditedPaymentStatus] = useState("");
  const [availableOtherProducts, setAvailableOtherProducts] = useState([]);

  useEffect(() => {
    // Fetch order data from backend server or local storage
    setOrders(ordersData);
  }, []);

  const handleAddNewOrder = () => {
    navigation.navigate("AddNewOrder");
  };

  const handleEditButtonPress = (order) => {
    setSelectedOrder(order);
    const quantities = {};
    order.orderDetails.forEach((detail) => {
      quantities[detail.product] = detail.quantity.toString();
    });
    setEditedQuantities(quantities);
    setEditedPaymentStatus(order.paymentStatus);

    // Determine available other products
    const orderedProducts = order.orderDetails.map((detail) => detail.product);
    const otherProducts = availableProducts.filter(
      (product) => !orderedProducts.includes(product)
    );
    setAvailableOtherProducts(otherProducts);

    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    // Update the payment status and quantity of the selected order
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedOrderDetails = Object.keys(editedQuantities).map((product) => {
          return {
            product,
            quantity: parseInt(editedQuantities[product]) || 0,
          };
        });
        return {
          ...order,
          orderDetails: updatedOrderDetails,
          paymentStatus: editedPaymentStatus,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    setEditModalVisible(false);
  };

  const handleAddOtherProduct = (product) => {
    const updatedQuantities = {
      ...editedQuantities,
      [product]: "0", // Initialize quantity as 0 for the new product
    };

    setEditedQuantities(updatedQuantities);
    setAvailableOtherProducts(availableOtherProducts.filter((p) => p !== product));
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.customerInfo}>Customer ID: {item.customerId}</Text>
      <Text style={styles.customerInfo}>
        Customer Name: {item.customerName}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Product</Text>
          <Text style={styles.tableHeader}>Quantity</Text>
        </View>
        {item.orderDetails.map((order, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{order.product}</Text>
            <Text style={styles.tableCell}>{order.quantity}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditButtonPress(item)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <Text style={styles.orderInfo}>Payment Status: {item.paymentStatus}</Text>
      <Text style={styles.orderInfo}>
        Payment Amount: ₹{item.paymentAmount}
      </Text>
      <Text style={styles.orderInfo}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewOrder}>
                <Text>Add New Order</Text>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    // backgroundColor: "red",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tableCell: {
    // flex: 1,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
},
});

export default OrderPage;
