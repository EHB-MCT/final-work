const CommunityPost = require("../models/CommunityPost");

async function createPost(data) {
  const post = new CommunityPost(data);
  return await post.save();
}

async function getAllPosts() {
  return await CommunityPost.find().sort({ createdAt: -1 });
}

module.exports = {
  createPost,
  getAllPosts,
};
