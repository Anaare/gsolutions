import express from "express";

// Router imports
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

export default app;
