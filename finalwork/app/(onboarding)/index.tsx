import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import BackgroundShape from "../../assets/slideShape.svg";
import chartImg from "../../assets/images/chartImg.jpg";
import mapImg from "../../assets/images/mapImg.jpg";
import geofenceImg from "../../assets/images/geofenceImg.jpg";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { router } from "expo-router";
// TODO: make/photoshop images and replace these placeholder images

// const { width } = Dimensions.get("window");
// finalwork/assets/images/test.jpg
const slides = [
  {
    title: "Volg je kat",
    text: "Zie in realtime waar je kat zich bevindt – altijd en overal.",
    image: mapImg,
  },
  {
    title: "Bekijk statistieken",
    text: "Volg hoeveel je kat beweegt en rust en speelt – allemaal overzichtelijk.",
    image: chartImg,
  },
  {
    title: "Altijd op de hoogte",
    text: "Van weinig beweging tot nachtelijke avonturen – je krijgt een seintje",
    image: geofenceImg,
  },
];
export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<StackNavigationProp<any>>();
  // const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push("/(onboarding)/pairDevice");
    }
  };

  const handleSkip = () => {
    router.push("/(onboarding)/pairDevice");
  };

  return (
    <View style={styles.container}>
      {/* Background SVG */}
      <View style={styles.backgroundWrapper}>
        <BackgroundShape
          //  full page width and height
          width={Dimensions.get("window").width}
          // height={700}
          // viewBox="0 300 375 600"
          style={styles.backgroundSvg}
        />
      </View>

      <View style={styles.topWrapper}>
        {/* </View> */}
        <Image
          source={slides[currentIndex].image}
          resizeMode="contain"
          style={{
            width: Dimensions.get("window").width,
            height: 400,
            marginBottom: 50,
          }}
        />
      </View>
      {/* Title and Text */}
      <View style={styles.bottomWrapper}>
        <Text style={styles.title}>{slides[currentIndex].title}</Text>

        <Text style={styles.text}>{slides[currentIndex].text}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={handleNext}>
          {currentIndex < slides.length - 1 ? "Volgende" : "Laten we beginnen!"}
        </PrimaryButton>
        {/* <TouchableOpacity onPress={handleNext}>
          <Text style={styles.button}>Volgende</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? "#FD9003" : "#D9D9D9" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#005F4C",
    paddingTop: 80,
  },
  backgroundWrapper: {
    position: "absolute",
    top: -150,
    left: 0,
    right: 0,
    width: Dimensions.get("window").width,
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#fff",
  },
  dots: {
    flexDirection: "row",
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  // button: {
  //   fontSize: 16,
  //   width: 300,
  //   textAlign: "center",
  //   color: "#fff",
  //   padding: 10,
  //   borderWidth: 1,
  //   borderColor: "#fff",
  //   borderRadius: 5,
  //   marginVertical: 10,
  // },

  topWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    width: "100%",
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
