const express = require("express");
const { getSettings } = require("../controllers/setting.controller");

const router = express.Router();

router.get("/", getSettings);

module.exports = router;