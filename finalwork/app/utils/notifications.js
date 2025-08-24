// utils/notifications.ts
import * as Notifications from "expo-notifications";

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions
export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// Trigger a local notification
export async function triggerGeofenceAlert() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Geofence Alert",
      body: "je kat is buiten de veilige zone!",
      sound: "default",
      data: { type: "geofence_breach" },
    },
    trigger: null, // Show immediately
  });
}

// const fetch = require("node-fetch");

// async function sendPushNotification(token, title, body) {
//   const message = {
//     to: token,
//     sound: "default",
//     title,
//     body,
//   };

//   await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
// }

// module.exports = { sendPushNotification };
