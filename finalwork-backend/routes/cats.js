const express = require('express');
const { getAllCats, logCatData } = require('../controllers/catsController');
const router = express.Router();

router.get('/', getAllCats);     // <-- Dit moet er zijn
router.post('/log', logCatData);

module.exports = router;
