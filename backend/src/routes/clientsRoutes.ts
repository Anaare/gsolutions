import express from "express";
import {
  addClient,
  deleteClient,
  getAllClients,
  getClient,
  updateClient,
} from "../controllers/clientsController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllClients);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addClient").post(addClient);

router.route("/:id").get(getClient).patch(updateClient).delete(deleteClient);

export default router;
