import React, { createContext, useContext, useState } from "react";
import client from "../axios";

const OrdersDataContext = createContext();

export const OrdersDataProvider = ({ children }) => {
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [cityWiseData, setCityWiseData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalCount, setTotalCount] = useState(null); // New state for total count
  const [loading, setLoading] = useState(false);
  const [Cityloading, setCityLoading] = useState(true);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [lastCurrentYearData, setLastCurrentYearData] = useState(null);
  const [lastCurrentMonthData, setLastCurrentMonthData] = useState(null);

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
  // city wise data
  const fetchCityWiseAnalysis = async () => {
    try {
      const response = await client.get("/api/Order/city-wise-analysis");
      setCityWiseData(response.data);
      setCityLoading(false);
    } catch (error) {
      console.error("Error fetching city-wise analysis data:", error);
    }
  };

  // fetch Available Years
  const fetchAvailableYears = async () => {
    try {
      const response = await client.get("/api/Order/available-years");
      setAvailableYears(response.data);
    } catch (error) {
      console.error("Error fetching available years:", error);
    }
  };

  const fetchDateWiseAnalysis = async () => {
    setLoading(true);
    try {
      const response = await client.get("/api/Order/date-wise-analysis", {
        params: { year, month, date },
      });
      setTotalAmount(response.data.totalAmount);
      setTotalCount(response.data.totalCount); // Set total count
    } catch (error) {
      console.error("Error fetching date-wise analysis data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchLastCurrentYearData = async () => {
    try {
      const response = await client.get(
        "/api/Order/last-current-year-analysis"
      );
      const data = await response.data;
      setLastCurrentYearData(data);
    } catch (error) {
      console.error("Error fetching last and current year data:", error);
    }
  };

  const fetchLastCurrentMonthData = async () => {
    try {
      const response = await client.get(
        "/api/Order/last-current-month-analysis"
      );
      const data = await response.data;
      setLastCurrentMonthData(data);
    } catch (error) {
      console.error("Error fetching last and current month data:", error);
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
        setCityWiseData,
        fetchAvailableYears,
        availableYears,
        setAvailableYears,
        fetchDateWiseAnalysis,
        totalAmount,
        setTotalAmount,
        totalCount, // Include total count in context value
        setTotalCount, // Provide setter for total count
        loading,
        setLoading,
        year,
        setYear,
        month,
        setMonth,
        date,
        setDate,
        Cityloading,
        fetchLastCurrentMonthData,
        fetchLastCurrentYearData,
        lastCurrentYearData,
        lastCurrentMonthData,
        setLastCurrentMonthData,
        setLastCurrentYearData,
      }}
    >
      {children}
    </OrdersDataContext.Provider>
  );
};

export const useOrdersData = () => useContext(OrdersDataContext);
