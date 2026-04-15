import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticate} from '../middleware/Authenticate';
import { requireRole } from '../middleware/RequireRole';
import { AppError } from '../errors/AppError';

const router = Router();

router.use(authenticate);
//router.use(requireRole('EMPLOYER')); TBD

const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  position: z.enum(['WAITER', 'RUNNER', 'HEAD_WAITER']),
});

// GET /employees: to get all employees
router.get("/", async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
      position: true,
      availabilities: true,
    },
  });
  res.json(employees);
} catch(error){
  next(error); //unexpected Prisma crash → goes to errorHandler as 500
}
});

router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createEmployeeSchema.parse(req.body);
    const employee = await prisma.user.create({
      data: { ...data, role: "EMPLOYEE" },
    });
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod validation failed → format the issues and send a clear 400
      return next(new AppError(error.issues.map(e => e.message).join(', '), 400));
    }
    next(error); // unexpected Prisma crash → 500
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employee = await prisma.user.findUnique({
      where: { id: req.params.id as string, role: "EMPLOYEE" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        position: true,
        availabilities: true,
      },
    });
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }
    res.json(employee);
  } catch (error) {
    next(error); // unexpected Prisma crash → 500
  }
});

export default router;
