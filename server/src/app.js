const express = require("express");
const cors = require("cors")

const campaignRoutes = require("./routes/campaign.route");
const settingRoutes = require("./routes/setting.route");
const leadRoutes = require("./routes/lead.route")
const campaignMailRoutes = require("./routes/campaignmail.route")
const mailRoutes = require("./routes/mail.route")

const app = express();

app.use(express.json());
app.use(cors())
app.use("/campagnes", campaignRoutes);
app.use("/settings", settingRoutes);
app.use("/leads", leadRoutes);
app.use("/campagnes-mail", campaignMailRoutes);
app.use("/mail", mailRoutes);

module.exports = app;