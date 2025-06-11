const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  ownerName: String,
  catName: String,
  imageUrl: String,
  caption: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
});

// 3e argument = expliciete collectionnaam
module.exports = mongoose.model("CommunityPost", CommunityPostSchema, "community_post");
