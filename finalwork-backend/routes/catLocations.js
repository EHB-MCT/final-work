const express = require("express");
const router = express.Router();
const CatLocation = require("../models/CatLocation");

// ✅ GET alle cat locations
router.get("/", async (req, res) => {
  try {
    const catLocations = await CatLocation.find().sort({ timestamp: -1 }); // Optioneel: nieuwste eerst
    console.log("Gevonden cat locations:", catLocations);
    res.json(catLocations);
  } catch (error) {
    console.error("❌ Fout bij ophalen:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST nieuwe cat location toevoegen
router.post("/", async (req, res) => {
  const { latitude, longitude, jump, activityLevel } = req.body;

  const catLocation = new CatLocation({
    latitude,
    longitude,
    jump,
    activityLevel,
  });

  try {
    const newLocation = await catLocation.save();
    console.log("📍 Nieuwe cat location opgeslagen:", newLocation);
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("❌ Fout bij opslaan:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
