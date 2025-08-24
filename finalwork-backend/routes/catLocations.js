const express = require("express");
const router = express.Router();
const CatLocation = require("../models/CatLocation");
const DeviceToken = require("../models/DeviceToken"); // nieuw model
const { sendPushNotification } = require("../utils/notifications"); // helper

// ✅ GET alle cat locations
router.get("/", async (req, res) => {
  try {
    const catLocations = await CatLocation.find().sort({ timestamp: -1 });
    console.log("Gevonden cat locations:", catLocations);
    res.json(catLocations);
  } catch (error) {
    console.error("❌ Fout bij ophalen:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST nieuwe cat location toevoegen
router.post("/", async (req, res) => {
  const { latitude, longitude, jump, activityLevel, timestamp } = req.body;

  const catLocation = new CatLocation({
    latitude,
    longitude,
    jump,
    activityLevel,
    timestamp,
  });

  try {
    const newLocation = await catLocation.save();
    console.log("📍 Nieuwe cat location opgeslagen:", newLocation);

    // --- 🔔 Notificatie check ---
    const HOME = { lat: 50.904918, lon: 4.355563 }; // voorbeeld coördinaat "veilige zone"
    const MAX_DISTANCE = 0.001; // ~100 meter (snelle check)

    const dist = Math.sqrt(
      Math.pow(latitude - HOME.lat, 2) + Math.pow(longitude - HOME.lon, 2)
    );

    if (dist > MAX_DISTANCE) {
      console.log("🚨 Kat is buiten de veilige zone → notificatie sturen");

      const tokens = await DeviceToken.find();
      for (let device of tokens) {
        await sendPushNotification(
          device.token,
          "🚨 Kat buiten zone!",
          "Je kat heeft de veilige zone verlaten."
        );
      }
    }

    res.status(201).json(newLocation);
  } catch (error) {
    console.error("❌ Fout bij opslaan:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE alle cat locations
router.delete("/", async (req, res) => {
  try {
    const result = await CatLocation.deleteMany({});
    res.status(200).json({
      message: `${result.deletedCount} cat locations verwijderd`,
    });
  } catch (error) {
    console.error("Fout bij verwijderen:", error);
    res.status(500).json({ message: "Fout bij verwijderen van cat locations" });
  }
});

module.exports = router;
