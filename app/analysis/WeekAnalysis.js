import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { useOrdersData } from "../context/OrdersDataContext";

const WeekAnalysis = () => {
  const { fetchDataweeklyDataAnalysis, weeklyData } = useOrdersData();

  useEffect(() => {
    fetchDataweeklyDataAnalysis();
  }, []);

  if (!weeklyData) {
    return <Text>Loading...</Text>;
  }
  const labels = Object.keys(weeklyData.dailyData);
  const totalAmounts = labels.map(
    (date) => weeklyData.dailyData[date].totalAmount
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Week Analysis</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: totalAmounts }],
            }}
            width={Dimensions.get("window").width}
            height={200}
            
            chartConfig={{
              backgroundGradientFrom: "#EFBC9B",
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: "#EFBC9B",
              backgroundGradientToOpacity: 1,
              fillShadowGradientOpacity: 1,
              color: (opacity = 1) => `#023047`,
              labelColor: (opacity = 1) => `#333`,
              strokeWidth: 2,
              useShadowColorFromDataset: false,
              decimalPlaces: 0,
            }}
            bezier
            style={{ ...styles.chart, marginVertical: 8, borderRadius: 16 }}
          />
          <Text style={styles.total}>
            Weekly Total: ₹ {weeklyData.weeklyTotal}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 295,
    width: 370,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    justifyContent: "center",
    padding: 5,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#CDE8E5",
  },
  chartContainer: {
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
    paddingLeft: 10,
    
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    paddingLeft: 10,
    fontWeight: "bold",
    marginBottom: 7,
  },
  total: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
});
export default WeekAnalysis;
