import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addVendor,
  deleteVendor,
  getAllVendors,
  getVendor,
  updateVendor,
} from "../controllers/vendorsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllVendors);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addVendor").post(addVendor);

router.route("/:id").get(getVendor).patch(updateVendor).delete(deleteVendor);

export default router;
