import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";


export default function CatProfileEditScreen() {
  // Profielgegevens
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("M");

  // Profielfoto
  const [image, setImage] = useState<string | null>(null);

  // Laad profiel en foto bij starten
  useEffect(() => {
    (async () => {
      const savedProfile = await AsyncStorage.getItem("catProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setName(profile.name || "");
        setBirthday(profile.birthday ? new Date(profile.birthday) : null);
        setWeight(profile.weight || "");
        setGender(profile.gender || "M");
      }
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) setImage(savedImage);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Toestemming vereist",
          "We hebben toegang nodig tot je galerij."
        );
      }
    })();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthday(selectedDate);
  };

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

  const handleSave = async () => {
    try {
      const profile = { name, birthday, weight, gender };
      await AsyncStorage.setItem("catProfile", JSON.stringify(profile));
      await AsyncStorage.setItem("catName", name);
      Alert.alert("Profiel opgeslagen", "Je kattenprofiel is bijgewerkt.");
    } catch (err) {
      Alert.alert("Fout", "Opslaan is mislukt. Probeer opnieuw.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pas je kattenprofiel aan</Text>

      <View style={styles.question}>
        <Text style={styles.label}>Naam</Text>
        <TextInput
          style={styles.input}
          placeholder="Bijv. Pixel"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.question}>
        <Text style={styles.label}>Geboortedatum</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: birthday ? "#fff" : "#999" }}>
            {birthday ? birthday.toLocaleDateString() : "Selecteer een datum"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.question}>
        <Text style={styles.label}>Gewicht (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Bijv. 4.2"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <View style={styles.question}>
        <Text style={styles.label}>Geslacht</Text>
        <View style={styles.radioContainer}>
          <View style={styles.radioOption}>
            <RadioButton
              value="M"
              status={gender === "M" ? "checked" : "unchecked"}
              onPress={() => setGender("M")}
              color="#fff"
            />
            <Text style={styles.radioLabel}>M</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton
              value="V"
              status={gender === "V" ? "checked" : "unchecked"}
              onPress={() => setGender("V")}
              color="#fff"
            />
            <Text style={styles.radioLabel}>V</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.title, { marginTop: 30 }]}>Profielfoto</Text>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.changeText}>Tik om te wijzigen</Text>
          </>
        ) : (
          <Ionicons name="add" size={48} color="#19162B" />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#19162B",
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 140,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  question: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    padding: 10,
    borderRadius: 6,
    color: "#fff",
  },
  radioContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#fff",
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
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  changeText: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    color: "#19162B",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
