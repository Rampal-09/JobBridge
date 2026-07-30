import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getMe", auth, getMe);

export default router;
