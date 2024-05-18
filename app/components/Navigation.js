import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Home from "./Home";
import CustomerDetails from "./CustomerDetailsPage";
import OrderPage from "./OrderPage";
import AddCustomerPage from "./AddCustomerPage";
import AddNewOrder from "./AddNewOrder";
import CustomerProfile from "./CustomerProfilePage";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { OrdersDataProvider } from "../context/OrdersDataContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: 15, color: "#000" },
        activeTintColor: "#151B54",
        inactiveTintColor: "#B4B4B8",
        backgroundColor: "#ffefd5",
        color: "#000",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTintColor: "#E1F0DA",
          headerStatusBarHeight: 22,

          title: "Home",
          headerTitleStyle: {
            fontSize: 25,
            color: "#151B54",
            fontWeight: "bold",
          },

          headerStyle: {
            backgroundColor: "#FFF6E9",
          },
          headerTitle: { color: "white", fontSize: 16 },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarItemStyle: { backgroundColor: "#F9F3F3" },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderPage}
        options={{
          headerTintColor: "#E1F0DA",
          headerStatusBarHeight: 22,
          title: "Orders",
          headerTitleStyle: {
            fontSize: 25,
            color: "#151B54",
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: "#FFF6E9",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="table-list" size={24} color={color} />
          ),
          tabBarItemStyle: { backgroundColor: "#F9F3F3" },
        }}
      />
      <Tab.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={{
          title: "Customer Details",
          headerTitleStyle: {
            fontSize: 25,
            color: "#151B54",
            fontWeight: "bold",
          },
          headerTintColor: "#151B54",
          headerStatusBarHeight: 22,
          headerStyle: {
            backgroundColor: "#FFF6E9",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarItemStyle: { backgroundColor: "#F9F3F3" },
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCustomer"
          options={{
            title: "AddCustomer",
            headerTitleStyle: {
              fontSize: 25,
              color: "#151B54",
              fontWeight: "bold",
            },
            headerTintColor: "#151B54",
            headerStyle: {
              backgroundColor: "#FFF6E9",
            },
          }}
          component={AddCustomerPage}
        />

        <Stack.Screen
          name="AddNewOrder"
          options={{
            title: "AddNewOrder",
            headerTitleStyle: {
              fontSize: 25,
              color: "#151B54",
              fontWeight: "bold",
            },
            headerTintColor: "#151B54",
            headerStyle: {
              backgroundColor: "#FFF6E9",
            },
          }}
          component={AddNewOrder}
        />

        <Stack.Screen
          name="CustomerProfile"
          component={CustomerProfile}
          options={{
            title: "Customer Profile",
            headerTitleStyle: {
              fontSize: 25,
              color: "#151B54",
              fontWeight: "bold",
            },
            headerTintColor: "#151B54",
            headerStyle: {
              backgroundColor: "#FFF6E9",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
