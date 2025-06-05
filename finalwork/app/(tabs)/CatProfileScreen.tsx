import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  ActionSheetIOS,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SkipConfirmationModal from "@/components/SkipConfirmationModal";

export default function CatProfileScreen() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("M");
  const [showModal, setShowModal] = useState(false);

  const handleNext = () => {
    router.push("/CatProfilePicture");
  };

  const handleSkipConfirmed = () => {
    setShowModal(false);
    router.push("/CatProfilePicture");
  };

  const formattedDate = birthday
    ? birthday.toLocaleDateString("nl-NL")
    : "Selecteer een datum";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Vertel ons wat meer over je kat</Text>

        <View style={styles.question}>
          <Text style={styles.label}>Hoe heet je kat?</Text>
          <TouchableOpacity style={styles.input}>
            <TextInput
              placeholder="Bijv. Pixel"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={{ color: "#fff" }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.question}>
          <Text style={styles.label}>Wanneer is je kat jarig?</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={{ color: "#fff" }}>{formattedDate}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setBirthday(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.question}>
          <Text style={styles.label}>Ken je het ras?</Text>
          <View style={styles.pickerContainer}>
            {Platform.OS === "ios" ? (
              <TouchableOpacity
                style={styles.input}
                onPress={() =>
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: [
                        "Annuleer",
                        "Maine Coon",
                        "Sphynx",
                        "Noorse Boskat",
                        "Britse Korthaar",
                        "Europees Korthaar",
                        "Anders",
                      ],
                      cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                      const breeds = [
                        "",
                        "maine_coon",
                        "sphynx",
                        "noorse_boskat",
                        "brits",
                        "europees",
                        "anders",
                      ];
                      if (buttonIndex > 0) {
                        setBreed(breeds[buttonIndex]);
                      }
                    }
                  )
                }
              >
                <Text style={{ color: "#fff" }}>
                  {breed
                    ? {
                        maine_coon: "Maine Coon",
                        sphynx: "Sphynx",
                        noorse_boskat: "Noorse Boskat",
                        brits: "Britse Korthaar",
                        europees: "Europees Korthaar",
                        anders: "Anders",
                      }[breed]
                    : "Selecteer een ras..."}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={breed}
                  onValueChange={(itemValue) => setBreed(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Selecteer een ras..." value="" />
                  <Picker.Item label="Maine Coon" value="maine_coon" />
                  <Picker.Item label="Sphynx" value="sphynx" />
                  <Picker.Item label="Noorse Boskat" value="noorse_boskat" />
                  <Picker.Item label="Britse Korthaar" value="brits" />
                  <Picker.Item label="Europees Korthaar" value="europees" />
                  <Picker.Item label="Anders" value="anders" />
                </Picker>
              </View>
            )}
          </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#19162B",
  },
  container: {
    padding: 24,
    paddingTop: 48, // 👈 Titel wat lager zetten op iOS
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
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#2a273d",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#fff",
    backgroundColor: "#19162B",
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
