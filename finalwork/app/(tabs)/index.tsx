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
import AsyncStorage from "@react-native-async-storage/async-storage";
import mapStyle from "@/assets/mapStyle.json";
import { fetchLatestCatLocation } from "../services/apiCalls";
import { colors } from "@/constants/Colors";
import CircularProgress from "@/components/CircularProgress";
import { BlurView } from "expo-blur";
import SoundIcon from "../../assets/icons/sound.svg";

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

type DataPoint = { timestamp: string; value: number };

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

  const [battery, setBattery] = useState<number>(50);
  const [environment, setEnvironment] = useState<string>("indoors");

  useEffect(() => {
    AsyncStorage.getItem("profileImage")
      .then((uri) => uri && setCatImageUri(uri))
      .catch(console.error);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const loc = await fetchLatestCatLocation();
        if (!loc?.timestamp || !isMounted) return;

        const ts = loc.timestamp as string;

        setActivityData((prev) =>
          prev.length === 0 || prev[prev.length - 1].timestamp !== ts
            ? [...prev, { timestamp: ts, value: loc.activityLevel ?? 0 }]
            : prev
        );

        setJumpData((prev) =>
          prev.length === 0 || prev[prev.length - 1].timestamp !== ts
            ? [...prev, { timestamp: ts, value: loc.jump ?? 0 }]
            : prev
        );

        setCatLocation({ latitude: loc.latitude, longitude: loc.longitude });
        setBattery(loc.battery ?? 50);
        setEnvironment(loc.environment ?? "indoors");
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };

    fetchData(); // direct ophalen bij mount
    const interval = setInterval(fetchData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const moveByDay = groupByDay(activityData);
  const jumpByDay = groupByDay(jumpData);

  const totalActivity = moveByDay.reduce((sum, n) => sum + n, 0);
  const totalHours = (totalActivity / 60).toFixed(1);
  const totalJump = jumpByDay.reduce((sum, n) => sum + n, 0);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/greenBlobBg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0)" }]} />
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

        <Text style={styles.overlayText}>
          {environment === "indoors" ? "Indoors" : "Outdoors"}
        </Text>
      </View>

      <View style={styles.dataContainer}>
        <ImageBackground
          source={require("../../assets/images/dataBG.png")}
          style={styles.dataBox}
          imageStyle={{ borderRadius: 12 }}
        >
          <Text style={styles.dataText}>Activiteit</Text>
          <Text style={styles.valueText}>{totalActivity} min</Text>
        </ImageBackground>

        <ImageBackground
          source={require("../../assets/images/dataBG.png")}
          style={styles.dataBox}
          imageStyle={{ borderRadius: 12 }}
        >
          <Text style={styles.dataText}>Slaap</Text>
          <Text style={styles.valueText}>{totalHours} u</Text>
        </ImageBackground>
      </View>

      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
            Speel geluid af
            <SoundIcon />
          </Text>
        </View>

        <View style={styles.circle}>
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          <CircularProgress progress={battery} size={135} strokeWidth={10} />
          <Text style={{ color: "white", marginTop: 8, fontWeight: "bold" }}>
            {battery}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
  mapWrapper: { top: 50 },
  map: { width: Dimensions.get("window").width - 32, height: Dimensions.get("window").height / 2.5, borderRadius: 10 },
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
  dataContainer: { position: "absolute", bottom: 200, left: 0, right: 0, flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 20 },
  dataBox: { width: 150, height: 100, justifyContent: "center", alignItems: "center" },
  dataText: { color: "#02433B", fontSize: 19, fontWeight: "bold" },
  valueText: { color: "#02433B", fontSize: 16, fontWeight: "bold", marginTop: 8 },
  circleContainer: { top: 125, flexDirection: "row", alignItems: "center" },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "rgba(121,121,121,0.39)",
    borderWidth: 9,
    borderColor: "#D9D9D9",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
});
