import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <ImageBackground
      source={require("../../../assets/images/greenBlobBg.png")}
      style={styles.background}
      resizeMode="cover"
      blurRadius={30}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0, 0, 0, 0.42)" },
        ]}
      />
      {/* Make the Stack content transparent so background shows */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
