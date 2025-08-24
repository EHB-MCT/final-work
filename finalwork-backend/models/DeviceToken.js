const mongoose = require("mongoose");

const deviceTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
});

module.exports = mongoose.model("DeviceToken", deviceTokenSchema);
