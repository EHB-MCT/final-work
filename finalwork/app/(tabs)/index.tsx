import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Platform,
  ImageBackground,
} from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mapStyle from "@/assets/mapStyle.json";
import { fetchLatestCatLocation } from "../services/apiCalls";
import { colors } from "@/constants/Colors";
import CircularProgress from "@/components/CircularProgress";
import { BlurView } from "expo-blur";
import SoundIcon from "../../assets/icons/sound.svg";
import BatteryIcon from "../../assets/icons/battery.svg";

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
      <ImageBackground
        source={require("../../assets/images/greenBlobBg.png")}
        style={StyleSheet.absoluteFill} // fills the entire container
        resizeMode="cover"
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0)" },
          ]}
        />
      </ImageBackground>
      <View style={styles.mapWrapper}>
        <MapView
          provider={Platform.OS === "android" ? undefined : "google"}
          customMapStyle={mapStyle}
          style={styles.map}
          initialRegion={{
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

        {/* Overlay text inside the map wrapper */}
        <Text style={styles.overlayText}>Indoors</Text>
      </View>
      <View style={styles.dataContainer}>
        <ImageBackground
          source={require("../../assets/images/dataBG.png")}
          style={styles.dataBox}
          imageStyle={{ borderRadius: 12 }} // optional rounded corners
        >
          <Text style={styles.dataText}>Activiteit</Text>
        </ImageBackground>
        <ImageBackground
          source={require("../../assets/images/dataBG.png")}
          style={styles.dataBox}
          imageStyle={{ borderRadius: 12 }} // optional rounded corners
        >
          <Text style={styles.dataText}>Slaap</Text>
        </ImageBackground>
      </View>

      {/* circle */}
      {/* <View style={styles.circleContainer}> */}
      <View style={styles.circleContainer}>
        {/* First circle */}
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            backgroundColor: "rgba(121, 121, 121, 0.39)",
            borderWidth: 9,
            borderColor: "#D9D9D9",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              // bottom: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Speel geluid af
            <SoundIcon />
          </Text>
        </View>
        {/* Second circle */}
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            backgroundColor: "rgba(121, 121, 121, 0.39)",
            borderWidth: 9,
            borderColor: "#D9D9D9",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <CircularProgress progress={75} size={135} strokeWidth={10} />
        </View>
      </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  chartContainer: {
    flex: 1,
    padding: 16,
  },
  // dataContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: colors.background,
  //   borderRadius: 10,
  //   height: Dimensions.get("window").height,
  // },
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
  background: {
    flex: 1,
  },
  dataContainer: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  dataBox: {
    width: 150,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  dataText: {
    color: "#02433B",
    fontSize: 19,
    fontWeight: "bold",
  },

  circleContainer: {
    // position: "absolute",
    // bottom: 200,
    top: 125,
    // left: 0,
    // right: 0,
    alignItems: "center",
    // row
    flexDirection: "row",
    // backgroundColor: "rgba(223, 43, 43, 1)",
  },

  map: {
    top: 50,
    width: Dimensions.get("window").width - 32,
    height: Dimensions.get("window").height / 2.5,
    borderRadius: 10,
  },

  overlayText: {
    position: "absolute",
    top: 50,
    left: 0,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
});
