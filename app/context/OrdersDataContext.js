import React, { createContext, useContext, useState } from "react";
import client from "../axios";

const OrdersDataContext = createContext();

export const OrdersDataProvider = ({ children }) => {
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [cityWiseData, setCityWiseData] = useState(null);

  const fatchOrdersData = async () => {
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

  const fetchDataweeklyDataAnalysis = async () => {
    try {
      const response = await client.get("/api/Order/weekly-analysis");
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching data analysis", error);
    }
  };

  const fetchCityWiseAnalysis = async () => {
    try {
      const response = await client.get("/api/Order/city-wise-analysis");
      setCityWiseData(response.data);
    } catch (error) {
      console.error("Error fetching city-wise analysis data:", error);
      // Optionally handle the error here
    }
  };

  return (
    <OrdersDataContext.Provider
      value={{
        ordersDetails,
        setOrdersDetails,
        fatchOrdersData,
        fetchDataweeklyDataAnalysis,
        weeklyData,
        setWeeklyData,
        fetchCityWiseAnalysis,
        cityWiseData,
      }}
    >
      {children}
    </OrdersDataContext.Provider>
  );
};

export const useOrdersData = () => useContext(OrdersDataContext);
