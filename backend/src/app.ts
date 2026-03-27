import express from "express";
import { globalErrorHandler } from "./controllers/errorController.js";

// Router imports
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import clientsRouter from "./routes/clientsRoutes.js";
import servicesRouter from "./routes/servicesRoutes.js";
import payrollsRouter from "./routes/payrollsRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/clients", clientsRouter);
app.use("/api/v1/services", servicesRouter);
app.use("/api/v1/payrolls", payrollsRouter);

app.use(globalErrorHandler);

export default app;
