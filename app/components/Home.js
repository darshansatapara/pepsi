// HomeScreen.js
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
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
    paddingTop: 5,
    padding: 8,
  },
});

export default HomeScreen;
