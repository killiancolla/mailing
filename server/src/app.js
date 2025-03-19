import express from "express"
import cors from "cors"

import campaignRoutes from "./routes/campaign.route.js";
import settingRoutes from "./routes/setting.route.js";
import leadRoutes from "./routes/lead.route.js"
import campaignMailRoutes from "./routes/campaignmail.route.js"
import mailRoutes from "./routes/mail.route.js"

const app = express();

app.use(express.json());
app.use(cors())
app.use("/campagnes", campaignRoutes);
app.use("/settings", settingRoutes);
app.use("/leads", leadRoutes);
app.use("/campagnes-mail", campaignMailRoutes);
app.use("/mail", mailRoutes);

export default app;