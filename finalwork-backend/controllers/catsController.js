const Cat = require('../models/Cat');

// POST: log nieuwe data
exports.logCatData = async (req, res) => {
  try {
    const newCat = new Cat(req.body);
    await newCat.save();
    res.status(201).json({ message: 'Data opgeslagen', data: newCat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kon data niet opslaan' });
  }
};

// GET: haal alle katten op
exports.getAllCats = async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json({ error: 'Kon katten niet ophalen' });
  }
};
