import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger";
import { log } from "node:console";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Known, intentional errors (thrown with AppError)
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message} (status: ${err.statusCode})`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Prisma errors (optional but handy)
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    logger.error(`Prisma error: ${err.message}`);
    res.status(400).json({
      success: false,
      message: "Database operation failed",
    });
    return;
  }

  // Unexpected bugs — log these, don't expose internals
  logger.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
