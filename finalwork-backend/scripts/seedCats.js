const mongoose = require('mongoose');
require('dotenv').config();

const Cat = require('../models/Cat');

const dummyCats = [
  {
    name: 'Milo',
    owner: 'user001',
    activityLevel: 3,
    location: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
  },
  {
    name: 'Luna',
    owner: 'user002',
    activityLevel: 5,
    location: {
      latitude: 51.9244,
      longitude: 4.4777,
    },
  },
  {
    name: 'Tiger',
    owner: 'user003',
    activityLevel: 2,
    location: {
      latitude: 50.8503,
      longitude: 4.3517,
    },
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Verbonden met MongoDB');
    await Cat.deleteMany(); // optioneel: verwijder bestaande data
    await Cat.insertMany(dummyCats);
    console.log('✅ Dummy katten toegevoegd');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Fout bij connectie of insert:', err);
    mongoose.disconnect();
  });
