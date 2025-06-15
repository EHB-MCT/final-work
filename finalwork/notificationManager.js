import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export const GEOFENCE_TASK = "GEOFENCE_TASK";

TaskManager.defineTask(
  GEOFENCE_TASK,
  async ({ data: { eventType, region }, error }) => {
    if (error) return console.error("GEOFENCE task error:", error);
    if (eventType === Location.GeofencingEventType.Exit) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚨 Je kat heeft de zone verlaten!",
          body: `Geofence '${region.identifier}' verlaten.`,
        },
        trigger: null,
      });
    }
  }
);
