// HomeScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <LinearGradient
    colors={["#262c37", "#11131c", "rgba(20,26,52,0.96)"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    locations={[0.23, 0.5, 0.96]}
    style={styles.container}
  >
    <View>
      <Text>Home Screen</Text>
    </View>
    </LinearGradient>
  );
};
const styles=StyleSheet.create({

  container: {
    flex: 1,
  }
})

export default HomeScreen;
