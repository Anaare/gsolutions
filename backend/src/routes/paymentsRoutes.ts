import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addPayment,
  deletePayment,
  getAllPayments,
  getPayment,
  updatePayment,
} from "../controllers/paymentsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllPayments);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addPayment").post(addPayment);

router.route("/:id").get(getPayment).patch(updatePayment).delete(deletePayment);

export default router;
