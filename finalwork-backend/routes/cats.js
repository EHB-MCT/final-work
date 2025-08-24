const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");

// ✅ POST nieuwe kat toevoegen
router.post("/", async (req, res) => {
  const { name, ownerId, activityLevel, location, status } = req.body;

  const cat = new Cat({
    name,
    ownerId,
    activityLevel,
    location,
    status,
  });

  try {
    const newCat = await cat.save();
    res.status(201).json(newCat);
  } catch (error) {
    console.error("Fout bij opslaan van Cat:", error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ GET alle katten
router.get("/", async (req, res) => {
  try {
    const cats = await Cat.find().sort({ name: 1 });
    res.json(cats);
  } catch (error) {
    console.error("Fout bij ophalen katten:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
