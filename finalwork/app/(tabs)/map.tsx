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
import MapView, { Marker, Polygon, MapPressEvent, LatLng } from "react-native-maps";
import { isPointInPolygon, getDistance } from "geolib";
import mapStyle from "@/assets/mapStyle.json";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { fetchLatestCatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { GEOFENCE_TASK } from "../../notificationManager";

type FavoriteLocation = {
  id: string;
  coordinate: LatLng;
  title: string;
};

type CatLocationHistory = {
  coordinate: LatLng;
  totalTime: number; // seconds
  lastSeen: number; // timestamp
};

export default function EditableGeofenceMap() {
  const [history, setHistory] = useState<CatLocationHistory[]>([]);
  const [polygonCoords, setPolygonCoords] = useState<LatLng[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [catImageUri, setCatImageUri] = useState<string | null>(null);
  const [catName, setCatName] = useState<string | null>(null);
  const [catLocation, setCatLocation] = useState<LatLng>({
    latitude: 50.904918,
    longitude: 4.355563,
  });
  const [isInside, setIsInside] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // 🐱 Profiel data ophalen
  useEffect(() => {
    AsyncStorage.getItem("profileImage").then((uri) => uri && setCatImageUri(uri));
    AsyncStorage.getItem("catName").then((name) => name && setCatName(name));
    AsyncStorage.getItem("history").then((data) => {
      if (data) setHistory(JSON.parse(data));
    });
    AsyncStorage.getItem("favorites").then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // 📍 Cat locatie ophalen
  const fetchCatLocation = async () => {
    const latest = await fetchLatestCatLocation();
    if (latest) {
      const newLocation = { latitude: latest.latitude, longitude: latest.longitude };
      setCatLocation(newLocation);
      await updateFavoriteAutomatically(newLocation);
    }
  };

  useEffect(() => {
    fetchCatLocation();
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

  // 🐱 Favoriete locatie automatisch berekenen
  const updateFavoriteAutomatically = async (newCoord: LatLng) => {
    const HISTORY_RADIUS = 10; // meters
    const now = Date.now();
    let updatedHistory = [...history];
    let found = false;

    for (let entry of updatedHistory) {
      const distance = getDistance(entry.coordinate, newCoord);
      if (distance <= HISTORY_RADIUS) {
        entry.totalTime += (now - entry.lastSeen) / 1000; // seconden
        entry.lastSeen = now;
        found = true;
        break;
      }
    }

    if (!found) {
      updatedHistory.push({ coordinate: newCoord, totalTime: 0, lastSeen: now });
    }

    setHistory(updatedHistory);
    await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));

    // Bepaal favoriete locatie
    const favoriteEntry = updatedHistory.reduce((prev, curr) =>
      curr.totalTime > prev.totalTime ? curr : prev
    );

    const favorite: FavoriteLocation = {
      id: "auto-fav",
      coordinate: favoriteEntry.coordinate,
      title: "Favoriete plek",
    };

    setFavorites([favorite]);
    await AsyncStorage.setItem("favorites", JSON.stringify([favorite]));
  };

  // Check of kat in polygon zit
  useEffect(() => {
    if (polygonCoords.length >= 3) {
      const result = isPointInPolygon(catLocation, polygonCoords);
      setIsInside(result);
    }
  }, [catLocation, polygonCoords]);

  useEffect(() => {
    (async () => {
      if (polygonCoords.length < 3) return;
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      await Notifications.requestPermissionsAsync();

      if (fg === "granted" && bg === "granted") {
        const region = {
          identifier: "catZone",
          latitude: polygonCoords[0].latitude,
          longitude: polygonCoords[0].longitude,
          radius: 100,
          notifyOnExit: true,
          notifyOnEnter: false,
        };
        await Location.startGeofencingAsync(GEOFENCE_TASK, [region]);
      } else {
        console.warn("Geofence/Notification permissions denied.");
      }
    })();
  }, [polygonCoords]);

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
            key={`poly-${index}`}
            coordinate={coord}
            pinColor="blue"
            title={`Punt ${index + 1}`}
          />
        ))}

        {/* 🐱 Kat marker */}
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

        {/* ⭐ Favoriete locatie */}
        {favorites.map((fav) => (
          <Marker
            key={fav.id}
            coordinate={fav.coordinate}
            pinColor="gold"
            title={fav.title}
          />
        ))}
      </MapView>

      {/* Knoppen rechts */}
      <View style={styles.iconButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleEdit}>
          <Ionicons name={isEditing ? "checkmark" : "pencil"} size={24} color="white" />
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
            ? `${catName || "Kat"} is BINNEN de zone!`
            : `${catName || "Kat"} is BUITEN de zone!`}
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
