import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addPayroll,
  deletePayroll,
  getAllPayrolls,
  getPayroll,
  updatePayroll,
} from "../controllers/payrollsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllPayrolls);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addPayroll").post(addPayroll);

router.route("/:id").get(getPayroll).patch(updatePayroll).delete(deletePayroll);

export default router;
