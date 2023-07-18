import express from "express";
import authJwt from "../middleware/authJwt.js";
import controller from "../controllers/appointment.controller.js";


const router = express.Router();

router.post("/:userId", [authJwt.verifyToken], controller.createAppointment);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdminOrModerator], controller.updateAppointment);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteAppointment);
router.get("/user/:userId", [authJwt.verifyToken], controller.getAppointmentsByUserId);
router.get("/week", [authJwt.verifyToken], controller.getAllAppointmentsByWeek);
router.get("/:id", [authJwt.verifyToken], controller.getAppointmentById);
router.get("/", [authJwt.verifyToken, authJwt.isAdminOrModerator],controller.getAllAppointments);

export default router;
