import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "@/constants/Colors";
import ActivityButtons from "@/components/ActivityButtons";
import { fetchLatestCatLocation, CatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DataPoint = { timestamp: string; value: number };
const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

// Group values by weekday
function groupByDay(data: DataPoint[]) {
  const grouped: Record<string, number> = {};
  data.forEach(({ timestamp, value }) => {
    const raw = new Date(timestamp).toLocaleDateString("nl-BE", {
      weekday: "short",
    });
    const day = raw[0].toUpperCase() + raw.slice(1);
    grouped[day] = (grouped[day] || 0) + value;
  });
  return WEEKDAYS.map((d) => grouped[d] || 0);
}

// Sleep = inactivity ≥ 30 minutes
function computeSleep(activity: DataPoint[], thresholdMin = 30) {
  const sleepMap: Record<string, number> = {};
  const sorted = [...activity].sort(
    (a, b) => +new Date(a.timestamp) - +new Date(b.timestamp)
  );
  let last: Date | null = null;
  let lastDay = "";

  for (const { timestamp } of sorted) {
    const curr = new Date(timestamp);
    const raw = curr.toLocaleDateString("nl-BE", { weekday: "short" });
    const currDay = raw[0].toUpperCase() + raw.slice(1);

    if (last && currDay === lastDay) {
      const diffMin = (curr.getTime() - last.getTime()) / 60000;
      if (diffMin >= thresholdMin) {
        sleepMap[currDay] = (sleepMap[currDay] || 0) + diffMin;
      }
    }
    last = curr;
    lastDay = currDay;
  }
  return WEEKDAYS.map((d) => Math.round(sleepMap[d] || 0));
}

export default function ActivityScreen() {
  const [active, setActive] = useState<"sleep" | "move" | "jump">("sleep");
  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [jumpData, setJumpData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedActivity = await AsyncStorage.getItem("activityData");
        const storedJump = await AsyncStorage.getItem("jumpData");

        if (storedActivity) {
          setActivityData(JSON.parse(storedActivity));
        }
        if (storedJump) {
          setJumpData(JSON.parse(storedJump));
        }
      } catch (e) {
        console.error("Failed to load data from AsyncStorage", e);
      }
    };

    loadData();

    const interval = setInterval(async () => {
      try {
        const loc = await fetchLatestCatLocation();
        if (loc?.timestamp) {
          const ts = loc.timestamp as string;

          // Only add new activity point if timestamp changed
          setActivityData((prev) => {
            if (prev.length === 0 || prev[prev.length - 1].timestamp !== ts) {
              const updatedData = [
                ...prev,
                { timestamp: ts, value: loc.activityLevel ?? 0 },
              ];
              AsyncStorage.setItem("activityData", JSON.stringify(updatedData));
              return updatedData;
            }
            return prev;
          });

          // Only add new jump point if timestamp changed
          setJumpData((prev) => {
            if (prev.length === 0 || prev[prev.length - 1].timestamp !== ts) {
              const updatedData = [
                ...prev,
                { timestamp: ts, value: loc.jump ?? 0 },
              ];
              AsyncStorage.setItem("jumpData", JSON.stringify(updatedData));
              return updatedData;
            }
            return prev;
          });
        }
        console.log("Fetched latest cat location:", loc);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const moveByDay = groupByDay(activityData);
  const jumpByDay = groupByDay(jumpData);
  const sleepByDay = computeSleep(activityData);

  const dataSet = {
    sleep: sleepByDay,
    move: moveByDay,
    jump: jumpByDay,
  } as Record<string, number[]>;

  const chartData = {
    labels: WEEKDAYS,
    datasets: [{ data: dataSet[active] || [] }],
  };

  const total = (dataSet[active] || []).reduce((sum, n) => sum + n, 0);
  const isSleep = active === "sleep";
  const totalMinutes = total;
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.buttonsWrapper}>
        <ActivityButtons active={active} onPress={setActive} />
      </View>

      {/* Debug: show counts */}
      {/* <Text style={styles.info}>
        Data points – Move: {activityData.length}, Jump: {jumpData.length}
      </Text> */}

      {active === "jump" && (
        <Text style={styles.info}>Aantal sprongen: {total}</Text>
      )}
      {active === "move" && (
        <Text style={styles.info}>Activiteit: {total} </Text>
      )}
      {active === "sleep" && (
        <Text style={styles.info}>Slaapuren: {totalHours} u</Text>
      )}

      <LineChart
        data={chartData}
        width={Dimensions.get("window").width}
        height={420}
        chartConfig={{
          backgroundGradientFrom: "#19162B",
          backgroundGradientTo: "#19162B",
          decimalPlaces: isSleep ? 1 : 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          propsForLabels: {
            formatYLabel: (y) => (isSleep ? `${y} u` : y),
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  chartWrapper: {
    // marginTop: 200,
  },
  chart: {
    // borderRadius: 10,
  },

  info: {
    fontSize: 16,
    marginVertical: 12,
  },
  buttonsWrapper: {
    marginTop: 200,
    width: "100%",
  },
});
