import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import HeaderSvg from "@/assets/header.svg";

const { width } = Dimensions.get("window");

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Background SVG */}
      <View style={styles.svgContainer}>
        <HeaderSvg width={width} />
      </View>

      {/* Profile image */}
      <View style={styles.profileContainer}>
        <Image
          // source={{ uri: "https://your-image-url.com/profile.jpg" }} // TODO: Replace with image (from storage)
          style={styles.profileImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  svgContainer: {
    width: "100%",
  },
  profileContainer: {
    position: "absolute",
    top: 40,
    left: Dimensions.get("window").width / 2 - 45, // Center
    alignSelf: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
