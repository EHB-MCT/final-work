import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";

interface InputModalProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  submitText?: string;
  keyboardType?: KeyboardTypeOptions;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export default function InputModal({
  visible,
  title,
  placeholder = "",
  initialValue = "",
  submitText = "Bevestig",
  keyboardType = "default",
  onSubmit,
  onClose,
}: InputModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleSubmit = () => {
    onSubmit(value);
    setValue("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            keyboardType={keyboardType ?? "default"}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{submitText}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Annuleer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
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
  },
  buttonText: {
    color: "#fff",
  },
  cancelText: {
    color: "#aaa",
    marginTop: 10,
  },
});
