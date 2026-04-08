import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateUser, requireEmployer } from '../middleware/auth';

const router = Router();

// GET /schedule - Both roles (Employer: all; Employee: own only)
router.get('/', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  if (req.user?.role === 'EMPLOYER') {
    const schedules = await prisma.schedule.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: [{ date: 'asc' }, { shift: 'asc' }],
    });
    res.json(schedules);
    return;
  }

  // Employee: only own schedule
  const schedules = await prisma.schedule.findMany({
    where: { userId: req.user!.userId },
    orderBy: [{ date: 'asc' }, { shift: 'asc' }],
  });
  res.json(schedules);
});

const scheduleSchema = z.object({
  assignments: z.array(
    z.object({
      userId: z.string().uuid('userId must be a valid UUID'),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
    })
  ).min(1, 'At least one assignment is required'),
});

// PUT /schedule - Employer only
router.put('/', authenticateUser, requireEmployer, async (req: Request, res: Response): Promise<void> => {
  const parsed = scheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { assignments } = parsed.data;

  // Verify all employees exist
  const userIds = [...new Set(assignments.map((a) => a.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, role: 'EMPLOYEE' },
    select: { id: true },
  });

  if (users.length !== userIds.length) {
    res.status(400).json({ error: 'One or more user IDs are invalid or not employees' });
    return;
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
        create: {
          userId,
          date: new Date(date),
          shift,
        },
      })
    )
  );

  res.json({ assigned: results.length, schedules: results });
});

export default router;
