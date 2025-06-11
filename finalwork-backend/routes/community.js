const express = require("express");
const path = require("path");
const fs = require("fs");
const communityService = require("../services/communityService.js");

const router = express.Router();


router.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ receivedBody: req.body });
});


router.post("/", async (req, res) => {
  try {
    const { ownerName, catName, caption, imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Geen afbeelding ontvangen" });
    }

    // Check base64 formaat
    const matches = imageBase64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: "Ongeldig base64-formaat" });
    }

    const ext = matches[1]; // bv. png, jpeg
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");

    // Sla afbeelding op in uploads folder
    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join(__dirname, "../uploads", fileName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // Maak nieuwe post aan
    const newPost = await communityService.createPost({
      ownerName,
      catName,
      caption,
      imageUrl,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kan post niet opslaan" });
  }
});

module.exports = router;
