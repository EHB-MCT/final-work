const express = require("express");
const router = express.Router();
const DeviceToken = require("../models/DeviceToken");

router.post("/", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token ontbreekt" });

  try {
    const exists = await DeviceToken.findOne({ token });
    if (!exists) {
      await new DeviceToken({ token }).save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
