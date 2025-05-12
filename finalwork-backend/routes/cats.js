const express = require('express');

const { logCatData, getAllCats } = require('../controllers/catsController');
const router = express.Router();

router.post('/log', logCatData);
router.get('/', getAllCats);

module.exports = router;
