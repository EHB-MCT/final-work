import React from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import HeaderTest from "@/assets/header.svg"; // Assuming you have a header SVG

export default function Header() {
  return (
    <View style={styles.backgroundSvg}>
      {/* Background SVG */}
      <HeaderTest
      // width={Dimensions.get("window").width}
      // height={Dimensions.get("window").height * 0.15} // Adjust height as needed
      />
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundSvg: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
});
