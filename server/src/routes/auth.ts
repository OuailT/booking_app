import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../index";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger";

const router = Router();

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body); // Validate request body against the schema
      if (!parsed.success) {
        // If validation fails, return bad request with error details
        return next(
          new AppError(
            parsed.error.issues
              .map((e: z.core.$ZodIssue) => e.message)
              .join(", "),
            400,
          ),
        );
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findFirst({
        where: { email, password },
        select: { id: true, name: true, role: true },
      });

      if (!user) {
        return next(new AppError("Invalid credentials", 401));
      }

      const token = user.id; //Simple token using user Id
      logger.info(`User logged in: (id: ${user.id})`);
      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  },
);
// Return user info  on successful login
/* 
  "token": "user-id-123",
  "user": {
    "id": "user-id-123",
    "email": "admin@company.com",
    "role": "EMPLOYER"
  }*/

export default router;
