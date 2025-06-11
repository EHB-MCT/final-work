require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Zet limiet omhoog voor grote base64 data
app.use("/uploads", express.static("uploads"));

// Routes
const communityRoutes = require("./routes/community");
app.use("/api/community", communityRoutes);


// Connectie met MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Verbonden met MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server draait op http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connectie-fout:", err);
  });
