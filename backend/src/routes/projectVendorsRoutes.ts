import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addprojectVendor,
  deleteProjectVendor,
  getAllProjectVendors,
  getProjectVendor,
  updateProjectVendor,
} from "../controllers/projectVendorsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllProjectVendors);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addProject").post(addprojectVendor);

router
  .route("/:id")
  .get(getProjectVendor)
  .patch(updateProjectVendor)
  .delete(deleteProjectVendor);

export default router;
