import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authenticateUser, requireEmployer } from '../middleware/auth';

const router = Router();

// All employee routes require employer access
router.use(authenticateUser, requireEmployer);

const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  loginCode: z.string().min(1, 'Login code is required'),
});

// GET /employees: to get all employees
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: { id: true, name: true, role: true, loginCode: true },
  });
  res.json(employees);
});

// Alen
// 1- to create: POST /employees
// 2- to create: GET /employees/:id


