import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";

export default function RouteHistoryScreen() {
  const [routeData, setRouteData] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatHistory = async () => {
    try {
      const response = await fetch("https://final-work-7cqh.onrender.com/api/cat-locations");
      const data = await response.json();

      if (Array.isArray(data)) {
        const cleaned = data
          .filter((point) => point.latitude && point.longitude)
          .map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }));

        setRouteData(cleaned);
      }
    } catch (error) {
      console.error("Fout bij ophalen routehistoriek:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (routeData.length < 2) {
    return (
      <View style={styles.centered}>
        <Text>Niet genoeg data om route te tonen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: routeData[0].latitude,
          longitude: routeData[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={routeData} strokeColor="purple" strokeWidth={3} />
        <Marker coordinate={routeData[0]} title="Start" pinColor="green" />
        <Marker coordinate={routeData[routeData.length - 1]} title="Einde" pinColor="red" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
