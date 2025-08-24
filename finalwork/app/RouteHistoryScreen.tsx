import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { getDistance } from "geolib";
import { format } from "date-fns";
import { colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native"; // <- toegevoegd

import mapStyle from "@/assets/mapStyle.json";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function RouteHistoryScreen() {
  const navigation = useNavigation(); // <- toegevoegd
  const [allData, setAllData] = useState<{ [date: string]: LocationPoint[] }>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const MIN_DISTANCE_METERS = 50;

  const fetchCatHistory = async () => {
    try {
      const response = await fetch(
        "https://final-work-7cqh.onrender.com/api/cat-locations"
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        const validPoints: LocationPoint[] = data.filter(
          (point) => point.latitude && point.longitude && point.timestamp
        );

        const grouped: { [date: string]: LocationPoint[] } = {};

        validPoints.forEach((point) => {
          const dateKey = format(new Date(point.timestamp), "yyyy-MM-dd");
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(point);
        });

        setAllData(grouped);

        const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
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

  const getFilteredPoints = (points: LocationPoint[]) => {
    const filtered: { latitude: number; longitude: number }[] = [];

    points.forEach((point) => {
      const current = { latitude: point.latitude, longitude: point.longitude };
      if (
        filtered.length === 0 ||
        getDistance(filtered[filtered.length - 1], current) >
          MIN_DISTANCE_METERS
      ) {
        filtered.push(current);
      }
    });

    return filtered;
  };

  const routePoints =
    selectedDate && allData[selectedDate]
      ? getFilteredPoints(allData[selectedDate])
      : [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  const dates = Object.keys(allData).sort((a, b) => b.localeCompare(a));

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === "android" ? undefined : "google"}
        customMapStyle={mapStyle}
        style={styles.map}
        region={
          routePoints.length > 0
            ? {
                latitude: routePoints[0].latitude,
                longitude: routePoints[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 51.05,
                longitude: 3.73,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        {routePoints.length >= 2 && (
          <>
            <Polyline
              coordinates={routePoints}
              strokeColor="#FF7F50"
              strokeWidth={3}
            />
            <Marker
              coordinate={routePoints[0]}
              title="Start"
              pinColor="green"
            />
            <Marker
              coordinate={routePoints[routePoints.length - 1]}
              title="Einde"
              pinColor="red"
            />
          </>
        )}
      </MapView>

      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Geselecteerde datum:</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectButtonText}>
            {selectedDate || "Selecteer een datum"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecteer een datum</Text>
            <FlatList
              data={dates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dateItem,
                    item === selectedDate && styles.dateItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedDate(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dateItemText,
                      item === selectedDate && styles.dateItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {routePoints.length < 2 && (
        <View style={styles.centeredOverlay}>
          <Text>Niet genoeg data om route te tonen.</Text>
        </View>
      )}

      {/* Terug-knop rechtsonder */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // <- past terug-navigatie toe
      >
        <Text style={styles.backButtonText}>Terug</Text>
      </TouchableOpacity>
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
  centeredOverlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
  },
  selectorContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10000,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  selectButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    maxHeight: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  dateItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  dateItemSelected: {
    backgroundColor: "#007aff22",
    borderRadius: 6,
  },
  dateItemText: {
    fontSize: 16,
    color: "#333",
  },
  dateItemTextSelected: {
    color: "#007aff",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
