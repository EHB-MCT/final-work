import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isInsideGeofence, GeofenceZone, Coordinates } from '../constants/geofence';

const GEOFENCE_ZONE: GeofenceZone = {
  latitude: 51.12345,
  longitude: 4.56789,
  radiusInMeters: 100,
};

export default function CatGeoFence() {
  const [catLocation, setCatLocation] = useState<Coordinates | null>(null);
  const [insideFence, setInsideFence] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchCatLocation() {
      // Vervang dit met je echte API call
      // const response = await fetch('https://your-pi-api/cat-location');
      // const data: Coordinates = await response.json();

      // Dummy data voor testen
      const data: Coordinates = {
        latitude: 51.1235,
        longitude: 4.5675,
      };

      setCatLocation(data);
      setInsideFence(isInsideGeofence(data, GEOFENCE_ZONE));
    }

    fetchCatLocation();

    const interval = setInterval(fetchCatLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!catLocation) {
    return (
      <View style={styles.container}>
        <Text>Locatie aan het laden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Kat locatie:</Text>
      <Text>Latitude: {catLocation.latitude}</Text>
      <Text>Longitude: {catLocation.longitude}</Text>
      <Text>
        Kat is {insideFence ? 'binnen' : 'buiten'} de geofence zone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
