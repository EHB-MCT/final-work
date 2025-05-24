import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location"; 
import { isPointWithinRadius } from "geolib";

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isInsideFence, setIsInsideFence] = useState(false);

  const catLocation = {
    latitude: 50.8503,
    longitude: 4.3517,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Toestemming geweigerd");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);

      const inFence = isPointWithinRadius(coords, catLocation, 100); // 100 meter
      setIsInsideFence(inFence);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...catLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={catLocation} title="Pixel" description="Hier is je kat!" />
        <Circle center={catLocation} radius={100} strokeColor="rgba(0,0,255,0.5)" fillColor="rgba(0,0,255,0.2)" />

        {userLocation && (
          <Marker coordinate={userLocation} title="Jij" pinColor="green" />
        )}
      </MapView>

      <View style={styles.statusBox}>
        <Text>{isInsideFence ? "Je bent BINNEN de zone" : "Je bent BUITEN de zone"}</Text>
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
    bottom: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
});
