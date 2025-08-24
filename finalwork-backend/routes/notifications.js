const express = require("express");
const router = express.Router();
const DeviceToken = require("../models/DeviceToken");
const sendNotification = require("../utils/sendNotification");

// POST /api/notifications/send
router.post("/send", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Bericht is verplicht" });

  try {
    const tokens = await DeviceToken.find().distinct("token");
    if (tokens.length === 0) {
      return res.status(200).json({ success: false, message: "Geen tokens opgeslagen" });
    }

    await sendNotification(tokens, message);
    res.json({ success: true, message: "Notificatie verstuurd!" });
  } catch (error) {
    console.error("❌ Error bij verzenden notificatie:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
