// TODO: change this file to index.tsx?
import React from "react";
import { StyleSheet, View, Dimensions, Platform, Text } from "react-native";
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
      <View style={styles.dataContainer}>
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
        <View style={styles.bottomContainer}>
          <View style={styles.activityContainer}>
            <Text style={styles.activitySlot}>Activity 1</Text>
            <Text style={styles.activitySlot}>Activity 2</Text>
            <Text style={styles.activitySlot}>Activity 3</Text>
            <Text style={styles.activitySlot}>Activity 4</Text>
          </View>
          <View style={styles.activityContainer}>
            <LineChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                datasets: [
                  {
                    data: [20, 45, 28, 80, 99],
                  },
                ],
              }}
              width={150}
              height={100}
              chartConfig={{
                backgroundColor: "#19162B",
                backgroundGradientFrom: "#19162B",
                backgroundGradientTo: "#19162B",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              bezier
              style={{ borderRadius: 10, marginTop: 20 }}
            />
            {/* <Text style={styles.activitySlot}>Weekly Activity</Text> */}
          </View>
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

  dataContainer: {
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

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    // backgroundColor: colors.background,
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginTop: 16,
  },

  activityContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    height: 150,
    marginVertical: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 8,
  },

  activitySlot: {
    color: "white",
    fontSize: 16,
    marginVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    borderLeftWidth: 3,
    paddingLeft: 8,
    borderLeftColor: colors.secondary,
  },
});
