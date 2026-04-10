import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate} from '../middleware/Authenticate';
import { requireRole } from '../middleware/RequireRole';


const router = Router();

router.use(authenticate);
router.use(requireRole('EMPLOYER'));

const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(1, 'Password is required'),
  position: z.enum(['WAITER', 'RUNNER', 'HEAD_WAITER']).default('WAITER'),
});

// GET /employees: to get all employees
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: { id: true, name: true, role: true, password: true, position: true, availabilities: true },
  });
  res.json(employees);
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createEmployeeSchema.parse(req.body);
    const employee = await prisma.user.create({
      data: { ...data, role: 'EMPLOYEE' },
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const employee = await prisma.user.findUnique({
    where: { id: req.params.id as string, role: 'EMPLOYEE' },
    select: { id: true, name: true, role: true, password: true, position: true, availabilities: true },
  });
  if (!employee) {
    res.status(404).json({ error: 'Employee not found' });
    return;
  }
  res.json(employee);
});

export default router;
