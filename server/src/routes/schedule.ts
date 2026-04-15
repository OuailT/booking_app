import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../index";
import { authenticate } from "../middleware/Authenticate";
import { requireRole } from "../middleware/RequireRole";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger";

const router = Router();
router.use(authenticate); //every request requires a valid token

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const schedules = await prisma.schedule.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: [{ date: "asc" }, { shift: "asc" }],
      });
      logger.info(`Fetched all schedules, count: ${schedules.length}`);
      res.json(schedules);
    } catch (error) {
      next(error);
    }
  },
);

const scheduleSchema = z.object({
  assignments: z
    .array(
      z.object({
        userId: z.string(),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
        shift: z.enum(["MORNING", "AFTERNOON", "NIGHT"]),
      }),
    )
    .min(1, "At least one assignment is required"),
});

// PUT /schedule
router.put(
  "/",
  requireRole("EMPLOYER"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = scheduleSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          new AppError(
            parsed.error.issues
              .map((e: z.core.$ZodIssue) => e.message)
              .join(", "),
            400,
          ),
        );
      }
      const { assignments } = parsed.data;

      // Verify all employees exist
      const userIds = [...new Set(assignments.map((a) => a.userId))];
      const users = await prisma.user.findMany({
        where: { id: { in: userIds }, role: "EMPLOYEE" },
        select: { id: true },
      });

      if (users.length !== userIds.length) {
        return next(
          new AppError(
            "One or more user IDs are invalid or not employees",
            400,
          ),
        );
      }

      const results = await Promise.all(
        assignments.map(({ userId, date, shift }) =>
          prisma.schedule.upsert({
            where: {
              userId_date_shift: {
                userId,
                date: new Date(date),
                shift,
              },
            },
            update: {},
            create: { userId, date: new Date(date), shift },
          }),
        ),
      );
      logger.info(`Upserted ${results.length} schedule entries`);
      res.json({ assigned: results.length, schedules: results });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
