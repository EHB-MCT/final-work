const express = require("express");
const router = express.Router();
const CatLocation = require("../models/CatLocation");

// GET alle cat locations
router.get("/", async (req, res) => {
  try {
    const catLocations = await CatLocation.find();
    console.log("Gevonden cat locations:", catLocations);
    res.json(catLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const catLocation = new CatLocation({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  try {
    const newLocation = await catLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
