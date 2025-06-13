import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkipConfirmationModal from "@/components/SkipConfirmationModal";

export default function CatProfileScreen() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("M");
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleNext = async () => {
    try {
      const profile = { name, birthday, weight, gender };
      await AsyncStorage.setItem("catProfile", JSON.stringify(profile));
      await AsyncStorage.setItem("catName", name);
      router.push("/CatProfilePicture");
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleSkipConfirmed = () => {
    setShowModal(false);
    router.push("/CatProfilePicture");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vertel ons wat meer over je kat</Text>

      <View style={styles.question}>
        <Text style={styles.label}>Hoe heet je kat?</Text>
        <TextInput
          style={styles.input}
          placeholder="Bijv. Pixel"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.question}>
        <Text style={styles.label}>Wanneer is je kat jarig?</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
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
        <Text style={styles.label}>Hoeveel weegt je kat? (in kg)</Text>
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

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Volgende</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>Overslaan</Text>
      </TouchableOpacity>

      <SkipConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleSkipConfirmed}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#19162B",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#fff",
    textAlign: "center",
  },
  question: {
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  skipButton: {
    marginTop: 12,
    alignItems: "center",
  },
  skipText: {
    color: "#aaa",
    textDecorationLine: "underline",
  },
});
