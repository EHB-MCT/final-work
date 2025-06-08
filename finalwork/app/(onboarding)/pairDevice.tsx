import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
// import QrCode from "../../assets/qrCode.svg";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import InputModal from "@/components/ui/InputModal";

type RootStackParamList = {
  "(onboarding)/QrScanner": undefined;
  // add other routes here if needed
};

export default function PairDeviceScreen() {
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const openInput = () => {
    setInputModalVisible(true);
  };

  const handleManualSubmit = (value: string) => {
    console.log("Entered device ID:", value);
    setDeviceId(value);
    // Add your logic here to pair the device
  };
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, textAlign: "center", margin: 20 }}>
        Scan de QR code op uw Meowtracks apparaat
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("(onboarding)/QrScanner")}
      >
        {/* <BackgroundShape
          width={Dimensions.get("window").width}
          style={styles.backgroundSvg}
        /> */}
        {/* <QrCode
          width={Dimensions.get("window").width}
          // style={styles.backgroundSvg}
        /> */}
        <QRCode value="YOUR_DEVICE_ID" size={200} />
      </TouchableOpacity>

      <SecondaryButton onPress={openInput}>
        Code handmatig invoeren
      </SecondaryButton>
      <InputModal
        visible={inputModalVisible}
        title="Voer je apparaatcode in"
        placeholder=""
        submitText="Koppel apparaat"
        keyboardType="numeric"
        onSubmit={handleManualSubmit}
        onClose={() => setInputModalVisible(false)}
      />
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
