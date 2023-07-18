import controller from "../controllers/auth.controller.js";
import express from 'express';

const router = express.Router();

router.post("/signin", controller.signin);
router.post("/refreshtoken", controller.refreshToken);
router.post("/logout", controller.logout);

export default router;
