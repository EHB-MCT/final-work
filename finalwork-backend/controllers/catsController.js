const Cat = require('../models/Cat');

// POST: log nieuwe data
exports.logCatData = async (req, res) => {
  try {
    const { name, ownerId, activityLevel, location, status } = req.body;

    // status check
    if (status && !["nieuwsgierig", "chill", "probleem"].includes(status)) {
      return res.status(400).json({ error: "Ongeldige statuswaarde" });
    }

    const newCat = new Cat({
      name,
      ownerId,
      activityLevel,
      location,
      status
    });

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

// PUT: update status van een kat
exports.updateCatStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["nieuwsgierig", "chill", "probleem"].includes(status)) {
      return res.status(400).json({ error: "Ongeldige statuswaarde" });
    }

    const updatedCat = await Cat.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCat) {
      return res.status(404).json({ error: "Kat niet gevonden" });
    }

    res.status(200).json({ message: "Status bijgewerkt", data: updatedCat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kon status niet updaten" });
  }
};
