const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const adminRoutes = require("./routes/adminRoutes");
// const dashboardRoutes = require("./src/routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
