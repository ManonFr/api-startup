const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

app.use("/api", authRoutes);
app.use("/api", protectedRoutes);

// CRON task (revenue reminder)
const startRevenueReminderJob = require("./cron/sendRevenueReminder");
startRevenueReminderJob();

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
