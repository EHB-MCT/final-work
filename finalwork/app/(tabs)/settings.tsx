 import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    
  };

  const deleteAllCatData = async () => {
    try {
      const response = await fetch(
        "https://final-work-7cqh.onrender.com/api/cat-locations",
        { method: "DELETE" }
      );

      if (response.ok) {
        Alert.alert("Succes", "Alle katgegevens zijn verwijderd.");
      } else {
        Alert.alert("Fout", "Er ging iets mis bij het verwijderen.");
      }
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      Alert.alert("Netwerkfout", "Kon geen verbinding maken met de server.");
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
      <Text style={styles.title}>Instellingen</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Notificaties</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteButtonText}>🗑️ Verwijder katgegevens</Text>
      </TouchableOpacity>

      {/* Extra future feature */}
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Thema (binnenkort)</Text>
        <Text style={{ color: "#888" }}>🌗</Text>
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
  },
  deleteButton: {
    marginTop: 40,
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
