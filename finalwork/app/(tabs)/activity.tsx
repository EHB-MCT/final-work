import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "@/constants/Colors";
import ActivityButtons from "@/components/ActivityButtons";
import { fetchLatestCatLocation } from "../services/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DataPoint = { timestamp: string; value: number };
const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

// Hulpfunctie: groepeer per dag
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

// Hulpfunctie: slaap = inactiviteit ≥ 30 minuten
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

// Weeknummer berekenen
function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor((diff + start.getDay()) / 7);
}

// Data per week + dag groeperen
function groupByWeek(data: DataPoint[]) {
  const grouped: Record<number, Record<string, number>> = {};

  data.forEach(({ timestamp, value }) => {
    const d = new Date(timestamp);
    const week = getWeekNumber(d);
    const raw = d.toLocaleDateString("nl-BE", { weekday: "short" });
    const day = raw[0].toUpperCase() + raw.slice(1);

    if (!grouped[week]) grouped[week] = {};
    grouped[week][day] = (grouped[week][day] || 0) + value;
  });

  return grouped;
}

// Huidige week vs vorige week vergelijken
function getWeekComparison(data: DataPoint[]) {
  const grouped = groupByWeek(data);

  const weeks = Object.keys(grouped).map(Number).sort((a, b) => b - a); // meest recente eerst
  const thisWeek = weeks[0] ?? 0;
  const lastWeek = weeks[1] ?? thisWeek - 1;

  const thisWeekData = WEEKDAYS.map((d) => grouped[thisWeek]?.[d] || 0);
  const lastWeekData = WEEKDAYS.map((d) => grouped[lastWeek]?.[d] || 0);

  return { thisWeekData, lastWeekData };
}

export default function ActivityScreen() {
  const [active, setActive] = useState<
    "sleep" | "move" | "jump" | "nieuwsgierig" | "chill" | "probleem"
  >("sleep");

  const [activityData, setActivityData] = useState<DataPoint[]>([]);
  const [jumpData, setJumpData] = useState<DataPoint[]>([]);
  const [nieuwsgierigData, setNieuwsgierigData] = useState<DataPoint[]>([]);
  const [chillData, setChillData] = useState<DataPoint[]>([]);
  const [probleemData, setProbleemData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = [
          "activityData",
          "jumpData",
          "nieuwsgierigData",
          "chillData",
          "probleemData",
        ];

        const [act, jump, nieuwsg, chill, probleem] = await AsyncStorage.multiGet(keys);

        if (act[1]) setActivityData(JSON.parse(act[1]));
        if (jump[1]) setJumpData(JSON.parse(jump[1]));
        if (nieuwsg[1]) setNieuwsgierigData(JSON.parse(nieuwsg[1]));
        if (chill[1]) setChillData(JSON.parse(chill[1]));
        if (probleem[1]) setProbleemData(JSON.parse(probleem[1]));
      } catch (e) {
        console.error("Fout bij laden uit AsyncStorage", e);
      }
    };

    loadData();

    const interval = setInterval(async () => {
      try {
        const loc = await fetchLatestCatLocation();
        if (loc?.timestamp) {
          const ts = loc.timestamp as string;

          const appendData = async (
            existing: DataPoint[],
            newVal: number,
            key: string,
            setFn: React.Dispatch<React.SetStateAction<DataPoint[]>>
          ) => {
            if (
              existing.length === 0 ||
              existing[existing.length - 1].timestamp !== ts
            ) {
              const updated = [...existing, { timestamp: ts, value: newVal }];
              setFn(updated);
              await AsyncStorage.setItem(key, JSON.stringify(updated));
            }
          };

          await appendData(activityData, loc.activityLevel ?? 0, "activityData", setActivityData);
          await appendData(jumpData, loc.jump ?? 0, "jumpData", setJumpData);

          if (loc.nieuwsgierig !== undefined) {
            await appendData(nieuwsgierigData, loc.nieuwsgierig, "nieuwsgierigData", setNieuwsgierigData);
          }
          if (loc.chill !== undefined) {
            await appendData(chillData, loc.chill, "chillData", setChillData);
          }
          if (loc.probleem !== undefined) {
            await appendData(probleemData, loc.probleem, "probleemData", setProbleemData);
          }
        }
      } catch (e) {
        console.error("Fout bij ophalen:", e);
      }
    }, 10000); // elke 10 seconden

    return () => clearInterval(interval);
  }, []);

  const dataSet = {
    move: groupByDay(activityData),
    jump: groupByDay(jumpData),
    sleep: computeSleep(activityData),
    nieuwsgierig: groupByDay(nieuwsgierigData),
    chill: groupByDay(chillData),
    probleem: groupByDay(probleemData),
  };

  // Chart data (extra logica voor move)
  let chartData;
  if (active === "move") {
    const { thisWeekData, lastWeekData } = getWeekComparison(activityData);
    chartData = {
      labels: WEEKDAYS,
      datasets: [
        { data: thisWeekData, color: () => "rgba(0, 255, 0, 1)", strokeWidth: 2 },
        { data: lastWeekData, color: () => "rgba(255, 165, 0, 1)", strokeWidth: 2 },
      ],
      legend: ["Deze week", "Vorige week"],
    };
  } else {
    chartData = {
      labels: WEEKDAYS,
      datasets: [{ data: dataSet[active] || [] }],
    };
  }

  const total = (dataSet[active] || []).reduce((sum, n) => sum + n, 0);
  const isSleep = active === "sleep";
  const totalHours = (total / 60).toFixed(1);

  const labels: Record<string, string> = {
    move: "Activiteit",
    jump: "Aantal sprongen",
    sleep: "Slaapuren",
    nieuwsgierig: "Nieuwsgierig gedrag",
    chill: "Chill-modus",
    probleem: "Probleemsituaties",
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsWrapper}>
        <ActivityButtons active={active} onPress={setActive} />
      </View>

      <Text style={styles.info}>
        {labels[active]}: {isSleep ? `${totalHours} u` : total}
      </Text>

      <LineChart
        data={chartData}
        width={Dimensions.get("window").width}
        height={420}
        chartConfig={{
          backgroundGradientFrom: "#19162B",
          backgroundGradientTo: "#19162B",
          decimalPlaces: isSleep ? 1 : 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
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
  chart: {},
  info: {
    fontSize: 16,
    marginVertical: 12,
    color: "#fff",
  },
  buttonsWrapper: {
    marginTop: 200,
    width: "100%",
  },
});
