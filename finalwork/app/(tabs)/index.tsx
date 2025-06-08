import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Text,
  Platform,
} from "react-native";
import MapView, {
  Marker,
  Polygon,
  MapPressEvent,
  LatLng,
} from "react-native-maps";
import { isPointInPolygon } from "geolib";

export default function EditableGeofenceMap() {
  const [polygonCoords, setPolygonCoords] = useState<LatLng[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [catLocation, setCatLocation] = useState<LatLng>({
    latitude: 50.8503,
    longitude: 4.3517,
  });
  const [isInside, setIsInside] = useState(true);

  // Voeg polygonpunt toe bij tikken op kaart
  const handleMapPress = (e: MapPressEvent) => {
    if (isEditing) {
      const { coordinate } = e.nativeEvent;
      setPolygonCoords((prev) => [...prev, coordinate]);
    }
  };

  const clearPolygon = () => setPolygonCoords([]);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  // Simuleer kat die beweegt
  useEffect(() => {
    const interval = setInterval(() => {
      setCatLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0002,
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Check of kat in polygon zit
  useEffect(() => {
    if (polygonCoords.length >= 3) {
      const result = isPointInPolygon(catLocation, polygonCoords);
      setIsInside(result);
      console.log("Kat is binnen zone?", result);
    }
  }, [catLocation, polygonCoords]);

  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50.8503,
          longitude: 4.3517,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {/* Polygon tekenen */}
        {polygonCoords.length > 0 && (
          <Polygon
            coordinates={polygonCoords}
            strokeColor="blue"
            fillColor="rgba(0,0,255,0.2)"
            strokeWidth={2}
          />
        )}

        {/* Polygonpunten */}
        {polygonCoords.map((coord, index) => (
          <Marker
            key={index}
            coordinate={coord}
            pinColor="blue"
            title={`Punt ${index + 1}`}
          />
        ))}

        {/* Kat marker */}
        <Marker
          coordinate={catLocation}
          title="Kat"
          description="Simulatie van katlocatie"
          pinColor={isInside ? "green" : "red"}
        />
      </MapView>

      {/* Bediening */}
      <View style={styles.controls}>
        <Button
          title={isEditing ? "✅ Stop tekenen" : "✏️ Start tekenen"}
          onPress={toggleEdit}
        />
        <View style={{ height: 10 }} />
        <Button title="🗑️ Wis polygon" onPress={clearPolygon} color="red" />
        <View style={{ marginTop: 10 }}>
          <Text style={styles.statusText}>
            {polygonCoords.length < 3
              ? "Minstens 3 punten nodig voor een zone"
              : isInside
              ? "✅ Kat is BINNEN de zone"
              : "🚨 Kat is BUITEN de zone!"}
          </Text>
        </View>
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
  controls: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  statusText: {
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
    color: "#333",
  },
});
