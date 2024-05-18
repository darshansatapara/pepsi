import React from "react";
import { StyleSheet } from "react-native";
import Navigation from "./app/components/Navigation";
import { OrdersDataProvider } from "./app/context/OrdersDataContext";

export default function App() {
  return (
    <>
      <OrdersDataProvider>
        <Navigation />
      </OrdersDataProvider>
    </>
  );
}
