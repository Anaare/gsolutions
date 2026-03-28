import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "../controllers/projectsController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllProjects);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addProject").post(addProject);

router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject);

export default router;
