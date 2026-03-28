import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../controllers/old_controllers /authController.js";
import {
  addClientInvoice,
  deleteClientInvoice,
  getAllClientInvoices,
  getClientInvoice,
  updateClientInvoice,
} from "../controllers/clientInvoicesController.js";

const router = express.Router();

// router.use(protect);

router.route("/").get(getAllClientInvoices);

// router.use(restrictTo("Director", "Accountant"));

router.route("/addClientInvoice").post(addClientInvoice);

router
  .route("/:id")
  .get(getClientInvoice)
  .patch(updateClientInvoice)
  .delete(deleteClientInvoice);

export default router;
