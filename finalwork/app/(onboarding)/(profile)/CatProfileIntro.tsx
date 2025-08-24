import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { router } from "expo-router";

export default function CatProfileIntro() {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withDelay(200, withTiming(1.1, { duration: 800 }));
    opacity.value = withDelay(1200, withTiming(0, { duration: 1000 }));
    setTimeout(() => {
      router.replace("/(onboarding)/CatProfileScreen");
    }, 2200);
  }, []);

  return (
    <View style={styles.centered}>
      <Animated.Text style={[styles.text, style]}>
        Laten we beginnen
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
  },
});
