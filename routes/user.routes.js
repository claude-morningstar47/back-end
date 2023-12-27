import controller from "../controllers/user.controller.js";
import authJwt from "../middleware/authJwt.js";
import verifySignUp from "../middleware/verifySignUp.js";

import express from "express";

const router = express.Router();

router.post("/", [verifySignUp.checkDuplicateUserOrEmail, verifySignUp.checkRolesExisted], controller.createUser);
router.get("/:id", [authJwt.verifyToken], controller.getUserById);
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

export default router;
