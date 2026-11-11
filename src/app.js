import express from "express";
import { globalErrorHandler } from "./app/middlewares/error.handler.js";
import authRoutes from "./app/routes/auth.route.js";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5174",
    })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(globalErrorHandler);

export default app;
