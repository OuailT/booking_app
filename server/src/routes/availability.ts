import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateUser, requireEmployee } from '../middleware/auth';

const router = Router();

// GET /availability/:employeeId - Both roles, but employees can only view their own
router.get('/:employeeId', authenticateUser, async (req: Request, res: Response): Promise<void> => {
  const { employeeId } = req.params;

  // Employees can only view their own availability
  if (req.user?.role === 'EMPLOYEE' && req.user.userId !== employeeId) {
    res.status(403).json({ error: 'Access denied: You can only view your own availability' });
    return;
  }

  const availability = await prisma.availability.findMany({
    where: { userId: employeeId },
    orderBy: [{ date: 'asc' }, { shift: 'asc' }],
  });

  res.json(availability);
});

const availabilitySchema = z.object({
  availabilities: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
    })
  ).min(1, 'At least one availability entry is required'),
});

// PUT /availability/:employeeId - Employee only (must be own)
router.put('/:employeeId', authenticateUser, requireEmployee, async (req: Request, res: Response): Promise<void> => {
  const { employeeId } = req.params;

  // Employees can only update their own availability
  if (req.user?.userId !== employeeId) {
    res.status(403).json({ error: 'Access denied: You can only set your own availability' });
    return;
  }

  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { availabilities } = parsed.data;

  // Upsert each availability entry
  const results = await Promise.all(
    availabilities.map(({ date, shift }) =>
      prisma.availability.upsert({
        where: {
          userId_date_shift: {
            userId: employeeId,
            date: new Date(date),
            shift,
          },
        },
        update: {},
        create: {
          userId: employeeId,
          date: new Date(date),
          shift,
        },
      })
    )
  );

  res.json({ updated: results.length, availabilities: results });
});

export default router;
