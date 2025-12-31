import express from "express";
import {
  deleteMe,
  forgotPassword,
  getMe,
  login,
  resetPassword,
  signUp,
  updateMe,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.route("/login").post(login);

// Password related logic
router.post("/forgetPassword", forgotPassword);
router.post("/resetPassword/:resetToken", resetPassword);

// Update/Delete/Get ME

router.use(protect);

router.get("/Me", getMe);
router.patch("/updateMe", updateMe);
router.patch("/updatePassword", updatePassword);
router.delete("/deleteMe", deleteMe);

export default router;
