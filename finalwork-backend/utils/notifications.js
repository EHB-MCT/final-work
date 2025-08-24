// utils/notifications.js
const fetch = require("node-fetch");

async function sendPushNotification(token, title, body) {
  const message = {
    to: token,
    sound: "default",
    title,
    body,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

module.exports = { sendPushNotification };
