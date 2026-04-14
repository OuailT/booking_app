import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate } from '../middleware/Authenticate';
import { requireRole } from '../middleware/RequireRole';


const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const availabilities = await prisma.availability.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: [{ date: 'asc' }, { shift: 'asc' }],
  });
  res.json(availabilities);
});

router.get('/:employeeId', async (req: Request, res: Response): Promise<void> => {
  const { employeeId } = req.params;

  const availability = await prisma.availability.findMany({
    where: { userId: employeeId as string },
    orderBy: [{ date: 'asc' }, { shift: 'asc' }],
  });

  res.json(availability);
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
router.put('/:employeeId', async (req: Request, res: Response): Promise<void> => {
  const { employeeId } = req.params;

  const parsed = availabilitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.treeifyError(parsed.error) });
    return;
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
        update: { status },
        create: {
          userId: employeeId as string,
          date: new Date(date),
          shift,
          status,
        },
      })
    )
  );

  res.json({ updated: results.length, availabilities: results });
});

// POST /availability
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const singleSchema = z.object({
    userId: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    shift: z.enum(['MORNING', 'AFTERNOON', 'NIGHT']),
    status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'PREFERRED_TO_WORK']).optional().default('AVAILABLE'),
  });

  const parsed = singleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const availability = await prisma.availability.create({
      data: {
        userId: parsed.data.userId,
        date: new Date(parsed.data.date),
        shift: parsed.data.shift,
        status: parsed.data.status,
      },
    });
    res.status(201).json(availability);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Availability already exists for this user, date and shift.' });
    } else {
      res.status(500).json({ error: 'Failed to create availability' });
    }
  }
});

// DELETE /availability/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.availability.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete availability or record not found' });
  }
});

export default router;
