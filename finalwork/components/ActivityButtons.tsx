import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@/constants/Colors";

type ActivityType = "sleep" | "move" | "jump" | "nieuwsgierig" | "chill" | "probleem";

type Props = {
  active: ActivityType;
  onPress: (type: ActivityType) => void;
};

export default function ActivityButtons({ active, onPress }: Props) {
  const items: { key: ActivityType; label: string }[] = [
    { key: "sleep", label: "slaap" },
    { key: "move", label: "beweging" },
    { key: "jump", label: "sprongen" },
    { key: "nieuwsgierig", label: "nieuwsgierig" },
    { key: "chill", label: "chill" },
    { key: "probleem", label: "probleem" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
  },
  button: {
    marginRight: 10,
    paddingHorizontal: 16,
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
