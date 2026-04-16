import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate } from '../middleware/Authenticate';
import { requireRole } from '../middleware/RequireRole';
import { AppError } from '../errors/AppError';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const availabilities = await prisma.availability.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ date: 'asc' }, { shift: 'asc' }],
    });
    res.json(availabilities);
  } catch (error) {
    next(error); // unexpected Prisma crash → 500
  }
});

router.get('/:employeeId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employeeId } = req.params;

  try {
    const availability = await prisma.availability.findMany({
      where: { userId: employeeId as string },
      orderBy: [{ date: 'asc' }, { shift: 'asc' }],
    });

    res.json(availability);
  } catch (error) {
    next(error); // unexpected Prisma crash → 500
  }
});

const availabilitySchema = z.object({
  availabilities: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
      status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'PREFERRED_TO_WORK']).default('AVAILABLE'),
    })
  ).min(1, 'At least one availability entry is required'),
});

// PUT /availability/:employeeId
router.put('/:employeeId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  const { employeeId } = req.params;

  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) {
      return next(new AppError(
        parsed.error.issues.map((e: z.core.$ZodIssue) => e.message).join(', '),
        400
      ));
    }

  const { availabilities } = parsed.data;

  // Upsert each availability entry
  const results = await Promise.all(
    availabilities.map(({ date, shift, status }) =>
      prisma.availability.upsert({
        where: {
          userId_date_shift: {
            userId: employeeId as string,
            date: new Date(date),
            shift,
          },
        },
        update: { status, approvalStatus: 'PENDING' },
        create: {
          userId: employeeId as string,
          date: new Date(date),
          shift,
          status,
          approvalStatus: 'PENDING',
        },
      })
    )
  );

  res.json({ updated: results.length, availabilities: results });
} catch (error) {
  next(error); // unexpected Prisma crash → 500
}
});

// POST /availability
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const singleSchema = z.object({
    userId: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'PREFERRED_TO_WORK']).optional().default('AVAILABLE'),
  });
try{
  const parsed = singleSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError(
      parsed.error.issues.map((e: z.core.$ZodIssue) => e.message).join(', '),
      400
    ));
  }

    const availability = await prisma.availability.create({
      data: {
        userId: parsed.data.userId,
        date: new Date(parsed.data.date),
        shift: parsed.data.shift,
        status: parsed.data.status,
        approvalStatus: 'PENDING',
      },
    });
   res.status(201).json(availability);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return next(new AppError('Availability already exists for this user, date and shift.', 409));
    }
    next(error);
  }
});

// DELETE /availability/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.availability.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error : any) {
    res.status(500).json({ error: 'Failed to delete availability or record not found' });
  if (error.code === 'P2025') {
      // Prisma "record not found" error
      return next(new AppError('Availability record not found.', 404));
  }
  next(error);
}
});

// PATCH /availability/:id/approval
router.patch('/:id/approval', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  if (!['CONFIRMED', 'REFUSED', 'PENDING'].includes(approvalStatus)) {
    res.status(400).json({ error: 'Invalid approval status' });
    return;
  }

  try {
    const updated = await prisma.availability.update({
      where: { id: id as string },
      data: { approvalStatus: approvalStatus as any },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update approval status' });
  }
});

export default router;
