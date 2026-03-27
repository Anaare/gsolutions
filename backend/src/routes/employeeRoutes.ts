import express from "express";
import {
  getAllEmployees,
  addEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllEmployees);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addEmployee").post(addEmployee);
// router.patch("/restoreEmployee/:personalId", restoreEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .patch(updateEmployee)
  .delete(deleteEmployee);

export default router;
