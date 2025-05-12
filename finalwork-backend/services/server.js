const mongoose = require('mongoose');

// Connectie met MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Verbonden met MongoDB'))
.catch((err) => console.error('❌ MongoDB connectiefout:', err));
