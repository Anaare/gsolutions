import express from "express";

const router = express.Router();

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateOneUser,
} from "../controllers/userController.js";

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateOneUser).delete(deleteUser);

export default router;
