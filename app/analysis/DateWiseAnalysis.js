import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useOrdersData } from "../context/OrdersDataContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const DateWiseAnalysis = () => {
  const [fetchDisabled, setFetchDisabled] = useState(true);
  const {
    fetchAvailableYears,
    availableYears,
    setLoading,
    loading,
    fetchDateWiseAnalysis,
    year,
    month,
    date,
    totalAmount,
    totalCount,
    setYear,
    setMonth,
    setDate,
    setTotalAmount,
    setTotalCount,
  } = useOrdersData();

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    setFetchDisabled(!year && !month && !date);
  }, [year, month, date]);

  const handleFetch = async () => {
    await fetchDateWiseAnalysis();
  };

  const clearSelection = () => {
    setYear("");
    setMonth("");
    setDate("");
    setTotalAmount(0);
    setTotalCount(0);
  };

  const availableMonths = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const availableDates = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return { label: String(day), value: day < 10 ? `0${day}` : String(day) };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Date-wise Order Analysis</Text>
      <View style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={year}
            onValueChange={(itemValue) => setYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Year" value="" />
            {availableYears.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
          <Picker
            selectedValue={month}
            onValueChange={(itemValue) => setMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Month" value="" />
            {availableMonths.map((month) => (
              <Picker.Item
                key={month.value}
                label={month.label}
                value={month.value}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={date}
            onValueChange={(itemValue) => setDate(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Date" value="" />
            {availableDates.map((date) => (
              <Picker.Item
                key={date.value}
                label={date.label}
                value={date.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <View style={styles.totalAmount}>
                <Text style={styles.totalAmount}>Total Amount :</Text>
                <Text style={styles.totalAmount}>
                  ₹ {totalAmount ? totalAmount : 0}
                </Text>
              </View>
              <View style={styles.totalCount}>
                <Text style={styles.totalCount}>
                  Total Orders: {totalCount ? totalCount : 0}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          title="Fetch Data"
          onPress={handleFetch}
          disabled={fetchDisabled}
          color="#4CAF50"
          style={styles.fetchbutton}
        >
          <Text style={styles.buttonText}>Fetch Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          title="Clear"
          style={styles.clearButton}
          onPress={clearSelection}
          color="#f44336"
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 370,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: "#CDE8E5",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "#CDF5FD",
    marginBottom: 16,
    borderRadius: 5,
  },
  resultContainer: {
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    backgroundColor: "#CDF5FD",
    padding: 10,
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  totalAmount: {
    fontSize: 18,
    flexDirection: "column",
    fontWeight: "bold",
    alignItems: "center",
  },
  totalCount: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: "bold",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  buttonText:{
    fontSize: 17,
  },
  fetchbutton: {
    borderColor: "#000",
    marginLeft: 10,
    width: 100,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#AAE3E2",
  },
  clearButton: {
    borderColor: "#000",
    marginLeft: 10,
    width: 100,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FD5D5D",
  },
});

export default DateWiseAnalysis;
