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
import { useRouter } from "expo-router";

import { colors } from "@/constants/Colors";

type RootStackParamList = {
  "(onboarding)/QrScanner": undefined;
  "(tabs)/CatProfileIntro": undefined;
};

export default function PairDeviceScreen() {
  const router = useRouter();
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const openInput = () => {
    setInputModalVisible(true);
  };

  const handleManualSubmit = (value: string) => {
    console.log("Entered device ID:", value);
    setDeviceId(value);

    if (value === "123") {
      router.push("/CatProfileIntro");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
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
          <QRCode value="123" size={200} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    bottom: 100,
  },
});
