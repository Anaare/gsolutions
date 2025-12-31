import express from "express";

const router = express.Router();

import {
  deleteUser,
  getAllUsers,
  getUser,
  updateOneUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/authController.js";

router.route("/").get(getAllUsers);

router.use(protect, restrictTo("Director"));

router.route("/:id").get(getUser).patch(updateOneUser).delete(deleteUser);

export default router;
