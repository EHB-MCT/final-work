import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import HeaderSvg from "@/assets/header.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularProgress from "../CircularProgress";

const { width } = Dimensions.get("window");

export default function Header() {
  const [uri, setUri] = useState<string | null>(null);
  const [catName, setCatName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("profileImage")
        .then((saved) => {
          if (saved) setUri(saved);
        })
        .catch(console.error);
      AsyncStorage.getItem("catName")
        .then((saved) => {
          if (saved) setCatName(saved);
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
        {/* <CircularProgress progress={75} size={120} strokeWidth={10} /> */}
        {/* cat name */}
        <Text
          style={{
            color: "#000000ff",
            fontSize: 18,
            marginTop: 8,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {catName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 100,
              backgroundColor: "#63B231",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 5,
              // dropshadow
              shadowColor: "#63B231",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 1,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            {/* <BlurView intensity={20} style={StyleSheet.absoluteFill} /> */}
          </View>

          <Text
            style={{
              color: "#000000ff",
              fontSize: 18,
              // marginTop: 8,
              textAlign: "center",
            }}
          >
            Verbonden
            {/* TODO: make connection status variable if no data has been received after 1 minute(?) */}
          </Text>
        </View>
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
