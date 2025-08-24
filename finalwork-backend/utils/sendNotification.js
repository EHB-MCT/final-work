const { Expo } = require("expo-server-sdk");

const expo = new Expo();

async function sendNotification(tokens, message) {
  let notifications = [];

  for (let token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`❌ Ongeldige push token: ${token}`);
      continue;
    }

    notifications.push({
      to: token,
      sound: "default",
      body: message,
      data: { extra: "data" },
    });
  }

  let chunks = expo.chunkPushNotifications(notifications);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("📩 Tickets ontvangen:", ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("❌ Fout bij verzenden notificatie:", error);
    }
  }

  return tickets;
}

module.exports = sendNotification;
