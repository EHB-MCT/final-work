import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [lastScannedAt, setLastScannedAt] = useState<number>(0);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera permissie is nodig om QR-codes te scannen.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    const now = Date.now();
    if (now - lastScannedAt < 2000) return;

    setLastScannedAt(now);
    console.log("Scanned:", data);
    if (data === "123") {
      router.push("(onboarding)/CatProfileIntro");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Reticle */}
      <View style={styles.reticle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  camera: {
    flex: 1,
  },
  reticle: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "80%",
    height: "40%",
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 10,
    backgroundColor: "transparent",
    borderStyle: "dashed",
  },
});
