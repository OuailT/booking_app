import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "../generated/prisma";
import logger from "./utils/logger";

import authRoutes from "./routes/auth";
import employeeRoutes from "./routes/employees";
import availabilityRoutes from "./routes/availability";
import scheduleRoutes from "./routes/schedule";
import { errorHandler } from "./middleware/errorHandler";

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/availability", availabilityRoutes);
app.use("/schedule", scheduleRoutes);

app.use(errorHandler); //must be last, after all routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
