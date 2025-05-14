require('dotenv').config(); // Laad .env eerst

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const catRoutes = require('../routes/cats');
app.use('/api/cats', catRoutes);

// Verbind met MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Verbonden met MongoDB');

    // Start de server pas NA succesvolle DB-verbinding
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server draait op http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connectiefout:', err);
  });
