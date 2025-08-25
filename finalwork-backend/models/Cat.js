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
  },


  battery: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 100 
  },

  
  environment: {
    type: String,
    enum: ["indoors", "outdoors"],
    default: "indoors"
  }
});

module.exports = mongoose.model('Cat', catSchema);
