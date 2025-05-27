import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { isPointWithinRadius } from "geolib";

export default function HomeScreen() {
  const [catLocation, setCatLocation] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
  });

  const homeLocation = {
    latitude: 50.8500,
    longitude: 4.3515,
  };

  const [isInsideFence, setIsInsideFence] = useState(true);

  // Simuleer de beweging van de kat     
  useEffect(() => {
    const interval = setInterval(() => {
      setCatLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0002,
      }));
    }, 3000); // elke 3 seconden

    return () => clearInterval(interval);
  }, []);

  // Controleer of kat binnen de geofence is
  useEffect(() => {
    const inFence = isPointWithinRadius(catLocation, homeLocation, 100); // 100 meter
    console.log("Kat binnen geofence?", inFence);
    setIsInsideFence(inFence);
  }, [catLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...homeLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Thuiszone (geofence) */}
        <Circle
          center={homeLocation}
          radius={100}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.2)"
        />

        {/* Marker voor thuis */}
        <Marker
          coordinate={homeLocation}
          title="Thuis"
          description="Hier mag de kat blijven"
        />

        {/* Marker voor kat */}
        <Marker
          coordinate={catLocation}
          title="Pixel"
          description="Locatie van je kat"
          pinColor="orange"
        />
      </MapView>

      {/* Status */}
      <View style={styles.statusBox}>
        <Text style={{ fontWeight: "bold", color: isInsideFence ? "green" : "red" }}>
          {isInsideFence ? "De kat is BINNEN de zone" : "De kat is BUITEN de zone!"}
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
  statusBox: {
    position: "absolute",
    bottom: 150,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
});
