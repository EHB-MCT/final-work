import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Defs, Filter, FeDropShadow } from "react-native-svg";
import BatteryIcon from "../assets/icons/battery.svg";

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100%
  color?: string;
  backgroundColor?: string;
}

export default function CircularProgress({
  size = 100,
  strokeWidth = 10,
  progress,
  color = "#AFD235",
  backgroundColor = "transparent",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(46, 46, 46, 0.38)",
        borderRadius: size / 2,
        overflow: "hidden", // keep SVG glow inside
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <FeDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor={color}
              floodOpacity="0.8"
            />
          </Filter>
        </Defs>

        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle with Neon Glow */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
          filter="url(#shadow)"
        />
      </Svg>

      {/* Centered battery icon and text */}
      <View
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BatteryIcon style={{ width: 24, height: 24, marginBottom: 8 }} />
        <Text style={styles.text}>{`${progress}%`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
