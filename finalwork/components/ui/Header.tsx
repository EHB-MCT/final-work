import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import HeaderSvg from "@/assets/header.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function Header() {
  const [uri, setUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("profileImage")
        .then((saved) => {
          if (saved) setUri(saved);
        })
        .catch(console.error);
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        {/* <HeaderSvg width={width} /> */}
      </View>
      <View style={styles.profileContainer}>
        {uri && <Image source={{ uri }} style={styles.profileImage} />}
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
