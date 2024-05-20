import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import client from "../axios";

const CityWiseOrderAnalysis = () => {
  const [cityWiseData, setCityWiseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("/api/Order/city-wise-analysis");
        setCityWiseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching city-wise analysis data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!cityWiseData || Object.keys(cityWiseData).length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  // Extract labels and data from the analysis data object
  const labels = Object.keys(cityWiseData);
  const values = labels.map((label) => cityWiseData[label].totalAmount);

  // Prepare data for the pie chart
  const pieData = labels.map((label, index) => ({
    name: label,
    value: values[index],
    color: `rgb(${index * 50}, ${255 - index * 50}, ${Math.random() * 200})`, // Random color for each slice
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>City-wise Order Analysis</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get("window").width}
        height={200}
        chartConfig={{
          backgroundColor: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: 370,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    justifyContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#BED7DC",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 0,
    fontWeight: "bold",
  },
});

export default CityWiseOrderAnalysis;
