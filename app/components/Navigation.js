import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home";
import CustomerDetails from "./CustomerDetailsPage";
import Order from "./Orderpage";
import AddCustomerPage from "./AddCustomerPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { backgroundColor: '#f2f2f2' },
        labelStyle: { fontSize: 12 },
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Order}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AddCustomer" component={AddCustomerPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
