import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CatProfilePicture() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Toestemming vereist",
          "We hebben toegang nodig tot je galerij."
        );
      } else {
        const saved = await AsyncStorage.getItem("profileImage");
        if (saved) setImage(saved);
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  const finish = () => router.push("(tabs)"); // adjust path as needed

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kies een profielfoto voor je kat</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="add" size={48} color="#19162B" />
        )}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={finish}>
          <Text style={styles.buttonText}>Volgende</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={finish}>
          <Text style={styles.skipText}>Overslaan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19162B",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  buttonContainer: { alignItems: "center", gap: 12 },
  nextButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: { color: "#19162B", fontSize: 16, fontWeight: "bold" },
  skipText: { marginTop: 8, color: "white", textDecorationLine: "underline" },
});
