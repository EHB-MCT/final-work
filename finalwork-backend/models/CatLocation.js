const mongoose = require("mongoose");

const catLocationSchema = new mongoose.Schema({
  catId: { type: mongoose.Schema.Types.ObjectId, ref: "Cat", required: true }, // nieuw
  latitude: Number,
  longitude: Number,
  jump: Number,
  activityLevel: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CatLocation", catLocationSchema);
