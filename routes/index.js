// routes/index.js
import express from "express";
import { serverConfig } from "../config/server.config.mjs";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import welcomeMessage from "../config/welcomeMessage.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(welcomeMessage);
});

router.use("/api/auth/", rateLimit(serverConfig.limiter), authRoutes);
router.use("/api/users/", userRoutes);
router.use("/api/appointments/", appointmentRoutes);

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
