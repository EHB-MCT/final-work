import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, {
  Marker,
  Polygon,
  MapPressEvent,
  LatLng,
} from "react-native-maps";
import { isPointInPolygon } from "geolib";
import mapStyle from "@/assets/mapStyle.json";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "@/constants/Colors";

import { fetchLatestCatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditableGeofenceMap() {
  const [history, setHistory] = useState<(LatLng & { timestamp: Date })[]>([]);
  const [polygonCoords, setPolygonCoords] = useState<LatLng[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [catImageUri, setCatImageUri] = useState<string | null>(null);
  const [catName, setCatName] = useState<string | null>(null);
  const [catLocation, setCatLocation] = useState<LatLng>({
    latitude: 50.904918,
    longitude: 4.355563,
  });
  const [isInside, setIsInside] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("profileImage")
      .then((uri) => uri && setCatImageUri(uri))
      .catch(console.error);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("catName")
      .then((name) => name && setCatName(name))
      .catch(console.error);
  }, []);

  const fetchCatLocation = async () => {
    const latest = await fetchLatestCatLocation();
    if (latest) {
      // console.log("Cat location fetched:", catLocation);
      setCatLocation({
        latitude: latest.latitude,
        longitude: latest.longitude,
      });
    }
  };

  // Fetch cat location van je backend
  // const fetchCatLocation = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://final-work-7cqh.onrender.com/api/cat-locations"
  //     );
  //     const data = await response.json();
  //     if (data.length > 0) {
  //       // Stel de laatste locatie in (of pas aan voor meerdere katten)
  //       const latest = data[0];

  //       setCatLocation({
  //         latitude: latest.latitude,
  //         longitude: latest.longitude,
  //       });
  //     }
  //     console.log("Cat location fetched:", catLocation);
  //   } catch (error) {
  //     console.error("Fout bij ophalen cat locatie:", error);
  //   }
  // };

  useEffect(() => {
    fetchCatLocation();

    // Optioneel: periodiek ophalen
    const interval = setInterval(fetchCatLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    if (isEditing) {
      const { coordinate } = e.nativeEvent;
      setPolygonCoords((prev) => [...prev, coordinate]);
    }
  };

  const clearPolygon = () => setPolygonCoords([]);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    if (polygonCoords.length >= 3) {
      const result = isPointInPolygon(catLocation, polygonCoords);
      setIsInside(result);
    }
  }, [catLocation, polygonCoords]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === "android" ? undefined : "google"}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: catLocation.latitude,
          longitude: catLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="blue"
            fillColor="rgba(0,0,255,0.2)"
            strokeWidth={2}
          />
        )}

        {polygonCoords.map((coord, index) => (
          <Marker
            key={index}
            coordinate={coord}
            pinColor="blue"
            title={`Punt ${index + 1}`}
          />
        ))}

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

      {/* Icon Buttons rechts */}
      <View style={styles.iconButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleEdit}>
          <Ionicons
            name={isEditing ? "checkmark" : "pencil"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={clearPolygon}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.push({
              pathname: "/RouteHistoryScreen",
              params: { data: JSON.stringify(history) },
            })
          }
        >
          <MaterialCommunityIcons name="history" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Status onderaan */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {polygonCoords.length < 3
            ? "Minstens 3 punten nodig voor een zone"
            : isInside
            ? `${catName ? catName : "Kat"} is BINNEN de zone!`
            : `${catName ? catName : "Kat"} is BUITEN de zone!`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  iconButtons: {
    position: "absolute",
    top: 150,
    right: 20,
    gap: 16,
    alignItems: "center",
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  statusBox: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    elevation: 5,
  },
  statusText: {
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
