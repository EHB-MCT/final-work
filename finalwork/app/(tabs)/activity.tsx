import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import { colors } from "@/constants/Colors";
import ActivityButtons from "@/components/ActivityButtons";
import { fetchLatestCatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

type ActivityType = "sleep" | "move" | "jump";

interface DataPoint {
  timestamp: string;
  value: number;
}

export default function ActivityScreen() {
  const [active, setActive] = useState<ActivityType>("move");
  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [jumpData, setJumpData] = useState<DataPoint[]>([]);
  const [sleepData, setSleepData] = useState<DataPoint[]>([]);
  const [statusData, setStatusData] = useState<DataPoint[]>([]);

  // Laden van AsyncStorage bij start
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = ["activityData", "jumpData", "sleepData", "statusData"];
        const results = await AsyncStorage.multiGet(keys);

        const act = results[0][1];
        const jump = results[1][1];
        const sleep = results[2][1];
        const status = results[3][1];

        if (act) setActivityData(JSON.parse(act));
        if (jump) setJumpData(JSON.parse(jump));
        if (sleep) setSleepData(JSON.parse(sleep));
        if (status) setStatusData(JSON.parse(status));
      } catch (e) {
        console.error("Fout bij laden AsyncStorage", e);
      }
    };
    loadData();
  }, []);

  // Interval voor updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const loc = await fetchLatestCatLocation();
        if (!loc?.timestamp) return;
        const ts = loc.timestamp;

        const appendData = async (
          existing: DataPoint[],
          newVal: number,
          key: string,
          setFn: React.Dispatch<React.SetStateAction<DataPoint[]>>
        ) => {
          if (existing.length === 0 || existing[existing.length - 1].timestamp !== ts) {
            const updated = [...existing, { timestamp: ts, value: newVal }];
            setFn(updated);
            await AsyncStorage.setItem(key, JSON.stringify(updated));
          }
        };

        await appendData(activityData, loc.activityLevel ?? 0, "activityData", setActivityData);
        await appendData(jumpData, loc.jumps ?? 0, "jumpData", setJumpData);
        await appendData(sleepData, loc.sleep ?? 0, "sleepData", setSleepData);

        const statusCode =
          loc.status === "nieuwsgierig" ? 1 :
          loc.status === "chill" ? 2 :
          loc.status === "probleem" ? 3 : 0;

        await appendData(statusData, statusCode, "statusData", setStatusData);
      } catch (e) {
        console.error("Fout bij ophalen locatie", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activityData, jumpData, sleepData, statusData]);

  // --- Functie voor weekfilter ---
  const getDataForWeek = (data: DataPoint[], weekOffset = 0): DataPoint[] => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return data.filter(d => {
      const ts = new Date(d.timestamp);
      return ts >= startOfWeek && ts < endOfWeek;
    });
  };

  // --- Bereid data voor grafiek ---
  const selectedData =
    active === "move" ? activityData :
    active === "jump" ? jumpData :
    sleepData;

  const thisWeekData = getDataForWeek(selectedData, 0);
  const lastWeekData = getDataForWeek(selectedData, -1);

  const chartLabels = thisWeekData.map(d => new Date(d.timestamp).toLocaleDateString());
  const chartDatasets = [
    { data: thisWeekData.map(d => d.value), color: () => "#00FF00", strokeWidth: 2, label: "Deze week" },
    { data: lastWeekData.map(d => d.value), color: () => "#FFD700", strokeWidth: 2, label: "Vorige week" },
  ];

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: "Geen status", color: "#999" },
    1: { label: "Nieuwsgierig", color: "#FFD700" },
    2: { label: "Chill", color: "#00FF00" },
    3: { label: "Probleem", color: "#FF4500" },
  };
  const currentStatus = statusData[statusData.length - 1]?.value || 0;
  const currentStatusLabel = statusMap[currentStatus].label;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingTop: 80 }}>
      <ActivityButtons active={active} onPress={setActive} />

      {/* Huidige status boven de grafiek */}
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>Status: {currentStatusLabel}</Text>
      </View>

      {/* Legend voor vergelijking */}
      <View style={styles.legendWrapper}>
        <Text style={{ color: "#00FF00", fontWeight: "bold" }}>● Deze week</Text>
        <Text style={{ color: "#FFD700", fontWeight: "bold" }}>● Vorige week</Text>
      </View>

      {/* Grafiek */}
      <View style={styles.chartWrapper}>
        <Text style={styles.chartTitle}>
          {active === "sleep" ? "Slaapuren" : active === "move" ? "Beweging" : "Sprongen"}
        </Text>
        <LineChart
          data={{ labels: chartLabels, datasets: chartDatasets }}
          width={Dimensions.get("window").width * 0.9}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#333",
            backgroundGradientTo: "#333",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: () => "#fff",
          }}
          style={{ borderRadius: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statusWrapper: { marginTop: -80, marginBottom: 10, padding: 10, backgroundColor: "#222", borderRadius: 10 },
  statusText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  chartWrapper: { marginTop: 20, marginBottom: 30, alignItems: "center" },
  chartTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  legendWrapper: { flexDirection: "row", justifyContent: "space-around", width: "60%", marginBottom: 10 },
});
