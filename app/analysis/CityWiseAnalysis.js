import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useOrdersData } from "../context/OrdersDataContext";

const CityWiseOrderAnalysis = () => {
  const {
    fetchCityWiseAnalysis,
    Cityloading,
    cityWiseData,
  } = useOrdersData();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCityWiseAnalysis();
  }, []);

  if (Cityloading) {
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

  const labels = Object.keys(cityWiseData);
  const pieData = labels.map((label, index) => ({
    name: `${label} (${cityWiseData[label].count})`,
    population: cityWiseData[label].totalAmount,
    color: `rgb(${index * 50}, ${255 - index * 50}, ${Math.random() * 200})`,
    legendFontColor: "#000",
    legendFontSize: 15,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>City-wise Order Analysis</Text>
      <ScrollView horizontal>
      <PieChart
        data={pieData}
        width={500}
        height={200}
        chartConfig={{
          backgroundColor: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="-15"
        absolute
        style={styles.chart}
      />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: 370,
    marginBottom: 2,
    marginTop: 2,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#CDE8E5",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default CityWiseOrderAnalysis;
