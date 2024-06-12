import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useOrdersData } from "../context/OrdersDataContext";

const AnalysisSummary = () => {
  const {
    fetchLastCurrentMonthData,
    fetchLastCurrentYearData,
    lastCurrentYearData,
    lastCurrentMonthData,
  } = useOrdersData();
  useEffect(() => {
    fetchLastCurrentYearData();
    fetchLastCurrentMonthData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Year Analysis</Text>
        {lastCurrentYearData ? (
          <>
            <View style={styles.analysisContainer}>
              <Text style={styles.subtitle}>Last Year</Text>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Amount:</Text>
                <Text style={styles.ValueText2}>₹{lastCurrentYearData.lastYear.totalAmount}</Text>
              </View>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Count:</Text>
                <Text style={styles.ValueText2}>{lastCurrentYearData.lastYear.totalCount}</Text>
              </View>
            </View>
            <View style={styles.analysisContainer}>
              <Text style={styles.subtitle}>Current Year</Text>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Amount:</Text>
                <Text style={styles.ValueText2}>₹{lastCurrentYearData.currentYear.totalAmount}</Text>
              </View>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Count:</Text>
                <Text style={styles.ValueText2}>{lastCurrentYearData.currentYear.totalCount}</Text>
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator size="small" color="#0000ff" />
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Month Analysis</Text>
        {lastCurrentMonthData ? (
          <>
            <View style={styles.analysisContainer}>
              <Text style={styles.subtitle}>Last Month</Text>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText} >Total Amount:</Text>
                <Text style={styles.ValueText2} >₹{lastCurrentMonthData.lastMonth.totalAmount}</Text>
              </View>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Count:</Text>
                <Text style={styles.ValueText2}>{lastCurrentMonthData.lastMonth.totalCount}</Text>
              </View>
            </View>
            <View style={styles.analysisContainer}>
              <Text style={styles.subtitle}>Current Month</Text>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Amount:</Text>
                <Text style={styles.ValueText2}>₹{lastCurrentMonthData.currentMonth.totalAmount}</Text>
              </View>
              <View style={styles.analysisText}>
                <Text style={styles.ValueText}>Total Count:</Text>
                <Text style={styles.ValueText2}>{lastCurrentMonthData.currentMonth.totalCount}</Text>
              </View>
            </View>
          </>
        ) : (
          <ActivityIndicator size="small" color="#0000ff" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: 370,
    paddingTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    marginTop: 5,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 1,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#CDE8E5",
  },
  card: {
    width: 175,
    height:250,
    margin: 5,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#F6E6C2",
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    borderBottomColor:"#000",
    borderBottomWidth: 1,
    borderStyle:"dashed",
    paddingBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    borderBottomColor:"#000",
    borderBottomWidth: 1,
    borderStyle:"dotted",
    paddingBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  analysisContainer: {
    backgroundColor:"#FAEED1",
    marginBottom: 10,
    paddingRight:15,
    borderColor:"#000",
    borderWidth: 1,
    paddingLeft:4,
    borderRadius:5,
  },
  analysisText: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  ValueText:{
    fontSize:15,
  },
  ValueText2:{
    fontSize:15,
  }
});

export default AnalysisSummary;
