import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { isPointInPolygon } from "geolib";

export default function HomeScreen() {
  const [catLocation, setCatLocation] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
  });

  // Meerdere polygon zones (2 voorbeelden)
  const zones = [
    [
  { latitude: 50.8507, longitude: 4.3505 },
  { latitude: 50.8512, longitude: 4.3520 },
  { latitude: 50.8500, longitude: 4.3530 },
  { latitude: 50.8490, longitude: 4.3515 },
  { latitude: 50.8495, longitude: 4.3495 },
    ],
    
  ];

  const [isInsideFence, setIsInsideFence] = useState(false);

  // Simuleer de beweging van de kat     
  useEffect(() => {
    const interval = setInterval(() => {
      setCatLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0002,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check of kat binnen een van de zones is
  useEffect(() => {
    const insideAnyZone = zones.some(zone => isPointInPolygon(catLocation, zone));
    setIsInsideFence(insideAnyZone);
    console.log("Kat binnen een geofence zone?", insideAnyZone);
  }, [catLocation]);

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
        {zones.map((zone, idx) => (
          <Polygon
            key={idx}
            coordinates={zone}
            strokeColor="rgba(255,0,0,0.8)"
            fillColor="rgba(255,0,0,0.3)"
            strokeWidth={2}
          />
        ))}

        {/* Marker kat */}
        <Marker
          coordinate={catLocation}
          title="Pixel"
          description="Locatie van je kat"
          pinColor="orange"
        />
      </MapView>

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
