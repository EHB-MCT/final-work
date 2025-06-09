const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  ownerName: String,
  catName: String,
  imageUrl: String, // bestandsnaam van geüploade foto
  caption: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
