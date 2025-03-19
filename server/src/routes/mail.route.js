const express = require("express");
const { track_open } = require("../controllers/mail.controller");

const router = express.Router();

router.get("/track-open/:mail_id", track_open)

module.exports = router;