import { Linking } from "react-native";

const sendWhatsAppMessage = (result) => {
  const message = `Order Confirmation:
    Order ID: ${result.orderID},
    Customer ID: ${result.customerID},
    Customer Name: ${result.customerName},
    City: ${result.city},
    Order Date: ${result.orderDate},
    Red Pepsi Quantity: ${result.redPepsiQuantity},
    Black Pepsi Quantity: ${result.blackPepsiQuantity},
    Yellow Pepsi Quantity: ${result.yellowPepsiQuantity},
    Total Amount: ${result.totalAmount},
    Payment Status: ${result.paymentStatus}`;
  let mobileNumber = result.mobileNumber;
  const phoneNumber = "91" + mobileNumber;
  console.log(phoneNumber); // '91' is the country code for India. Adjust accordingly.
  const url = `whatsapp://send?text=${encodeURIComponent(
    message
  )}&phone=${phoneNumber}`;

  Linking.openURL(url).catch(() => {
    Alert.alert("Error", "WhatsApp is not installed on your device");
  });
};

export default sendWhatsAppMessage;
