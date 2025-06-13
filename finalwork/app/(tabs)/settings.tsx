import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const deleteAllCatData = async () => {
    try {
      await AsyncStorage.clear(); // Clear all AsyncStorage data
      console.log("All cat data cleared.");
      router.push("(onboarding)"); // Navigate to Onboarding screen
    } catch (error) {
      console.error("Failed to clear cat data:", error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Weet je het zeker?",
      "Dit verwijdert alle opgeslagen katgegevens.",
      [
        { text: "Annuleer", style: "cancel" },
        {
          text: "Verwijder",
          onPress: deleteAllCatData,
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.setingContainer}>
        <Text style={styles.title}>Instellingen</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Notificaties</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteButtonText}>Verwijder katgegevens</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    paddingHorizontal: 50,
  },
  deleteButton: {
    marginTop: 40,
    backgroundColor: "#A10B0B",
    padding: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  setingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
