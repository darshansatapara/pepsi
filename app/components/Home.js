import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import WeekAnalysis from "../analysis/WeekAnalysis";
import CityWiseOrderAnalysis from "../analysis/CityWiseAnalysis";
import DateWiseAnalysis from "../analysis/DateWiseAnalysis";
import LastYMD from "../analysis/LastYMD";

const HomeScreen = ({ navigation }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshScreen = useCallback(() => {
    // Increment refresh key to trigger a re-render of child components
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <LastYMD />
        <CityWiseOrderAnalysis />
        <WeekAnalysis />
        <DateWiseAnalysis />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: "#AAAAAA",
    borderBottomColor: "#AAAAAA",
    borderLeftColor: 0,
    borderRightColor: 0,
    borderWidth: 2,
    flex: 1,
    backgroundColor: "#EEF7FF",
    paddingTop: 2,
    padding: 8,
  },
});

export default HomeScreen;
