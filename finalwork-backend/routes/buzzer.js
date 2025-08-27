const express = require("express");
const router = express.Router();
const buzzerController = require("../controllers/buzzerController");

router.post("/trigger", buzzerController.triggerBuzzer);
router.get("/status", buzzerController.checkBuzzer);

module.exports = router;
