const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");

// ✅ POST nieuwe kat toevoegen
router.post("/", async (req, res) => {
  const { name, ownerId, activityLevel, location, status, battery, environment,sleep,jumps } = req.body;

  const cat = new Cat({
    name,
    ownerId,
    activityLevel,
    location,
    status,
    battery,
    environment,
    sleep,
    jumps
  });

  try {
    const newCat = await cat.save();
    res.status(201).json(newCat);
  } catch (error) {
    console.error("Fout bij opslaan van Cat:", error);
    res.status(400).json({ message: error.message });
  }
});


// ✅ GET laatste kat (op timestamp)
router.get("/latest", async (req, res) => {
  try {
    const latestCat = await Cat.findOne().sort({ timestamp: -1 }); // laatste entry
    if (!latestCat) {
      return res.status(404).json({ message: "Geen katten gevonden" });
    }
    res.json(latestCat);
  } catch (error) {
    console.error("Fout bij ophalen laatste kat:", error);
    res.status(500).json({ message: error.message });
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

// ✅ PATCH alleen batterij & environment updaten
router.patch("/:id", async (req, res) => {
  const { battery, environment } = req.body;

  try {
    const updatedCat = await Cat.findByIdAndUpdate(
      req.params.id,
      { battery, environment },
      { new: true, runValidators: true }
    );

    if (!updatedCat) {
      return res.status(404).json({ message: "Kat niet gevonden" });
    }

    res.json(updatedCat);
  } catch (error) {
    console.error("Fout bij updaten van Cat:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
