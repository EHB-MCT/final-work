const express = require('express');
const { getAllCats, logCatData } = require('../controllers/catsController');
const router = express.Router();

router.get('/', getAllCats);    
router.post('/log', logCatData);

module.exports = router;
