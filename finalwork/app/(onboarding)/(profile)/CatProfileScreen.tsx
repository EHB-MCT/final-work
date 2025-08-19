import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkipConfirmationModal from "@/components/SkipConfirmationModal";
import ArrowBackIcon from "../../../assets/icons/arrow_back.svg"; // Adjust the path as necessary

export default function CatProfileScreen() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("M");
  const [showModal, setShowModal] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    {
      key: "name",
      render: () => (
        <>
          <Text style={styles.label}>Hoe heet je kat?</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. Pixel"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </>
      ),
    },
    {
      key: "birthday",
      render: () => (
        <>
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
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setBirthday(selectedDate);
              }}
            />
          )}
        </>
      ),
    },
    {
      key: "weight",
      render: () => (
        <>
          <Text style={styles.label}>Hoeveel weegt je kat? (in kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Bijv. 4.2"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </>
      ),
    },
    {
      key: "gender",
      render: () => (
        <>
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
        </>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const profile = { name, birthday, weight, gender };
        await AsyncStorage.setItem("catProfile", JSON.stringify(profile));
        await AsyncStorage.setItem("catName", name);
        router.push("/CatProfilePicture");
      } catch (err) {
        console.error("Failed to save profile:", err);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.center, styles.topText]}>Welkom</Text>
      <Text style={styles.subTitle}>We willen je kat graag leren kennen.</Text>

      <View style={styles.question}>{questions[currentStep].render()}</View>

      <View style={styles.navigationRow}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIcon width={24} height={24} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {currentStep === questions.length - 1 ? "Afronden" : "Volgende"}
          </Text>
        </TouchableOpacity>
      </View>

      <SkipConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          router.push("/CatProfilePicture");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  topText: {
    marginBottom: 8,
    fontWeight: "normal",
  },
  center: {
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 24,
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
  navigationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#FD9003",
    // dropshadow
    shadowColor: "#FD9003",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    // marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
