import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addVendorBill,
  deleteVendorBill,
  getAllVendorsBills,
  getVendorBill,
  updateVendorBill,
} from "../controllers/vendorsBillsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllVendorsBills);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addVendorBill").post(addVendorBill);

router
  .route("/:id")
  .get(getVendorBill)
  .patch(updateVendorBill)
  .delete(deleteVendorBill);

export default router;
