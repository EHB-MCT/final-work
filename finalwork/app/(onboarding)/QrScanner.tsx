import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
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

  if (!permission || !permission.granted) {
    return (
      <View>
        <Text>Camera permissie is nodig om QR-codes te scannen.</Text>
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
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Reticle */}
      <View
        style={{
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
        }}
      />
    </View>
  );
}
