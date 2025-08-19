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


  status: { 
    type: String, 
    enum: ["nieuwsgierig", "chill", "probleem"], 
    default: "chill" 
  }
});

module.exports = mongoose.model('Cat', catSchema);
