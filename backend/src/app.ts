import express from "express";

// Router imports
import userRouter from "./routes/userRoutes.js";
import { globalErrorHandler } from "./controllers/errorController.js";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

export default app;
