const mongoose = require("mongoose");

const catLocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  jump: Number,
  activityLevel: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CatLocation", catLocationSchema, "cat_locations");
