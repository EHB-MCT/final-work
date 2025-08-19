// app/(onboarding)/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="pairDevice" />
      <Stack.Screen name="QrScanner" />
    </Stack>
  );
}
