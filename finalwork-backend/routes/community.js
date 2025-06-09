const express = require("express");
const multer = require("multer");
const path = require("path");
const CommunityPost = require("../models/CommunityPost");
const router = express.Router();


// Multer config voor foto-upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST: nieuwe post uploaden
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { ownerName, catName, caption } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const newPost = new CommunityPost({ ownerName, catName, caption, imageUrl });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kan post niet opslaan" });
  }
});

// GET: alle posts ophalen
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Kan posts niet ophalen" });
  }
});

module.exports = router;
