import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import WeekAnalysis from "../analysis/WeekAnalysis";
import CityWiseOrderAnalysis from "../analysis/CityWiseAnalysis";
import DateWiseAnalysis from "../analysis/DateWiseAnalysis";

const HomeScreen = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshScreen = useCallback(() => {
    // Increment refresh key to trigger a re-render of child components
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <DateWiseAnalysis key={refreshKey} refreshScreen={refreshScreen} />
        <WeekAnalysis key={refreshKey} refreshScreen={refreshScreen} />
        <CityWiseOrderAnalysis key={refreshKey} refreshScreen={refreshScreen} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF7FF",
  },
});

export default HomeScreen;
