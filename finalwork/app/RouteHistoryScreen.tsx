import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

export default function RouteHistoryScreen() {
  const dummyData = [
    { latitude: 50.8503, longitude: 4.3517 },
    { latitude: 50.8506, longitude: 4.3518 },
    { latitude: 50.8509, longitude: 4.3519 },
  ]; // Later vervangen door echte historiek

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50.8503,
          longitude: 4.3517,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={dummyData} strokeColor="purple" strokeWidth={3} />
        <Marker coordinate={dummyData[0]} title="Start" pinColor="green" />
        <Marker coordinate={dummyData[dummyData.length - 1]} title="Einde" pinColor="red" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
