import express from "express";

const router = express.Router();

// Controllers Import
import { getAllUsers } from "../controllers/userController.js";

router.route("/").get(getAllUsers);

export default router;
