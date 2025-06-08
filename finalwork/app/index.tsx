// app/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkOnboarding = async () => {
      //   const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      const hasOnboarded = true; // For testing purposes, we assume the user has onboarded

      //   if (hasOnboarded === "true") {
      //     router.replace("/(tabs)");
      //   } else {
      router.replace("/(tabs)");
      //   }
    };

    checkOnboarding();
  }, []);

  return null; // nothing to render, we’re just routing
}
