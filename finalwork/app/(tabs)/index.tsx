import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Platform,
} from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mapStyle from "@/assets/mapStyle.json";
import { fetchLatestCatLocation } from "../services/apiCalls";
import { colors } from "@/constants/Colors";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

type DataPoint = { timestamp: string; value: number };

// Group values by weekday
function groupByDay(data: DataPoint[]) {
  const grouped: Record<string, number> = {};
  data.forEach(({ timestamp, value }) => {
    const raw = new Date(timestamp).toLocaleDateString("nl-BE", {
      weekday: "short",
    });
    const day = raw[0].toUpperCase() + raw.slice(1);
    grouped[day] = (grouped[day] || 0) + value;
  });
  return WEEKDAYS.map((d) => grouped[d] || 0);
}

export default function HomeScreen() {
  const [catImageUri, setCatImageUri] = useState<string | null>(null);
  const [catLocation, setCatLocation] = useState<LatLng>({
    latitude: 50.904918,
    longitude: 4.355563,
  });
  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [jumpData, setJumpData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Load cat image URI from AsyncStorage
    AsyncStorage.getItem("profileImage")
      .then((uri) => uri && setCatImageUri(uri))
      .catch(console.error);

    // Fetch latest cat location every 10 seconds
    const interval = setInterval(async () => {
      try {
        const loc = await fetchLatestCatLocation();
        if (loc?.timestamp) {
          const ts = loc.timestamp as string;
          setActivityData((prev) => {
            if (prev.length === 0 || prev[prev.length - 1].timestamp !== ts) {
              return [
                ...prev,
                { timestamp: ts, value: loc.activityLevel ?? 0 },
              ];
            }
            return prev;
          });
          setJumpData((prev) => {
            if (prev.length === 0 || prev[prev.length - 1].timestamp !== ts) {
              return [...prev, { timestamp: ts, value: loc.jump ?? 0 }];
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const moveByDay = groupByDay(activityData);
  const jumpByDay = groupByDay(jumpData);

  const dataSet = {
    move: moveByDay,
    jump: jumpByDay,
  };

  const chartData = {
    labels: WEEKDAYS,
    datasets: [{ data: dataSet.move }],
  };

  const total = dataSet.move.reduce((sum, n) => sum + n, 0);
  const totalHours = (total / 60).toFixed(1);

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === "android" ? undefined : "google"}
        customMapStyle={mapStyle}
        style={styles.map}
        initialRegion={{
          // 50.841671, "longitude": 4.323001
          latitude: catLocation.latitude,
          longitude: catLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={catLocation}>
          {catImageUri ? (
            <Image
              source={{ uri: catImageUri }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#ccc",
              }}
            />
          )}
        </Marker>
      </MapView>

      <View style={styles.dataContainer}>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#19162B",
              backgroundGradientTo: "#19162B",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
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
    padding: 16,
  },
  dataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 10,
    height: Dimensions.get("window").height,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
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
