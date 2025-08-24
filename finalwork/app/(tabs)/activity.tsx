import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { colors } from "@/constants/Colors";
import ActivityButtons from "@/components/ActivityButtons";
import { fetchLatestCatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ActivityType = "sleep" | "move" | "jump" | "status";

interface DataPoint {
  timestamp: string;
  value: number;
}

export default function ActivityScreen() {
  const [active, setActive] = useState<ActivityType>("status");

  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [jumpData, setJumpData] = useState<DataPoint[]>([]);
  const [statusData, setStatusData] = useState<DataPoint[]>([]);

  // Laden van AsyncStorage bij start
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = ["activityData", "jumpData", "statusData"];
        const results = await AsyncStorage.multiGet(keys);

        const act = results[0][1];
        const jump = results[1][1];
        const status = results[2][1];

        if (act) setActivityData(JSON.parse(act));
        if (jump) setJumpData(JSON.parse(jump));
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
        await appendData(jumpData, loc.jump ?? 0, "jumpData", setJumpData);

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
  }, [activityData, jumpData, statusData]);

  // Functies om totaal/slaapuren te berekenen
  const total = (data: DataPoint[]) => data.reduce((sum, d) => sum + d.value, 0);
  const totalHours = (total(activityData) / 60).toFixed(1);

  const statusMap: Record<number, { label: string; color: string }> = {
    0: { label: "Geen status", color: "#999" },
    1: { label: "Nieuwsgierig", color: "#FFD700" },
    2: { label: "Chill", color: "#00FF00" },
    3: { label: "Probleem", color: "#FF4500" },
  };

  const statusLabel = statusMap[statusData[statusData.length - 1]?.value || 0]?.label || "Geen status";

  return (
    <View style={styles.container}>
      <ActivityButtons active={active} onPress={setActive} />

      <View style={styles.card}>
        {active === "sleep" && (
          <Text style={styles.cardText}>Slaap: {totalHours} uur</Text>
        )}
        {active === "move" && (
          <Text style={styles.cardText}>Beweging: {total(activityData)}</Text>
        )}
        {active === "jump" && (
          <Text style={styles.cardText}>Sprongen: {total(jumpData)}</Text>
        )}
        {active === "status" && (
          <View style={[styles.statusCard, { backgroundColor: statusMap[statusData[statusData.length - 1]?.value || 0].color }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingTop: 100,
  },
  card: {
    marginTop: 30,
    width: Dimensions.get("window").width * 0.8,
    paddingVertical: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
  },
  cardText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  statusCard: {
    width: "100%",
    paddingVertical: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
});
