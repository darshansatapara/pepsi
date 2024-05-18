import React, { useContext, useEffect, useState } from "react";
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
import { Feather, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import client from "../axios";
import { differenceInDays, parse, format, isSameDay } from "date-fns";
import { Card, DataTable } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
  OrdersDataProvider,
  useOrdersData,
} from "../context/OrdersDataContext";

const availableProducts = ["Red Pepsi", "Black Pepsi", "Yellow Pepsi"];
const OrderPage = ({ navigation }) => {
  const { ordersDetails, setOrdersDetails, fatchOrdersData } = useOrdersData();
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
    fatchOrdersData();
  }, []);

  useEffect(() => {
    if (!searchText && !selectedDate) {
      setFilterApplied(false);
    } else {
      setFilterApplied(true);
    }
  }, [searchText, selectedDate]);

  const handleAddNewOrder = () => {
    navigation.navigate("AddNewOrder", { fatchOrdersData: fatchOrdersData });
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
      // console.log(totalAmount.totalAmount);
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
      } else {
        updatedOrderDetails = {
          redPepsiQuantity: selectedOrder.redPepsiQuantity,
          blackPepsiQuantity: selectedOrder.blackPepsiQuantity,
          yellowPepsiQuantity: selectedOrder.yellowPepsiQuantity,
          paymentStatus: selectedOrder.paymentStatus,
          totalAmount: selectedOrder.totalAmount,
        };
      }

      const orderId = selectedOrder.orderID;
      const _id = selectedOrder._id;

      // Pass both orderId and _id to the backend API
      const response = await client.put(
        `/api/Order/updateOrder/${orderId}/${_id}`,
        updatedOrderDetails
      );

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
        return order;
      });

      setOrdersDetails(updatedOrders);
      setEditModalVisible(false);
      fatchOrdersData();
    } catch (error) {
      console.error("Error updating order:", error);
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
                fatchOrdersData();
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

  const renderOrderItem = ({ item }) => {
    const orderDateParts = item.orderDate.split("-");
    const orderDate = parse(
      `${orderDateParts[2]}-${orderDateParts[1]}-${orderDateParts[0]}`,
      "yyyy-MM-dd",
      new Date()
    );

    // Calculate the difference in days between the order date and the current date
    const currentDate = new Date();
    const daysDifference = differenceInDays(currentDate, orderDate);
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.topRow}>
            <View style={styles.leftContainer}>
              <Text style={styles.customerInfo}>Order ID: {item.orderID}</Text>
              <Text style={styles.customerInfo}>
                Customer ID: {item.customerID}
              </Text>
              <View style={styles.customerName}>
                <Text style={styles.customerInfo}>Customer Name:</Text>
                <Text style={styles.customerInfo}> {item.customerName}</Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              {daysDifference <= 7 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeleteOrder(item.orderID)}
                >
                  <MaterialIcons name="delete" size={24} color="#21243a" />
                </TouchableOpacity>
              )}
              {daysDifference <= 7 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditButtonPress(item)}
                >
                  <FontAwesome6 name="edit" size={24} color="#21243a" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.table}>
            <DataTable>
              <DataTable.Header style={styles.header}>
                <DataTable.Title>
                  <Text style={styles.titleText}>Product</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.titleText}>Quantity</Text>
                </DataTable.Title>
              </DataTable.Header>

              <DataTable.Row style={styles.row}>
                <DataTable.Cell>
                  <Text style={styles.cellText}>Red Pepsi</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.cellText}>{item.redPepsiQuantity}</Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row style={styles.row}>
                <DataTable.Cell>
                  <Text style={styles.cellText}>Black Pepsi</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.cellText}>{item.blackPepsiQuantity}</Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row style={styles.row}>
                <DataTable.Cell>
                  <Text style={styles.cellText}>Yellow Pepsi</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.cellText}>
                    {item.yellowPepsiQuantity}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>

          <Text style={styles.orderInfo}>
            Payment Status: {item.paymentStatus}
          </Text>
          <Text style={styles.orderInfo}>
            Payment Amount: ₹{item.totalAmount}
          </Text>
          <Text style={styles.orderInfo}>Date: {item.orderDate}</Text>
        </Card.Content>
      </Card>
    );
  };

  const filteredOrders = ordersDetails.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) &&
      (!selectedDate ||
        isSameDay(
          parse(order.orderDate, "dd-MM-yyyy", new Date()),
          parse(selectedDate, "dd-MM-yyyy", new Date())
        ))
  );

  const clearFilter = () => {
    setSearchText("");
    setSelectedDate(null);
  };

  const noRecordsFound = (
    <View style={styles.noRecordsFound}>
      <Text style={styles.NoRecordes}>No records found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer name"
          placeholderTextColor={"#000"}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.calendarIcon}
          onPress={() => setIsCalendarVisible(true)}
        >
          <Feather name="calendar" size={27} color="#303841" />
        </TouchableOpacity>
      </View>
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
                <Text style={styles.productName}>{product}:</Text>
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
              <View style={styles.picker}>
                <Picker
                  selectedValue={editedPaymentStatus}
                  onValueChange={(value) => setEditedPaymentStatus(value)}
                >
                  <Picker.Item label="Paid" value="Paid" />
                  <Picker.Item label="Pending" value="Pending" />
                </Picker>
              </View>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.productName}>
                Total Amount: {totalAmount.totalAmount}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.SaveButton}
                title="Save"
                onPress={handleSaveEdit}
              >
                <Text style={styles.ButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                title="Cancel"
                style={styles.CancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.ButtonText}>Cancel</Text>
              </TouchableOpacity>
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
                    ? format(date, "dd-MM-yyyy")
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
    borderTopColor: "#AAAAAA",
    borderBottomColor: "#AAAAAA",
    borderLeftColor: 0,
    borderRightColor: 0,
    borderWidth: 2,
    flex: 1,
    backgroundColor: "#EEF7FF",
    paddingTop: 5,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
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
    marginBottom: 8,
    marginTop: 2,
    color: "white",
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "black",
    backgroundColor: "rgba(224, 218, 218, 0.5)",
    borderColor: "#303841",
    fontWeight: "900",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  calendarIcon: {
    padding: 5,
  },
  orderList: {
    paddingBottom: 20,
  },
  card: {
    margin: 5,
    backgroundColor: "#CDE8E5",
    borderRadius: 10,
    borderWidth: 1,
    borderCurve: "round",
    shadowColor: "#303841",
    shadowOpacity: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
    marginTop: 5,
  },
  leftContainer: {
    flex: 4,
  },
  rightContainer: {
    marginTop: -2,
    marginRight: -10,
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#BED1CF",
    borderRadius: 15,
    paddingTop: 3,
    paddingLeft: 7,
    width: 40,
    height: 35,
    marginRight: 10,
  },
  customerInfo: {
    marginBottom: 5,
    fontSize: 16,
    color: "#000",
  },
  customerName: {
    flexDirection: "row",
    alignItems: "center",
  },
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#000",
    overflow: "hidden",
  },
  highlightRow: {
    color: "#000",
  },
  NoRecordes: {
    color: "#000",
    justifyContet: "center",
    alignSelf: "center",
  },

  header: {
    borderBottomColor: "#000",
    backgroundColor: "#E0FBE2",
  },
  titleText: {
    fontWeight: "900",
    fontSize: 17,
    color: "#000",
    fontWeight: "bold",
  },
  row: {
    backgroundColor: "#FFEFEF",
    borderBottomColor: "#000000",
  },
  cellText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#000",
  },
  orderInfo: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  modalContent: {
    backgroundColor: "#F7F6BB",
    padding: 20,
    width: 350,
    border: "#000",
    borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 25,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productName: {
    flex: 1,
    fontSize: 17,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  paymentStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  paymentStatusText: {
    marginRight: 10,
    fontSize: 17,
  },
  picker: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginLeft: 17,
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  CancelButton: {
    color: "#000",
    backgroundColor: "#BFCFE7",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 80,
    borderRadius: 20,
  },
  SaveButton: {
    color: "#000",
    backgroundColor: "#C5EBAA",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    width: 80,
    borderRadius: 20,
    marginRight: 10,
  },
  ButtonText: {
    top: 10,
    fontSize: 15,
    alignSelf: "center",
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
