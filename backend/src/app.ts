import express from "express";
import authRouter from "./routes/authRoutes.js";
// Router imports
import userRouter from "./routes/userRoutes.js";
import { globalErrorHandler } from "./controllers/errorController.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

export default app;
