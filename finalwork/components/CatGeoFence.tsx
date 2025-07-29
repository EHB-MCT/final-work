import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isInsideGeofence, GeofenceZone, Coordinates } from '../constants/geofence';

const GEOFENCE_ZONE: GeofenceZone = {
  latitude: 51.12345,
  longitude: 4.56789,
  radiusInMeters: 100,
};

const LOCATION_KEY = "cat_location_history";
const PRECISION = 0.0002; // ~20m nauwkeurigheid

function roundCoord(coord: number) {
  return Math.round(coord / PRECISION) * PRECISION;
}

function toKey({ latitude, longitude }: Coordinates) {
  return `${roundCoord(latitude)},${roundCoord(longitude)}`;
}

export default function CatGeoFence() {
  const [catLocation, setCatLocation] = useState<Coordinates | null>(null);
  const [insideFence, setInsideFence] = useState<boolean | null>(null);
  const [favorite, setFavorite] = useState<Coordinates | null>(null);

  useEffect(() => {
    async function fetchCatLocation() {
      // Dummy data voor demo
      const data: Coordinates = {
        latitude: 51.1235 + Math.random() * 0.0004 - 0.0002, // Kleine afwijking
        longitude: 4.5675 + Math.random() * 0.0004 - 0.0002,
      };

      setCatLocation(data);
      setInsideFence(isInsideGeofence(data, GEOFENCE_ZONE));

      // Locatie opslaan in AsyncStorage
      try {
        const historyRaw = await AsyncStorage.getItem(LOCATION_KEY);
        const history = historyRaw ? JSON.parse(historyRaw) : {};

        const key = toKey(data);
        history[key] = (history[key] || 0) + 1;

        await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(history));

        // Favoriete locatie bepalen
        const favKey = Object.entries(history).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (favKey) {
          const [lat, lon] = favKey.split(',').map(Number);
          setFavorite({ latitude: lat, longitude: lon });
        }
      } catch (e) {
        console.error("Locatiegeschiedenis opslaan mislukt", e);
      }
    }

    fetchCatLocation();
    const interval = setInterval(fetchCatLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text>📍 Huidige locatie kat:</Text>
      {catLocation ? (
        <>
          <Text>Latitude: {catLocation.latitude.toFixed(5)}</Text>
          <Text>Longitude: {catLocation.longitude.toFixed(5)}</Text>
          <Text>
            Kat is {insideFence ? "binnen" : "buiten"} de geofence zone.
          </Text>
        </>
      ) : (
        <Text>Locatie laden...</Text>
      )}

      {favorite && (
        <View style={{ marginTop: 20 }}>
          <Text>⭐ Favoriete locatie (meest bezocht):</Text>
          <Text>Latitude: {favorite.latitude.toFixed(5)}</Text>
          <Text>Longitude: {favorite.longitude.toFixed(5)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
