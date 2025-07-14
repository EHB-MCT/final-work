const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: String },
  activityLevel: { type: Number },
  location: {
    latitude: Number,
    longitude: Number,
  },
  timestamp: { type: Date, default: Date.now },


  nieuwsgierig: { type: Boolean, default: false },
  chill: { type: Boolean, default: false },
  probleem: { type: Boolean, default: false },
});

module.exports = mongoose.model('Cat', catSchema);
 