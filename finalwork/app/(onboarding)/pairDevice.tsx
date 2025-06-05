import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import QrCode from "../../assets/qrCode.svg";

export default function HomeScreen() {
  const startInput = () => {
    // Navigate to the input screen
    console.log("Navigating to input screen...");
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, textAlign: "center", margin: 20 }}>
        Scan de QR code op uw Meowtracks apparaat
      </Text>
      <TouchableOpacity
        onPress={() => {
          // Placeholder for QR code scanning logic
          console.log("QR code scan initiated...");
        }}
      >
        {/* <BackgroundShape
          width={Dimensions.get("window").width}
          style={styles.backgroundSvg}
        /> */}
        <QrCode
          width={Dimensions.get("window").width}
          // style={styles.backgroundSvg}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={startInput}>
        <Text style={styles.button}>Code handmatig invoeren</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0D5A8",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
