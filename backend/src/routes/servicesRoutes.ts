import express from "express";

import {
  addService,
  deleteService,
  getAllServices,
  getService,
  updateService,
} from "../controllers/servicesController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllServices);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addService").post(addService);

router.route("/:id").get(getService).patch(updateService).delete(deleteService);

export default router;
