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
    alignSelf: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
