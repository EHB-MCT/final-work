// TODO: change this file to index.tsx?
import React from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { colors } from "@/constants/Colors";
import mapStyle from "@/assets/mapStyle.json";
import { LineChart } from "react-native-chart-kit";
export default function HomeScreen() {
  const data = {
    labels: ["Ma", "Di", "Woe", "Dond", "Vrij", "Zat", "Zon"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        // color: "black",
      },
    ],
  };

  const chartConfig = {
    // backgroundColor: "#e26a00",
    backgroundGradientFrom: "#19162B",
    backgroundGradientTo: "#19162B",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === "android" ? undefined : "google"}
        customMapStyle={mapStyle}
        style={styles.map}
        initialRegion={{
          latitude: 50.8503, // Brussels
          longitude: 4.3517,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 50.8503, longitude: 4.3517 }} // TODO: use backend data
          title="Pixel"
          description="Hier is je kat!"
        />
      </MapView>
      <View style={styles.bottomContainer}>
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 10 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    top: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2.5,
  },

  chartContainer: {
    flex: 1,
    // top0
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: colors.background,
    padding: 16,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.background,
    backgroundColor: colors.background,
    borderRadius: 10,
    // top: -30,
    boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.64)",
    height: Dimensions.get("window").height,
  },
});
