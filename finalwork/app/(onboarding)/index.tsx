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
import BackgroundShape from "../../assets/slideShape.svg";
import placholderImg from "../../assets/images/Vertical-Placeholder-Image.jpg"; // <-- need to replace these with actual images (3 total)
import { PrimaryButton } from "@/components/ui/PrimaryButton";
// TODO: make/photoshop images and replace these placeholder images

// const { width } = Dimensions.get("window");
// finalwork/assets/images/test.jpg
const slides = [
  {
    title: "Volg je kat",
    text: "Zie in realtime waar je kat zich bevindt – altijd en overal.",
    image: placholderImg,
  },
  {
    title: "Bekijk statistieken",
    text: "Volg hoeveel je kat beweegt, rust en speelt – allemaal overzichtelijk.",
    image: placholderImg,
  },
  {
    title: "Altijd op de hoogte",
    text: "Van weinig beweging tot nachtelijke avonturen – je krijgt een seintje",
    image: placholderImg,
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("(onboarding)/pairDevice");
    }
  };

  const handleSkip = () => {
    navigation.navigate("(onboarding)/pairDevice");
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
            height: 350,
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
              { backgroundColor: i === currentIndex ? "#E1B048" : "#D9D9D9" },
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
    backgroundColor: "#19162B",
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
    width: "100%",
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
