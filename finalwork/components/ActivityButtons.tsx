import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

type Props = {
  active: "sleep" | "move" | "jump";
  onPress: (type: Props["active"]) => void;
};

export default function ActivityButtons({ active, onPress }: Props) {
  const items: { key: Props["active"]; label: string }[] = [
    { key: "sleep", label: "slaap" },
    { key: "move", label: "beweging" },
    { key: "jump", label: "sprongen" },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? "#E1B048" : colors.primary,
              },
            ]}
            onPress={() => onPress(item.key)}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  button: {
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
  },
  activeLabel: {
    fontWeight: "bold",
  },
});
