import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import client from "../axios";

const DateWiseAnalysis = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchDisabled, setFetchDisabled] = useState(true); // State to disable fetch button

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await client.get("/api/Order/available-years");
        setAvailableYears(response.data);
      } catch (error) {
        console.error("Error fetching available years:", error);
      }
    };
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    // Enable or disable fetch button based on whether a year, month, or date is selected
    setFetchDisabled(!(year || month || date));
  }, [year, month, date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await client.get("/api/Order/date-wise-analysis", {
        params: { year, month, date },
      });
      setTotalAmount(response.data.totalAmount);
    } catch (error) {
      console.error("Error fetching date-wise analysis data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setYear("");
    setMonth("");
    setDate("");
    setTotalAmount(null); // Clear previous search result
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
      <View style={styles.buttonContainer}>
        <Button
          title="Fetch Data"
          onPress={fetchData}
          disabled={fetchDisabled}
        />
        <Button title="Clear" onPress={clearSelection} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        totalAmount !== null && (
          <Text style={styles.totalAmount}>Total Amount: ${totalAmount}</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#EEF7FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  totalAmount: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DateWiseAnalysis;
